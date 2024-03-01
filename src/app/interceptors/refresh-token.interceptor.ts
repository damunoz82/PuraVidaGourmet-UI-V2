import { HttpInterceptorFn } from '@angular/common/http';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { TokenInfo } from '../interfaces/tokenInfo';

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  let isRefreshing = false;
  let storageService = inject(StorageService);
  let authService = inject(AuthService);
  let router = inject(Router);

  const authReq = req.clone({
    withCredentials: true,
  });

  return next(authReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        
        if (!isRefreshing) {
          isRefreshing = true;

          if (storageService.isLoggedIn()) {
            // attempt to refresh token
            authService.refreshToken().pipe(
              tap((loginInfo) => {
                  storageService.setSessionInfo(loginInfo as TokenInfo);
              }),
              catchError((error) => {
                router.navigate(['/login']);
                return throwError(() => error);
              })
            ).subscribe(loginInfo => {
              return next(req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + storageService.getSessionInfo().accessToken)
              }));
            });
          }
        }
      }
      return throwError(() => error);
    })
  );
};