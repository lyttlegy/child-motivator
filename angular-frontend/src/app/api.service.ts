import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Person } from './person.model';

import { Task } from './task.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api'; 

  constructor(private http: HttpClient) { }
  
	//getPersons(): Observable<Person[]> {
		//return this.http.get<Person[]>(`${this.baseUrl}/persons`);
	//}
	getTasks(): Observable<Task[]> {
		return this.http.get<Task[]>(`${this.baseUrl}/tasks`);
	}

}
