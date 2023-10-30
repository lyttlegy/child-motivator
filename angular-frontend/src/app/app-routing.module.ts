import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksListComponent } from './tasks-list/tasks-list.component';
import { PointAddComponent } from './point-add/point-add.component';
import { PointComponent } from './point/point.component';

const routes: Routes = [
    { path: 'tasks', component: TasksListComponent },
    { path: 'points/add', component: PointAddComponent },
    { path: 'points', component: PointComponent },
	];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
