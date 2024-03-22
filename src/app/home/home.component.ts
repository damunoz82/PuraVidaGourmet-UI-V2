import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router'
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  constructor(private _router: Router, 
    private _storageService: StorageService) {}

  ngOnInit() {
    if (!this._storageService.isLoggedIn()) {
      this._router.navigate(['']);
    }
  }

}
