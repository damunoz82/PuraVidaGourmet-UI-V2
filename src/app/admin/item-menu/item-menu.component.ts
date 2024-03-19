import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, FormGroup, FormBuilder, FormsModule, AbstractControl } from  '@angular/forms';
import { User } from '../../interfaces/user';

import { HttpErrorResponse } from '@angular/common/http';

import { Observable, catchError, throwError } from 'rxjs';
import { MenuItem, createEmptyMenuItem } from '../../interfaces/menuItem';
import { MenuService } from '../../services/menu.service';
import { Receta } from '../../interfaces/receta';
import { RecetaService } from '../../services/receta.service';

@Component({
  selector: 'app-item-menu',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './item-menu.component.html',
  styleUrl: './item-menu.component.css'
})
export class ItemMenuComponent implements OnInit {

  public menuItems: MenuItem[] = [];
  public recetas: Receta[] = [];

  menuItemForm: FormGroup;
  public formShowing = false;

  public menuItem: MenuItem = createEmptyMenuItem();

  public alertInfo = {
    'show': false,
    'type': '', //primary, danger
    'message': ''
  };
  public alertShowing = false;

  constructor(private _menuService: MenuService,
    private _recetaService: RecetaService,
    private formBuilder: FormBuilder) {
    this.menuItemForm = this.formBuilder.group({
      itemMenuId: [''],
      recetaId: ['', [Validators.required,
        Validators.min(0)]],
      nombreComercial: ['',
        [Validators.required,
        Validators.max(50),
        Validators.min(0)]
      ],
      descripcion: ['',
        [Validators.required,
        Validators.max(250),
        Validators.min(0)]
      ],
      precioVenta: ['', [Validators.required,
        Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.loadMenuItems();
    this.loadRecetas();
  }

  loadMenuItems() {
    this._menuService.getMenuItems().subscribe(items => {
      this.menuItems = items;
    });
  }

  loadRecetas() {
    this._recetaService.getRecetas().subscribe(recetas => {
      this.recetas = recetas;
    });
  }

  openForm() {
    this.formShowing = true;
  }

  cancel() {
    this.menuItemForm.reset();
    this.formShowing = false;
  }

  edit(id: number) {
    this._menuService.getMenuItemById(id).subscribe(item => {
      this.menuItemForm.patchValue({
        "itemMenuId": item.itemMenuId,
        "recetaId": item.recetaId,
        "nombreComercial": item.nombreComercial,
        "descripcion": item.descripcion,
        "precioVenta": item.precioVenta
      });
      this.openForm()
    });
    
  }

  onSubmit() {
    let menuItem = this.menuItemForm.value;

    if (menuItem.itemMenuId === null || menuItem.itemMenuId === '' || menuItem.itemMenuId <= 0) {
      this._menuService.newMenuItem(menuItem).pipe(
        catchError(this.handleError('addMenuItem', menuItem))
      ).subscribe(dep => {
        this.refresh();
        this.alertOK(menuItem.nombreComercial, "creado");
      });
    } else {
      this._menuService.updateMenuItem(menuItem).pipe(
        catchError(this.handleError('updateMenuItem', menuItem))
      ).subscribe(dep => {
        this.refresh();
        this.alertOK(menuItem.nombreComercial, "actualizado");
      });
    }
  }

  refresh() {
    this.menuItemForm.reset();
    this.loadMenuItems();
    this.formShowing = false;
  }

  requestDelete(id: number) {
    this.menuItem = this.menuItems.filter(d => d.itemMenuId === id)[0];
  }

  confirmDelete() {
    this._menuService.deleteMenuItem(this.menuItem).pipe(
      catchError(this.handleError('deleteMenuItem'))
    ).subscribe(d => {
      this.alertOK(this.menuItem.nombreComercial? this.menuItem.nombreComercial : '', "eliminado");
      this.menuItem = createEmptyMenuItem();
      this.loadMenuItems();
    });
  }

  

  validateResponsable(control: AbstractControl, responsables: User[]) {
    const responsable:string = control.value;

    if (!responsable) return null;

    const valid = responsables.filter((r) => r.name === responsable).length == 1;

    return valid ? null : {responsableInvalido: true};
  }

  handleError<T>(serviceName = '', operation = 'operation', result = {} as T) {
    return (error: HttpErrorResponse): Observable<T> => {
      this.alertInfo.message = error.error.message;
      this.alertInfo.type = 'danger';
      this.alertInfo.show = true;
      this.alertShowing = true;

      return throwError(() => new Error('Something bad happened; please try again later.'));
    };
  }

  alertOK(nombre: string, tipo: string) {
    this.alertInfo.message = "Elemento de menu " + nombre + " " + tipo + " exitosamente.";
    this.alertInfo.type = 'primary';
    this.alertInfo.show = true;
    this.alertShowing = true;
  }

  formatValorEnMoneda(valor: number) {
    return new Intl.NumberFormat().format(valor);
  }
}
