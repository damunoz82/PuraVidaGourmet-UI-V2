import { Injectable } from '@angular/core';
import { Departamento } from '../interfaces/departamento';
import { Observable, catchError } from 'rxjs';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  private token: string = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkbXVub3ouaG9uQGdtYWlsLmNvbSIsImlhdCI6MTcwODY5Njk2MiwiZXhwIjoxNzA4NzMyOTYyfQ.kw-rO1sf0Kvs6qtSL6J8wdGULtelN8bB2nuJkkC92e-Xdlhf9bjFH1L3FD4eC3Ia69EOhSzltZXVxwYGWWTPmA';
  private url: string = "http://localhost:8080/departamento";
  private handleError: HandleError;

  constructor(private _http: HttpClient, httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('DepartamentoService');
  }

  getDepartments(): Observable<Departamento[]> {
    const headers = new HttpHeaders(
      {
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + this.token
      }
    );
    return this._http.get<Departamento[]>(this.url, { headers: headers});
  }

  getDepartmentsById(id: number): Observable<Departamento> {
    const headers = new HttpHeaders(
      {
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + this.token
      }
    );
    return this._http.get<Departamento>(this.url + "/" + id, { headers: headers});
  }

  nuevoDepartamento(departamento: Departamento): Observable<Departamento> {
    console.log('en nuevo departamento');
    const headers = new HttpHeaders(
      {
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + this.token
      }
    );
    return this._http.post<Departamento>(this.url, departamento, {headers: headers}).pipe(
      catchError(this.handleError('addHero', departamento))
    );;
  }
}
