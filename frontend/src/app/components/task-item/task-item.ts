import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-task-item, [app-task-item]',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-item.html'
})
export class TaskItemComponent {
  authService = inject(AuthService);

  @Input() task!: Task;
  @Input() isCardView: boolean = true;

  @Output() statusChange = new EventEmitter<{ id: number; status: string }>();
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<number>();


  canChangeStatus(): boolean {
    if (this.authService.isAdmin()) return true;
    const currentUser = this.authService.currentUser();
    return currentUser?.email === this.task.assignedToEmail;
  }


  canManageTask(): boolean {
    return this.authService.isAdmin();
  }

  onStatusSelect(status: string) {
    this.statusChange.emit({ id: this.task.id!, status });
  }

  onEditClick() {
    this.edit.emit(this.task);
  }

  onDeleteClick() {
    this.delete.emit(this.task.id!);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'TODO':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      case 'IN_PROGRESS':
        return 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400';
      case 'DONE':
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      default:
        return 'bg-slate-500/10 border-slate-500/20 text-slate-400';
    }
  }
}
