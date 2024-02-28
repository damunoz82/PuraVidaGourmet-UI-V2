import { Injectable } from '@angular/core';
import { TipoProducto } from '../interfaces/tipoProducto';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TipoProductoService {

  private url: string = "http://localhost:8080/tipo-producto";

  constructor(private _http: HttpClient,
    private _storageService: StorageService) {
  }

  getTipoProductos(): Observable<TipoProducto[]> {
    return this._http.get<TipoProducto[]>(this.url, { headers: this._storageService.buildHeader()});
  }

  getTipoProductoById(id: number): Observable<TipoProducto> {
    return this._http.get<TipoProducto>(this.url + "/" + id, { headers: this._storageService.buildHeader()});
  }

  newTipoProducto(tipoProducto: TipoProducto): Observable<TipoProducto> {
    return this._http.post<TipoProducto>(this.url, tipoProducto, {headers: this._storageService.buildHeader()});
  }

  updateTipoProducto(tipoProducto: TipoProducto): Observable<TipoProducto> {
    return this._http.put<TipoProducto>(this.url + "/" + tipoProducto.id, tipoProducto, {headers: this._storageService.buildHeader()});
  }

  deleteTipoProducto(tipoProducto: TipoProducto): Observable<TipoProducto> {
    return this._http.delete<TipoProducto>(this.url + "/" + tipoProducto.id, {headers: this._storageService.buildHeader()});
  }
}
