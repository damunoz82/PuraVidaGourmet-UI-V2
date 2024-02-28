import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginRequest } from '../interfaces/loginRequest';
import { TokenInfo } from '../interfaces/tokenInfo';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url: string = "http://localhost:8080/auth/";

  constructor(private _http: HttpClient,
    private _storageService: StorageService) { }

  login(user: LoginRequest): Observable<TokenInfo> {
    console.log("in login");
    const headers = new HttpHeaders(
      {
        'Content-Type':  'application/json'
      }
    );
    return this._http.post<TokenInfo>(this.url + "login", user, { headers: headers});
  }

  refreshToken(): Observable<TokenInfo> {
    const headers = new HttpHeaders(
      {
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + this._storageService.getSessionInfo().refreshToken,
      }
    );
    return this._http.post<TokenInfo>(this.url + "refresh-token", {}, { headers: headers});
  }
}
