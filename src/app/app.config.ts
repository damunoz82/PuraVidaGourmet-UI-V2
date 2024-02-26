import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { routes } from './app.routes';
import { DepartamentoService } from './services/departamento.service';
import { HttpErrorHandler } from './http-error-handler.service';
import { FormsModule,  ReactiveFormsModule }  from  '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    DepartamentoService,
    HttpErrorHandler,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule
  ]
};
