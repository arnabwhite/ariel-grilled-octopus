import { Component, inject, Input, Output, EventEmitter, OnInit, signal, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.html'
})
export class TaskFormComponent implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);

  @Input() task: Task | null = null;

  @Output() save = new EventEmitter<Task>();
  @Output() close = new EventEmitter<void>();

  taskForm!: FormGroup;
  readonly assignees = signal<string[]>([]);

  @ViewChild('taskDialog') dialog!: ElementRef<HTMLDialogElement>;

  ngAfterViewInit() {

    this.dialog.nativeElement.showModal();
  }

  ngOnInit() {
    this.taskForm = this.fb.group({
      title: [this.task?.title || '', [Validators.required, Validators.minLength(5)]],
      description: [this.task?.description || ''],
      assignedToEmail: [this.task?.assignedToEmail || '', [Validators.required, Validators.email]],
      status: [this.task?.status || 'TODO', [Validators.required]]
    });


    this.taskService.getAssignees().subscribe({
      next: (emails) => this.assignees.set(emails)
    });
  }

  onSubmit() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }
    this.save.emit(this.taskForm.value);
  }

  onCancel() {
    this.close.emit();
  }


  get titleErrors(): string {
    const control = this.taskForm.get('title');
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'Title is required';
      if (control.errors['minlength']) return 'Title must be at least 5 characters long';
    }
    return '';
  }

  get assignedErrors(): string {
    const control = this.taskForm.get('assignedToEmail');
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'Assigned email is required';
      if (control.errors['email']) return 'Please enter a valid email address';
    }
    return '';
  }
}
