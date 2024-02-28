import { Observable, catchError } from 'rxjs';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../interfaces/user';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  
  private url: string = "http://localhost:8080/user";

  constructor(private _http: HttpClient,
    private _storageService: StorageService) { }

  getUsuarios(): Observable<User[]> {
    return this._http.get<User[]>(this.url, { headers: this._storageService.buildHeader()});
  }
}
