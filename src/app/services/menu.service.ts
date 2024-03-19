import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { Menu } from '../interfaces/menu';
import { MenuItem } from '../interfaces/menuItem';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private url: string = "http://localhost:8080/menu";
  private urlItems: string = "http://localhost:8080/item-menu";

  constructor(private _http: HttpClient,
    private _storageService: StorageService) { }

    // menu 
    getMenus(): Observable<Menu[]> {
      return this._http.get<Menu[]>(this.url, { headers: this._storageService.buildHeader()});
    }

    getMenuById(id: number): Observable<Menu> {
      return this._http.get<Menu>(this.url + "/" + id, { headers: this._storageService.buildHeader()});
    }

    newMenu(menu: Menu): Observable<Menu> {
      return this._http.post<Menu>(this.url, menu, {headers: this._storageService.buildHeader()});
    }

    updateMenu(menu: Menu): Observable<Menu> {
      return this._http.put<Menu>(this.url + "/" + menu.id, menu, {headers: this._storageService.buildHeader()});
    }


    // item menu
    getMenuItems(): Observable<MenuItem[]> {
      return this._http.get<MenuItem[]>(this.urlItems, {headers: this._storageService.buildHeader()});
    }

    getMenuItemById(id: number): Observable<MenuItem> {
      return this._http.get<MenuItem>(this.urlItems + "/" + id, {headers: this._storageService.buildHeader()});
    }

    newMenuItem(menuItem: MenuItem): Observable<MenuItem> {
      return this._http.post<MenuItem>(this.urlItems, menuItem, {headers: this._storageService.buildHeader()});
    }
  
    updateMenuItem(menuItem: MenuItem): Observable<MenuItem> {
      return this._http.put<MenuItem>(this.urlItems + "/" + menuItem.itemMenuId, menuItem, {headers: this._storageService.buildHeader()});
    }
  
    deleteMenuItem(menuItem: MenuItem): Observable<MenuItem> {
      return this._http.delete<MenuItem>(this.urlItems + "/" + menuItem.itemMenuId, {headers: this._storageService.buildHeader()});
    }
}
