import { Injectable } from '@angular/core';
import { Departamento } from '../interfaces/departamento';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from './storage.service';
import { Inventario } from '../interfaces/inventario';

@Injectable({
    providedIn: 'root'
  })
  export class InventarioService {

    private url: string = "http://localhost:8080/inventario";

    constructor(private _http: HttpClient,
        private _storageService: StorageService) {
    }

    getInventarios(): Observable<Inventario[]> {
        return this._http.get<Inventario[]>(this.url, { headers: this._storageService.buildHeader()});
    }

    getInventarioById(id: number): Observable<Inventario> {
      return this._http.get<Inventario>(this.url + "/" + id, { headers: this._storageService.buildHeader()});
    }

    createNewInventario(inventario: Inventario): Observable<any> {
      return this._http.post<any[]>(this.url, inventario, 
        {
          headers: this._storageService.buildHeader(),
          observe: 'response'
        });
    }

    actualizarInventario(inventario: Inventario): Observable<Inventario> {
      return this._http.put<Inventario>(this.url + "/" + inventario.id, inventario, {headers: this._storageService.buildHeader()});
    }

    abandonarInventario(id: number): Observable<Inventario> {
      return this._http.post<Inventario>(this.url + "/" + id + "/abandonado", null, {headers: this._storageService.buildHeader()});
    }

    terminarInventario(id: number): Observable<Inventario> {
      return this._http.post<Inventario>(this.url + "/" + id + "/terminado", null, {headers: this._storageService.buildHeader()});
    }
  }