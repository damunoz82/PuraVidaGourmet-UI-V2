import { Component, OnInit } from '@angular/core';
import { DepartamentoService } from '../../services/departamento.service';
import { Departamento } from '../../interfaces/departamento';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, FormGroup, FormBuilder, FormsModule, NgForm, AbstractControl } from  '@angular/forms';
import { User } from '../../interfaces/user';
import { UsuariosService } from '../../services/usuarios.service';


@Component({
  selector: 'app-departamento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule], // BrowserModule
  templateUrl: './departamento.component.html',
  styleUrl: './departamento.component.css'
})
export class DepartamentoComponent implements OnInit {

  public formHidden = false;
  public departamentos: Departamento[] = [];
  public responsables: User[] = [];

  departmentoForm: FormGroup;

  constructor(private _departamentoService: DepartamentoService, 
    private _usuarioService: UsuariosService,
    private formBuilder: FormBuilder) {
    this.departmentoForm = this.formBuilder.group({
      nombre: ['',
        [Validators.required,
        Validators.max(50),
        Validators.min(0)]
      ],  
      responsable: ['',
        [Validators.required,
          (control: AbstractControl) => this.validateResponsable(
            control, this.responsables)]
        // this.validateResponsable]
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

  edit(id: number) {
    console.log("en edit" + id);
    this.formHidden = true;
  }

  new() {
    this.formHidden = true;
  }

  cancel() {
    this.departmentoForm.reset();
    // this.editDep = this.createEmptyDep();
    this.formHidden = false;
  }

  onSubmit() {
    let departamento = this.createEmptyDep();
    departamento = this.departmentoForm.value;
    departamento.responsable = this.responsables.filter((r) => r.name === this.departmentoForm.value.responsable)[0];
    console.log('Datos en el formulario: ', JSON.stringify(departamento));

    this._departamentoService.nuevoDepartamento(departamento).subscribe(dep => {
      // this.departamentos.push(dep);
      this.departmentoForm.reset();
      this.loadDepartamentos();
      this.formHidden = false;
    });

    
  }

  createEmptyDep(): Departamento {
    return {
      id: 0,
      nombre: '',
      responsable: {
        id: 0,
        name: '',
        email: ''
      }
    };
  }

  validateResponsable(control: AbstractControl, responsables: User[]) {
    const responsable:string = control.value;

    if (!responsable) return null;

    const valid = responsables.filter((r) => r.name === responsable).length == 1;

    return valid ? null : {responsableInvalido: true};
  }
}
