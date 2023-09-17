import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Task } from '../task.model';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.less']
})
export class TasksListComponent implements OnInit{
	tasks: Task[] = [];

    constructor(private apiService: ApiService) {}

    ngOnInit(): void {
        this.apiService.getTasks().subscribe((tasks) => {
            this.tasks = tasks;
        });
    }
}
