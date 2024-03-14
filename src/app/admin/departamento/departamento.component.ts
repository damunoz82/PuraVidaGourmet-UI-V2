import { Component, OnInit } from '@angular/core';
import { DepartamentoService } from '../../services/departamento.service';
import { Departamento, createEmptyDep } from '../../interfaces/departamento';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, FormGroup, FormBuilder, FormsModule, AbstractControl } from  '@angular/forms';
import { User } from '../../interfaces/user';
import { UsuariosService } from '../../services/usuarios.service';

import { HttpErrorResponse } from '@angular/common/http';

import { Observable, catchError, throwError } from 'rxjs';

 
@Component({
  selector: 'app-departamento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule], // BrowserModule
  templateUrl: './departamento.component.html',
  styleUrl: './departamento.component.css'
})
export class DepartamentoComponent implements OnInit {

  public departamentos: Departamento[] = [];
  public responsables: User[] = [];

  departmentoForm: FormGroup;
  public formShowing = false;

  public delDep: Departamento = createEmptyDep();

  public alertInfo = {
    'show': false,
    'type': '', //primary, danger
    'message': ''
  };
  public alertShowing = false;

  constructor(private _departamentoService: DepartamentoService, 
    private _usuarioService: UsuariosService,
    private formBuilder: FormBuilder) {
    this.departmentoForm = this.formBuilder.group({
      id: [''],
      nombre: ['',
        [Validators.required,
        Validators.max(50),
        Validators.min(0)]
      ],  
      responsable: ['',
        [Validators.required,
          (control: AbstractControl) => this.validateResponsable(
            control, this.responsables)]
      ]
    });
  }

  ngOnInit() {
    this.loadDepartamentos();
    this.loadResponsables();
  }

  loadDepartamentos() {
    this._departamentoService.getDepartments().subscribe(departamentos => {
      this.departamentos = departamentos;
    });
  }

  loadResponsables() {
    this._usuarioService.getUsuarios().subscribe(usuarios => {
      this.responsables = usuarios;
    });
  }

  openForm() {
    this.formShowing = true;
  }

  cancel() {
    this.departmentoForm.reset();
    this.formShowing = false;
  }

  edit(id: number) {
    this._departamentoService.getDepartmentsById(id).subscribe(dep => {
      this.departmentoForm.patchValue({
        "id": dep.id,
        "nombre": dep.nombre,
        "responsable": dep.responsable.name
      });
      this.openForm()
    });
    
  }

  onSubmit() {
    let departamento = this.departmentoForm.value;
    departamento.responsable = this.responsables.filter((r) => r.name === this.departmentoForm.value.responsable.name)[0];

    if (departamento.id === null || departamento.id === '' || departamento.id <= 0) {
      this._departamentoService.nuevoDepartamento(departamento).pipe(
        catchError(this.handleError('addDepartamento', departamento))
      ).subscribe(dep => {
        this.refresh();
        this.alertOK(departamento.nombre, "creado");
      });
    } else {
      this._departamentoService.updateDepartamento(departamento).pipe(
        catchError(this.handleError('updateDepartamento', departamento))
      ).subscribe(dep => {
        this.refresh();
        this.alertOK(departamento.nombre, "actualizado");
      });
    }
  }

  refresh() {
    this.departmentoForm.reset();
        this.loadDepartamentos();
        this.formShowing = false;
  }

  requestDelete(id: number) {
    this.delDep = this.departamentos.filter(d => d.id === id)[0];
  }

  confirmDelete() {
    this._departamentoService.deleteDepartamento(this.delDep).pipe(
      catchError(this.handleError('deleteDepartamento'))
    ).subscribe(d => {
      this.alertOK(this.delDep.nombre, "eliminado");
      this.delDep = createEmptyDep();
      this.loadDepartamentos();
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
    this.alertInfo.message = "Departamento " + nombre + " " + tipo + " exitosamente.";
    this.alertInfo.type = 'primary';
    this.alertInfo.show = true;
    this.alertShowing = true;
  }
}
