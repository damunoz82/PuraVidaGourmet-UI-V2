import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { LoginRequest,  } from '../interfaces/loginRequest';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { TokenInfo } from '../interfaces/tokenInfo';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {
  public inputEmail = "";
  public inputPassword = "";

  public alertInfo = {
    'show': false,
    'type': 'danger', //primary, danger
    'message': ''
  };
  public alertShowing = false;

  constructor(private _authService: AuthService,
    private _storageService: StorageService,
    private _router: Router) {
    
  }

  ngOnInit() {
  }

  login() {
    console.log( "Trying loging: " + this.inputEmail + " - " + this.inputPassword);
    let user: LoginRequest = {
      "email": this.inputEmail,
      "password": this.inputPassword
    }
    this._authService.login(user).pipe(
        catchError(this.handleError('loginRequest'))
      ).subscribe((loginInfo) => {
        this._storageService.clean();
        this._storageService.setSessionInfo(loginInfo as TokenInfo);
        this._router.navigate(['/admin']);
      });
  }

  handleError<T>(serviceName = '', operation = 'operation', result = {} as T) {
    return (error: HttpErrorResponse): Observable<T> => {
      this.alertInfo.message = "Correo electronico y/o contrasenia incorrectos.";
      this.alertInfo.type = 'danger';
      this.alertInfo.show = true;
      this.alertShowing = true;

      return throwError(() => new Error('Error a la hora de autenticar.'));
    };
  }
}
