import { Injectable } from '@angular/core';
import { TipoReceta } from '../interfaces/tipoReceta';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TipoRecetaService {

  private url: string = "http://localhost:8080/categoria-receta";

  constructor(private _http: HttpClient,
    private _storageService: StorageService) {
  }

  getTipoRecetas(): Observable<TipoReceta[]> {
    return this._http.get<TipoReceta[]>(this.url, { headers: this._storageService.buildHeader()});
  }

  getTipoRecetaById(id: number): Observable<TipoReceta> {
    return this._http.get<TipoReceta>(this.url + "/" + id, { headers: this._storageService.buildHeader()});
  }

  newTipoReceta(tipoReceta: TipoReceta): Observable<TipoReceta> {
    return this._http.post<TipoReceta>(this.url, tipoReceta, {headers: this._storageService.buildHeader()});
  }

  updateTipoReceta(tipoReceta: TipoReceta): Observable<TipoReceta> {
    return this._http.put<TipoReceta>(this.url + "/" + tipoReceta.id, tipoReceta, {headers: this._storageService.buildHeader()});
  }

  deleteTipoReceta(tipoReceta: TipoReceta): Observable<TipoReceta> {
    return this._http.delete<TipoReceta>(this.url + "/" + tipoReceta.id, {headers: this._storageService.buildHeader()});
  }
}
