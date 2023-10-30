import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Task } from '../task.model';
import { Point } from '../point.model';
import { Person } from '../person.model';

@Component({
  selector: 'app-point',
  templateUrl: './point.component.html',
  styleUrls: ['./point.component.less']
})
export class PointComponent {
	tasks: Task[] = [];
	children: Person[] = [];

    constructor(private apiService: ApiService) {}

    ngOnInit(): void {
        this.apiService.getTasks().subscribe((tasks) => {
            this.tasks = tasks;
        });
        this.apiService.getChildren().subscribe((persons) => {
            this.children = persons;
        });
    }

}
