import { Component, OnInit } from '@angular/core';
import { TipoProductoService } from '../../services/tipo-producto.service';
import { TipoProducto } from '../../interfaces/tipoProducto';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, FormGroup, FormBuilder, FormsModule } from  '@angular/forms';

import { HttpErrorResponse } from '@angular/common/http';

import { Observable, catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-tipo-receta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './tipo-producto.component.html',
  styleUrl: './tipo-producto.component.css'
})
export class TipoProductoComponent implements OnInit {
  public tipoProductos: TipoProducto[] = [];

  tipoProductoForm: FormGroup;
  public formShowing = false;

  public delTipoProducto: TipoProducto = this.createEmptyTipoProducto();

  public alertInfo = {
    'show': false,
    'type': '', //primary, danger
    'message': ''
  };
  public alertShowing = false;

  constructor(private _TipoProductoService: TipoProductoService, 
    private formBuilder: FormBuilder) {
    this.tipoProductoForm = this.formBuilder.group({
      id: [''],
      nombre: ['',
        [Validators.required,
        Validators.max(50),
        Validators.min(0)]
      ],
      ubicacion: ['',
        [Validators.required,
        Validators.max(50),
        Validators.min(0)]
    ]
    });
  }

  ngOnInit() {
    this.loadTipoProductos();
  }

  loadTipoProductos() {
    this._TipoProductoService.getTipoProductos().subscribe(tipoProductos => {
      this.tipoProductos = tipoProductos;
    });
  }

  openForm() {
    this.formShowing = true;
  }

  cancel() {
    this.tipoProductoForm.reset();
    this.formShowing = false;
  }

  edit(id: number) {
    this._TipoProductoService.getTipoProductoById(id).subscribe(tipoProducto => {
      this.tipoProductoForm.patchValue({
        "id": tipoProducto.id,
        "nombre": tipoProducto.nombre,
        "ubicacion": tipoProducto.ubicacion,
      });
      this.openForm()
    });
    
  }

  onSubmit() {
    let tipoProducto = this.tipoProductoForm.value;

    if (tipoProducto.id === null || tipoProducto.id === '' || tipoProducto.id <= 0) {
      this._TipoProductoService.newTipoProducto(tipoProducto).pipe(
        catchError(this.handleError('addTipoProducto', tipoProducto))
      ).subscribe(tr => {
        this.refresh();
        this.alertOK(tipoProducto.nombre, "creado");
      });
    } else {
      this._TipoProductoService.updateTipoProducto(tipoProducto).pipe(
        catchError(this.handleError('updateTipoProducto', tipoProducto))
      ).subscribe(tr => {
        this.refresh();
        this.alertOK(tipoProducto.nombre, "actualizado");
      });
    }
  }

  refresh() {
    this.tipoProductoForm.reset();
        this.loadTipoProductos();
        this.formShowing = false;
  }

  requestDelete(id: number) {
    this.delTipoProducto = this.tipoProductos.filter(d => d.id === id)[0];
  }

  confirmDelete() {
    this._TipoProductoService.deleteTipoProducto(this.delTipoProducto).pipe(
      catchError(this.handleError('deleteTipoProducto'))
    ).subscribe(d => {
      this.alertOK(this.delTipoProducto.nombre, "eliminado");
      this.delTipoProducto = this.createEmptyTipoProducto();
      this.loadTipoProductos();
    });
  }

  createEmptyTipoProducto(): TipoProducto {
    return {
      id: 0,
      nombre: '',
      ubicacion: ''
    };
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
    this.alertInfo.message = "Tipo Receta " + nombre + " " + tipo + " exitosamente.";
    this.alertInfo.type = 'primary';
    this.alertInfo.show = true;
    this.alertShowing = true;
  }
}
