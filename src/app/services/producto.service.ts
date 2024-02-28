import { Injectable } from '@angular/core';
import { Producto } from '../interfaces/producto';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private url: string = "http://localhost:8080/producto";

  constructor(private _http: HttpClient,
    private _storageService: StorageService) {
  }

  getProductos(): Observable<Producto[]> {
    return this._http.get<Producto[]>(this.url, { headers: this._storageService.buildHeader()});
  }

  getProductoById(id: number): Observable<Producto> {
    return this._http.get<Producto>(this.url + "/" + id, { headers: this._storageService.buildHeader()});
  }

  newProducto(producto: Producto): Observable<Producto> {
    return this._http.post<Producto>(this.url, producto, {headers: this._storageService.buildHeader()});
  }

  updateProducto(producto: Producto): Observable<Producto> {
    return this._http.put<Producto>(this.url + "/" + producto.id, producto, {headers: this._storageService.buildHeader()});
  }

  deleteProducto(producto: Producto): Observable<Producto> {
    return this._http.delete<Producto>(this.url + "/" + producto.id, {headers: this._storageService.buildHeader()});
  }
}
