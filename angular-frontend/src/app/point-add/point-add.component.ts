import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Task } from '../task.model';
import { Point } from '../point.model';
import { Person } from '../person.model';

@Component({
  selector: 'app-point-add',
  templateUrl: './point-add.component.html',
  styleUrls: ['./point-add.component.less']
})
export class PointAddComponent {
	tasks: Task[] = [];
	children: Person[] = [];
	savePoint(task: Task, child: Person): void {
		this.loading = true;
		let point:Point = {
			TaskID: task.TaskID,
			PersonID: child.PersonID,
			Points: task.Point
		};
		this.apiService.savePoint(point).subscribe((r) => {
			task.Done=true;
			this.loadingDone = true;
			setTimeout(() => {this.loadingDone = false; this.loading=false; }, 2000);
		});
	}
	loading: boolean = false;
	loadingDone: boolean = false;

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
