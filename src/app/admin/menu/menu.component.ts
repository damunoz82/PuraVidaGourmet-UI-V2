import { Component, OnInit } from '@angular/core';
import { Menu } from '../../interfaces/menu';
import { MenuService } from '../../services/menu.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
 
  public menus: Menu[] = [];

  constructor(private _menuService: MenuService, private _router: Router) {}

  ngOnInit() {
    this.loadMenus();
  }

  loadMenus() {
    this._menuService.getMenus().subscribe(menus => {
      this.menus = menus;
    });
  }

  viewDetails (id: number) {
    this._router.navigate(['/admin/menu-details/' + id]);
  }

  newMenu() {
    this._router.navigate(['/admin/menu-details'])
  }

  displayMenuEstadoText(estado: boolean) {
    return (estado) ? 'Activo' : 'Inactivo';
  }

  styleMenuEstadoText(estado: boolean) {
    return (estado) ? 'success' : 'warning';
  }
}
