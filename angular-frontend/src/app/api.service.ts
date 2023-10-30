import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Person } from './person.model';
import { Task } from './task.model';
import { Point } from './point.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api'; 
  private test = true;
  constructor(private http: HttpClient) { }
  
	getChildren(): Observable<Person[]> {
		return this.http.get<Person[]>(`${this.baseUrl}/persons/children`);
	}
	getTasks(): Observable<Task[]> {
		return this.http.get<Task[]>(`${this.baseUrl}/tasks`);
	}
	savePoint(point: Point): Observable<Point> {
		return this.http.post<Point>(`${this.baseUrl}/points`, point).pipe(delay(3000));
	}

}
