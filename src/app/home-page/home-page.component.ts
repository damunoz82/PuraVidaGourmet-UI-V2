import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterModule, RouterOutlet],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  placeholder= "Placeholder for Home Page for Pura Vida Gourmet";
}
