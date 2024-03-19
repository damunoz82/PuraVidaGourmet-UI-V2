import { Injectable } from '@angular/core';
import { Mesa } from '../interfaces/mesa';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class MesaService {

  private url: string = "http://localhost:8080/restaurante-mesa";

  constructor(private _http: HttpClient,
    private _storageService: StorageService) {
  }

  getMesas(): Observable<Mesa[]> {
    return this._http.get<Mesa[]>(this.url, { headers: this._storageService.buildHeader()});
  }

  getMesaById(id: number): Observable<Mesa> {
    return this._http.get<Mesa>(this.url + "/" + id, { headers: this._storageService.buildHeader()});
  }

  newMesa(mesa: Mesa): Observable<Mesa> {
    return this._http.post<Mesa>(this.url, mesa, {headers: this._storageService.buildHeader()});
  }

  updateMesa(mesa: Mesa): Observable<Mesa> {
    return this._http.put<Mesa>(this.url + "/" + mesa.id, mesa, {headers: this._storageService.buildHeader()});
  }

  deleteMesa(mesa: Mesa): Observable<Mesa> {
    return this._http.delete<Mesa>(this.url + "/" + mesa.id, {headers: this._storageService.buildHeader()});
  }
}