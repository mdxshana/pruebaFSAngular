import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User } from '../models/User.model';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  //////////////////////////////////////////////////////////////
  // metodo usuado para el login basico de usuario
  //////////////////////////////////////////////////////////////
  login(user: User): Observable<any> {
    let url = environment.urlBase + 'login';
    return this.http.post(url, user).pipe(
      map((resp: any) => {
        console.log(resp);
        localStorage.setItem('token', resp.token);
        localStorage.setItem('user', JSON.stringify(resp.user));
      })
    );
  }

  register(user: User): Observable<any> {
    let url = environment.urlBase + 'register';
    return this.http.post(url, user).pipe(catchError(this.error));
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
