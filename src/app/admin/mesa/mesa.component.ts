import { Component, OnInit } from '@angular/core';
import { MesaService } from '../../services/mesa.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, FormGroup, FormBuilder, FormsModule } from  '@angular/forms';

import { HttpErrorResponse } from '@angular/common/http';

import { Observable, catchError, throwError } from 'rxjs';
import { Mesa, createEmptyMesa } from '../../interfaces/mesa';

@Component({
  selector: 'app-mesa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './mesa.component.html',
  styleUrl: './mesa.component.css'
})
export class MesaComponent implements OnInit {

  public mesas: Mesa[] = [];

  mesaForm: FormGroup;
  public formShowing = false;

  public delMesa: Mesa = createEmptyMesa();

  public alertInfo = {
    'show': false,
    'type': '',
    'message': ''
  };
  public alertShowing = false;

  constructor(private _MesaService: MesaService,
    private formBuilder: FormBuilder) {
      this.mesaForm = this.formBuilder.group({
        id: [''],
        nombre: ['',
          [Validators.required,
          Validators.max(50),
          Validators.min(0)]
        ],
        capacidad: ['',
          [Validators.required ]
        ]
      })
    }

  ngOnInit(): void {
    this.loadMesas();
  }

  loadMesas() {
    this._MesaService.getMesas().subscribe(mesas => {
      this.mesas = mesas;
    })
  }

  openForm() {
    this.formShowing = true;
  }

  cancel() {
    this.mesaForm.reset();
    this.formShowing = false;
  }

  edit(id: number) {
    this._MesaService.getMesaById(id).subscribe(mesa => {
      this.mesaForm.patchValue({
        "id": mesa.id,
        "nombre": mesa.nombre,
        "capacidad": mesa.capacidad
      });
      this.openForm()
    });
    
  }

  onSubmit() {
    let mesa = this.mesaForm.value;

    if (mesa.id === null || mesa.id === '' || mesa.id <= 0) {
      this._MesaService.newMesa(mesa).pipe(
        catchError(this.handleError('addTipoReceta', mesa))
      ).subscribe(tr => {
        this.refresh();
        this.alertOK(mesa.nombre, "creado");
      });
    } else {
      this._MesaService.updateMesa(mesa).pipe(
        catchError(this.handleError('updateTipoReceta', mesa))
      ).subscribe(tr => {
        this.refresh();
        this.alertOK(mesa.nombre, "actualizado");
      });
    }
  }

  refresh() {
    this.mesaForm.reset();
        this.loadMesas();
        this.formShowing = false;
  }

  requestDelete(id: number) {
    this.delMesa = this.mesas.filter(d => d.id === id)[0];
  }

  confirmDelete() {
    this._MesaService.deleteMesa(this.delMesa).pipe(
      catchError(this.handleError('deleteTipoReceta'))
    ).subscribe(d => {
      this.alertOK(this.delMesa.nombre, "eliminado");
      this.delMesa = createEmptyMesa();
      this.loadMesas();
    });
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
