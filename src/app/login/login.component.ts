import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router'
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, RouterOutlet, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {
  public inputEmail = "";
  public inputPassword = "";

  ngOnInit() {

  }

  login() {
    console.log( "Trying loging: " + this.inputEmail + " - " + this.inputPassword);
  }
}
