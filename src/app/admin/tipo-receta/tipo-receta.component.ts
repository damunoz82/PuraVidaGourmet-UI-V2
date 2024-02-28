import { Component, OnInit } from '@angular/core';
import { TipoRecetaService } from '../../services/tipo-receta.service';
import { TipoReceta } from '../../interfaces/tipoReceta';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, FormGroup, FormBuilder, FormsModule } from  '@angular/forms';

import { HttpErrorResponse } from '@angular/common/http';

import { Observable, catchError, throwError } from 'rxjs';


@Component({
  selector: 'app-tipo-receta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './tipo-receta.component.html',
  styleUrl: './tipo-receta.component.css'
})
export class TipoRecetaComponent implements OnInit {

  public tipoRecetas: TipoReceta[] = [];

  tipoRecetaForm: FormGroup;
  public formShowing = false;

  public delTipoReceta: TipoReceta = this.createEmptyTipoReceta();

  public alertInfo = {
    'show': false,
    'type': '', //primary, danger
    'message': ''
  };
  public alertShowing = false;

  constructor(private _TipoRecetaService: TipoRecetaService, 
    private formBuilder: FormBuilder) {
    this.tipoRecetaForm = this.formBuilder.group({
      id: [''],
      nombre: ['',
        [Validators.required,
        Validators.max(50),
        Validators.min(0)]
      ]
    });
  }

  ngOnInit() {
    this.loadTipoRecetas();
  }

  loadTipoRecetas() {
    this._TipoRecetaService.getTipoRecetas().subscribe(tipoRecetas => {
      this.tipoRecetas = tipoRecetas;
    });
  }

  openForm() {
    this.formShowing = true;
  }

  cancel() {
    this.tipoRecetaForm.reset();
    this.formShowing = false;
  }

  edit(id: number) {
    this._TipoRecetaService.getTipoRecetaById(id).subscribe(tipoReceta => {
      this.tipoRecetaForm.patchValue({
        "id": tipoReceta.id,
        "nombre": tipoReceta.nombre,
      });
      this.openForm()
    });
    
  }

  onSubmit() {
    let tipoReceta = this.tipoRecetaForm.value;

    if (tipoReceta.id === null || tipoReceta.id === '' || tipoReceta.id <= 0) {
      this._TipoRecetaService.newTipoReceta(tipoReceta).pipe(
        catchError(this.handleError('addTipoReceta', tipoReceta))
      ).subscribe(tr => {
        this.refresh();
        this.alertOK(tipoReceta.nombre, "creado");
      });
    } else {
      this._TipoRecetaService.updateTipoReceta(tipoReceta).pipe(
        catchError(this.handleError('updateTipoReceta', tipoReceta))
      ).subscribe(tr => {
        this.refresh();
        this.alertOK(tipoReceta.nombre, "actualizado");
      });
    }
  }

  refresh() {
    this.tipoRecetaForm.reset();
        this.loadTipoRecetas();
        this.formShowing = false;
  }

  requestDelete(id: number) {
    this.delTipoReceta = this.tipoRecetas.filter(d => d.id === id)[0];
  }

  confirmDelete() {
    this._TipoRecetaService.deleteTipoReceta(this.delTipoReceta).pipe(
      catchError(this.handleError('deleteTipoReceta'))
    ).subscribe(d => {
      this.alertOK(this.delTipoReceta.nombre, "eliminado");
      this.delTipoReceta = this.createEmptyTipoReceta();
      this.loadTipoRecetas();
    });
  }

  createEmptyTipoReceta(): TipoReceta {
    return {
      id: 0,
      nombre: ''
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
