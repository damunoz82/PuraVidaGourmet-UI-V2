import { Injectable } from '@angular/core';
import { Receta } from '../interfaces/receta';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class RecetaService {

  private url: string = "http://localhost:8080/receta";

  constructor(private _http: HttpClient,
    private _storageService: StorageService) {
  }

  getRecetas(): Observable<Receta[]> {
    return this._http.get<Receta[]>(this.url, { headers: this._storageService.buildHeader()});
  }

  getRecetaById(id: number): Observable<Receta> {
    return this._http.get<Receta>(this.url + "/" + id, { headers: this._storageService.buildHeader()});
  }

  newReceta(receta: Receta): Observable<Receta> {
    return this._http.post<Receta>(this.url, receta, {headers: this._storageService.buildHeader()});
  }

  updateReceta(receta: Receta): Observable<Receta> {
    return this._http.put<Receta>(this.url + "/" + receta.id, receta, {headers: this._storageService.buildHeader()});
  }

  deleteReceta(receta: Receta): Observable<Receta> {
    return this._http.delete<Receta>(this.url + "/" + receta.id, {headers: this._storageService.buildHeader()});
  }
}
