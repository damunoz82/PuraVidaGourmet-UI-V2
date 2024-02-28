import { Injectable } from '@angular/core';
import { Departamento } from '../interfaces/departamento';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  private url: string = "http://localhost:8080/departamento";

  constructor(private _http: HttpClient,
    private _storageService: StorageService) {
  }

  getDepartments(): Observable<Departamento[]> {
    return this._http.get<Departamento[]>(this.url, { headers: this.getHeaders()});
  }

  getDepartmentsById(id: number): Observable<Departamento> {
    return this._http.get<Departamento>(this.url + "/" + id, { headers: this.getHeaders()});
  }

  nuevoDepartamento(departamento: Departamento): Observable<Departamento> {
    return this._http.post<Departamento>(this.url, departamento, {headers: this.getHeaders()});
  }

  updateDepartamento(departamento: Departamento): Observable<Departamento> {
    return this._http.put<Departamento>(this.url + "/" + departamento.id, departamento, {headers: this.getHeaders()});
  }

  deleteDepartamento(departamento: Departamento): Observable<Departamento> {
    return this._http.delete<Departamento>(this.url + "/" + departamento.id, {headers: this.getHeaders()});
  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders(
      {
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + this._storageService.getSessionInfo().accessToken,
      }
    );
  }
}
