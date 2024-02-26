import { Observable, catchError } from 'rxjs';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private token: string = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkbXVub3ouaG9uQGdtYWlsLmNvbSIsImlhdCI6MTcwODY5Njk2MiwiZXhwIjoxNzA4NzMyOTYyfQ.kw-rO1sf0Kvs6qtSL6J8wdGULtelN8bB2nuJkkC92e-Xdlhf9bjFH1L3FD4eC3Ia69EOhSzltZXVxwYGWWTPmA';
  private url: string = "http://localhost:8080/user";

  constructor(private _http: HttpClient, httpErrorHandler: HttpErrorHandler) { }

  getUsuarios(): Observable<User[]> {
    const headers = new HttpHeaders(
      {
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + this.token
      }
    );
    return this._http.get<User[]>(this.url, { headers: headers});
  }
}
