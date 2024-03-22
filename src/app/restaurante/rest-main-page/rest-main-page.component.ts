import { Component,OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-rest-main-page',
  standalone: true,
  imports: [RouterModule, RouterOutlet],
  templateUrl: './rest-main-page.component.html',
  styleUrl: './rest-main-page.component.css'
})
export class RestMainPageComponent implements OnInit {


  ngOnInit() {
  }

}
