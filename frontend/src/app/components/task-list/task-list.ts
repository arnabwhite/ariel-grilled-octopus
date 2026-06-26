import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService, Task } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { TaskFormComponent } from '../task-form/task-form';
import { TaskItemComponent } from '../task-item/task-item';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [FormsModule, TaskFormComponent, TaskItemComponent],
  templateUrl: './task-list.html'
})
export class TaskListComponent implements OnInit {
  private taskService = inject(TaskService);
  authService = inject(AuthService);
  private toastService = inject(ToastService);


  readonly tasks = signal<Task[]>([]);
  readonly searchQuery = signal<string>('');
  readonly statusFilter = signal<string>('');
  readonly isCardView = signal<boolean>(true);
  

  readonly isFormOpen = signal<boolean>(false);
  readonly selectedTask = signal<Task | null>(null);

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks(this.searchQuery(), this.statusFilter()).subscribe({
      next: (data) => {
        this.tasks.set(data);
      },
      error: () => {

      }
    });
  }

  onSearch() {
    this.loadTasks();
  }

  onFilterChange(status: string) {
    this.statusFilter.set(status);
    this.loadTasks();
  }

  toggleView(cardView: boolean) {
    this.isCardView.set(cardView);
  }

  getTasksByStatus(status: string): Task[] {
    return this.tasks().filter(t => t.status === status);
  }

  openCreateModal(defaultStatus: string = 'TODO') {
    if (!this.authService.isAdmin()) return;
    this.selectedTask.set({ status: defaultStatus } as Task);
    this.isFormOpen.set(true);
  }

  openEditModal(task: Task) {
    if (!this.authService.isAdmin()) return;
    this.selectedTask.set(task);
    this.isFormOpen.set(true);
  }

  closeForm() {
    this.isFormOpen.set(false);
    this.selectedTask.set(null);
  }

  onFormSubmit(taskData: Task) {
    if (this.selectedTask() && this.selectedTask()!.id !== undefined) {

      const taskId = this.selectedTask()!.id!;
      this.taskService.updateTask(taskId, taskData).subscribe({
        next: () => {
          this.closeForm();
          this.loadTasks();
          this.toastService.success(`Task "${taskData.title}" updated successfully.`);
        }
      });
    } else {

      this.taskService.createTask(taskData).subscribe({
        next: () => {
          this.closeForm();
          this.loadTasks();
          this.toastService.success(`Task "${taskData.title}" created successfully.`);
        }
      });
    }
  }

  onStatusChange(event: { id: number; status: string }) {
    this.taskService.updateTask(event.id, { status: event.status }).subscribe({
      next: () => {
        this.loadTasks();
        this.toastService.success(`Task status updated to ${event.status}.`);
      }
    });
  }

  onDeleteTask(id: number) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.loadTasks();
        this.toastService.success('Task deleted successfully.');
      }
    });
  }
}
