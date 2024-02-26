import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router'
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ContentComponent } from '../content/content.component';

@Component({
  selector: 'app-admin-main-page',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, ContentComponent, CommonModule, RouterModule, RouterOutlet],
  templateUrl: './admin-main-page.component.html',
  styleUrl: './admin-main-page.component.css'
})
export class AdminMainPageComponent implements OnInit {

  path = "";
  isHome = true;

  constructor(private router: Router) {}

  ngOnInit() {
    this.isHome = this.router.url === '/admin';
  }
}
