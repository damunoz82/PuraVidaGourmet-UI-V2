import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router'
import { AdminMainPageComponent } from './admin/admin-main-page/admin-main-page.component';
import { HomePageComponent } from './home-page/home-page.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet, AdminMainPageComponent, HomePageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
