import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);


  readonly isLoginMode = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly isLoading = signal<boolean>(false);

  authForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  toggleMode() {
    this.isLoginMode.update(val => !val);
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.authForm.reset({ email: '', password: '' });
  }

  onSubmit() {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const email = this.authForm.value.email;
    const password = this.authForm.value.password;

    if (this.isLoginMode()) {
      this.authService.login({ email, password }).subscribe({
        next: () => {
          this.toastService.success('Login successful! Welcome back.');
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.isLoading.set(false);
          const backendError = err.error?.error || err.error?.email || err.error?.password || 'Login failed. Please check credentials.';
          this.errorMessage.set(backendError);
          this.toastService.error(backendError);
        }
      });
    } else {
      this.authService.register({ email, password }).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.successMessage.set('Registration successful! You can now log in.');
          this.toastService.success('Registration successful! Please log in.');
          this.isLoginMode.set(true);
          this.authForm.patchValue({ password: '' });
        },
        error: (err) => {
          this.isLoading.set(false);
          const backendError = err.error?.error || err.error?.email || err.error?.password || 'Registration failed. Try again.';
          this.errorMessage.set(backendError);
          this.toastService.error(backendError);
        }
      });
    }
  }


  get emailErrors() {
    const control = this.authForm.get('email');
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'Email is required';
      if (control.errors['email']) return 'Please enter a valid email address';
    }
    return '';
  }

  get passwordErrors() {
    const control = this.authForm.get('password');
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'Password is required';
      if (control.errors['minlength']) return 'Password must be at least 8 characters long';
    }
    return '';
  }
}
