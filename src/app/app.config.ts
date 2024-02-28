import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { routes } from './app.routes';
import { DepartamentoService } from './services/departamento.service';
import { HttpErrorHandler } from './http-error-handler.service';
import { FormsModule,  ReactiveFormsModule }  from  '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { refreshTokenInterceptor } from './interceptors/refresh-token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([refreshTokenInterceptor])),
    importProvidersFrom(HttpClientModule),
    DepartamentoService,
    HttpErrorHandler,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule
  ]
};
