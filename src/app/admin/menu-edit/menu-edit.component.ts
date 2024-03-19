import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from '../../interfaces/menuItem';
import { Menu, createEmptyMenu } from '../../interfaces/menu';
import { MenuService } from '../../services/menu.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuSeccion, createEmtpyMenuSeccion } from '../../interfaces/menuSeccion';

@Component({
  selector: 'app-menu-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-edit.component.html',
  styleUrl: './menu-edit.component.css'
})
export class MenuEditComponent implements OnInit {

  @Input() id!:string;
  isEditing: boolean = false;

  // cards
  menuCards: MenuEditCard[] = [];
  itemsCards: MenuEditCard[] = [];

  // input
  public nombreMenu: string = '';
  public descripcion: string = '';
  public temporada: string = '';
  public habilitado: boolean = true;
  public nombreSeccion: string = '';
  public currentItemDraged: MenuEditCard = this.createEmtpyRecetaEditCard();
  public origen: string = '';

  // required data
  menuItems: MenuItem[] = [];

  menu: Menu = createEmptyMenu();

  constructor(private _menuService: MenuService, private _router: Router) {}

  ngOnInit() {
    this.loadMenuItems();
    if (this.id === undefined) {
      // creating a new one
      this.isEditing = false;

    } else {
      // editing an existing menu
      this.isEditing = true;
      this.loadMenu();

    }
  }

  loadMenu() {
    this._menuService.getMenuById(+this.id).subscribe(menu => {
      this.menu = menu;
      this.nombreMenu = menu.nombre;
      this.descripcion = menu.descripcion;
      this.temporada = menu.temporada;
      this.habilitado = menu.menuEstado;
      this.buildMenuUI();
    })
  }

  loadMenuItems() {
    this._menuService.getMenuItems().subscribe(menuItems => {
      this.menuItems = menuItems;
      this.buildMenuItemCards();
    })
  }

  buildMenuUI() {
    this.menu.secciones.forEach(s => {
      let seccion: MenuEditCard = this.createSeccionCard(s.seccionId, s.nombre);
      this.menuCards.push(seccion)
      s.itemMenus.forEach(im => {
        let menuItem: MenuEditCard = this.createMenuItemCard(im.itemMenuId, im.nombreComercial? im.nombreComercial : '', im.descripcion? im.descripcion : '');
        this.menuCards.push(menuItem);
      })
    });
  }

  buildMenuItemCards() {
    this.menuItems.forEach(i => {
      let menuItemCard: MenuEditCard = this.createMenuItemCard(i.itemMenuId,
        i.nombreComercial? i.nombreComercial + ' - ₡ ' + this.formatValorEnMoneda(i.precioVenta? i.precioVenta : 0) : '',
        i.descripcion? i.descripcion : '');
      this.itemsCards.push(menuItemCard);
    });
  }

  addSeccion() {
    if (this.nombreSeccion === '') {
      return
    }
    let seccion: MenuEditCard = this.createSeccionCard(0, this.nombreSeccion);
    this.menuCards.push(seccion);
    this.nombreSeccion = '';
  }

  createSeccionCard(id: number, nombreSeccion: string) {
    return {
      'id': id,
      'text': nombreSeccion,
      'type': 'seccion',
      'descripcion': '',
      'identifier': this.generateRandomIdentifier(8)
    };
  }

  createMenuItemCard(id: number, nombreMenuItem: string, descripcion:string) {
    return {
      'id': id,
      'text': nombreMenuItem,
      'type': 'menuItem',
      'descripcion': descripcion,
      'identifier': this.generateRandomIdentifier(8)
    };
  }

  addStyle(s: string): string {
    return s === 'seccion' ? 'list-group-item-secondary' : '';
  }

  cancel() {
    this._router.navigate(['/admin/menu']);
  }

  guardar() {
    let isValid = this.buildAndValidateMenuObjetToSave();
    if (isValid) {
      if (this.id === undefined) {
        this._menuService.newMenu(this.menu).subscribe(res => {
          this._router.navigate(['/admin/menu']);
        });
      } else {
        this._menuService.updateMenu(this.menu).subscribe(res => {
          this._router.navigate(['/admin/menu']);
        });
      }
    }
  }

  buildAndValidateMenuObjetToSave(): boolean {
    let isValid = true;
    this.menu.id = +this.id;
    this.menu.nombre = this.nombreMenu;
    this.menu.descripcion = this.descripcion;
    this.menu.temporada = this.temporada;
    this.menu.menuEstado = this.habilitado;

    // clean up
    this.menu.secciones = [];


    let currentSeccion: MenuSeccion = createEmtpyMenuSeccion();
    this.menuCards.forEach(c => {

      if (c.type === 'seccion') {
        if (currentSeccion.nombre !== '') {
          this.menu.secciones.push(currentSeccion);
        }
        currentSeccion = {
          seccionId: c.id,
          nombre: c.text,
          itemMenus: []
        };
        return true;
      }

      if (c.type === 'menuItem' && currentSeccion.nombre === '') {
        isValid = false;
        return false;
      }

      if (c.type === 'menuItem' && currentSeccion !== undefined) {
        currentSeccion.itemMenus.push({
          itemMenuId: c.id
        });
        return true;
      }

      return false;

    });
    this.menu.secciones.push(currentSeccion);

    // validate that there are no empty sections.

    return isValid;
  }

  // drag and drop functions.
  onDragStart(menuItem: MenuEditCard, origen: string) {
    this.currentItemDraged = menuItem;
    this.currentItemDraged.identifier = this.generateRandomIdentifier(8);
    this.origen = origen;
  }

  onDragOver(event: any) {
    event.preventDefault();
  }

  onDrop(event: any, dest: string) {
    const target = event.target;
    let index = +target.id;


    if (this.origen === 'items' && dest === 'menu') {
      // add item to menu
      if (index == -1) {
        // push at the end
        this.menuCards.push(this.currentItemDraged)
        
      } else {
        this.menuCards.splice(index+1, 0, this.currentItemDraged);
      }
      

    } else if (this.origen === 'menu' && dest === 'items') {
      // remove item from menu
      let index = this.menuCards.findIndex((i) => {
        return i.identifier === this.currentItemDraged.identifier
      });
      this.menuCards.splice(index, 1);
      

    } else if (this.origen === 'menu' && dest === 'menu') {
      // move item within the menu
      // first remove
      let rmIndex = this.menuCards.findIndex((i) => {
        return i.identifier === this.currentItemDraged.identifier
      });
      this.menuCards.splice(rmIndex, 1);
      // then add at new location.
      this.menuCards.splice(index+1, 0, this.currentItemDraged);

    }
    this.currentItemDraged = this.createEmtpyRecetaEditCard();
  }

  // util functions.
  createEmtpyRecetaEditCard(): MenuEditCard {
    return {
      id: 0,
      text: '',
      type: '',
      descripcion: '',
      identifier: ''
    };
  }

  generateRandomIdentifier(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  formatValorEnMoneda(valor: number) {
    return new Intl.NumberFormat().format(valor);
  }
}

interface MenuEditCard {
  id: number,
  text: string,
  type: string,
  descripcion: string,
  identifier: string
}
