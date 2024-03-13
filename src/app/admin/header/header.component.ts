import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router'
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, RouterOutlet],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private _storageService: StorageService,
    private _router: Router) {
    
  }

  logout() {
    this._storageService.clean();
    this._router.navigate(['']);
  }

}
