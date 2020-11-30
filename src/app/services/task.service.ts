import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Task } from '../models/Task.model';
import swal from 'sweetalert2';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }


  task():Observable<any>{
    let url = environment.urlBase + 'tasks';
    return this.http.get(url).pipe(catchError(this.error));
  }

  store(task:Task): Observable<any>{
    let url = environment.urlBase + 'tasks';
    return this.http.post(url, task).pipe(catchError(this.error));
  }

  update(task:Task){
    task.date_expire = moment(task.date_expire).format('YYYY-MM-DD');
    let url = `${environment.urlBase}tasks/${task._id}`;
    return this.http.put(url, task).pipe(catchError(this.error));
  }

  destroy(task:Task){
    let url = `${environment.urlBase}tasks/${task._id}`;
    return this.http.delete(url).pipe(catchError(this.error));
  }



  // Handle Errors
  error(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.status == 500) {
        console.log(error);
        swal.fire('Advertencia', error.error.err.message, 'error');
      }
    }
    return throwError(errorMessage);
  }
}
