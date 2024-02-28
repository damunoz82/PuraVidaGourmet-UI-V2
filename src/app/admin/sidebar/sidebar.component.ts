import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router'
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, RouterOutlet],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  public userLoggedIn: string = '';

  constructor(private _storageService: StorageService) {}

  ngOnInit() {
    this.userLoggedIn = this._storageService.getSessionInfo().userName;
  } 

}
