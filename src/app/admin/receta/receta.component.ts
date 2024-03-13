import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Receta, createEmptyReceta } from '../../interfaces/receta';
import { Producto } from '../../interfaces/producto';
import { Ingrediente } from '../../interfaces/ingrediente';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, FormGroup, FormBuilder, FormsModule, FormArray } from  '@angular/forms';

import { HttpErrorResponse } from '@angular/common/http';

import { Observable, catchError, throwError } from 'rxjs';
import { RecetaService } from '../../services/receta.service';
import { TipoReceta } from '../../interfaces/tipoReceta';
import { TipoRecetaService } from '../../services/tipo-receta.service';

@Component({
  selector: 'app-receta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './receta.component.html',
  styleUrl: './receta.component.css'
})
export class RecetaComponent implements OnInit {
  public recetas: Receta[] = [];
  public tiposRecetas: TipoReceta[] = []
  public productos: Producto[] = [];
  
  recetaForm: FormGroup;
  public formShowing = false;

  public delReceta: Receta = createEmptyReceta();

  public alertInfo = {
    'show': false,
    'type': '', //primary, danger
    'message': ''
  };
  public alertShowing = false;

  constructor(private _RecetaService: RecetaService, 
    private _ProductoService: ProductoService,
    private _TipoRecetas: TipoRecetaService,
    private formBuilder: FormBuilder) {
    this.recetaForm = this.formBuilder.group({
      id: [''],
      nombre: ['',
        [Validators.required,
        Validators.max(50),
        Validators.min(0)]
      ],
      categoria: ['',
        [Validators.required]
      ],
      tamanioPorcion: ['',
      [Validators.required,
        Validators.min(0)]
      ],
      numeroPorciones: ['',
        [Validators.required,
          Validators.min(0)]
      ],
      temperaturaDeServido: ['',
        [Validators.required,
          Validators.min(0)]
      ],
      tiempoPreparacion: ['',
        [Validators.required,
          Validators.min(0)]
      ],
      tiempoCoccion: ['',
        [Validators.required,
          Validators.min(0)]
      ],
      precioDeVenta: ['',
        [Validators.required,
          Validators.min(0)]
      ],
      impuestos: ['',
        [Validators.required,
          Validators.min(0),
          Validators.max(1)]
      ],
      elaboracion: ['',
        [Validators.required]
      ],
      equipoNecesario: ['',
        [Validators.required]
      ],
      alergenos: ['',
        [Validators.required]
      ],
      ingredientes: this.formBuilder.array([])
    });
  }

  get formIngredientes() {
    return (this.recetaForm.get('ingredientes') as FormArray);
  }

  quitarIngrediente(index: number) {
    this.formIngredientes.removeAt(index);
  }

  aggregarIngrediente() {
    this.formIngredientes.push(this.formBuilder.group({
      'ingredienteId': 0,
      'cantidad': ['', Validators.required],
      'producto': ['', Validators.required]
    }));
  }

  loadIngrediente(ingrediente: Ingrediente) {
    this.formIngredientes.push(this.formBuilder.group({
      'ingredienteId': ingrediente.ingredienteId,
      'cantidad': [ingrediente.cantidad, Validators.required],
      'producto': [ingrediente.producto.id, Validators.required]
    }));
  }

  ngOnInit() {
    this.loadTipoRecetas();
    this.loadProductos();
    this.loadRecetas();
  }

  loadTipoRecetas() {
    this._TipoRecetas.getTipoRecetas().subscribe(tipoRecetas => {
      this.tiposRecetas = tipoRecetas;
    });
  }

  loadRecetas() {
    this._RecetaService.getRecetas().subscribe(recetas => {
      this.recetas = recetas;
    });
  }
  
  loadProductos() {
    this._ProductoService.getProductos().subscribe(productos => {
      this.productos = productos
    })
  }

  openForm() {
    this.formShowing = true;
  }

  cancel() {
    this.recetaForm.reset();
    this.formIngredientes.clear();
    this.formShowing = false;
  }

  edit(id: number) {
    this._RecetaService.getRecetaById(id).subscribe(receta => {
      this.recetaForm.patchValue({
        "id": receta.id,
        "nombre": receta.nombre,
        "categoria": receta.categoria.id,
        "tamanioPorcion": receta.tamanioPorcion,
        "numeroPorciones": receta.numeroPorciones,
        "temperaturaDeServido": receta.temperaturaDeServido,
        "tiempoPreparacion": receta.tiempoPreparacion,
        "tiempoCoccion": receta.tiempoCoccion,
        "precioDeVenta": receta.precioDeVenta,
        "impuestos": receta.impuestos,
        "elaboracion": receta.elaboracion,
        "equipoNecesario": receta.equipoNecesario,
        "alergenos": receta.alergenos
      });
      receta.ingredientes.map((i: any) => this.loadIngrediente(i));
      this.openForm()
    });
    
  }

  onSubmit() {
    let receta = this.recetaForm.value;
    receta.categoria = this.tiposRecetas.filter((r) => r.id == this.recetaForm.value.categoria)[0];
    receta.ingredientes.map((i: any) => i.producto = { id: i.producto })

    if (receta.id === null || receta.id === '' || receta.id <= 0) {
      this._RecetaService.newReceta(receta).pipe(
        catchError(this.handleError('addReceta', receta))
      ).subscribe(tr => {
        this.refresh();
        this.alertOK(receta.nombre, "creado");
      });
    } else {
      this._RecetaService.updateReceta(receta).pipe(
        catchError(this.handleError('updateReceta', receta))
      ).subscribe(tr => {
        this.refresh();
        this.alertOK(receta.nombre, "actualizado");
      });
    }
  }

  // fixme... que era esto??
  createBaseProductInfoForSubmition(id: number) {
    return {
      id: id
    };
  }

  getFormValidationErrors() {
    
    console.log('%c ==>> Validation Errors: ', 'color: red; font-weight: bold; font-size:25px;');
  
    let totalErrors = 0;
  
    Object.keys(this.recetaForm.controls).forEach(key => {
      const controlErrors: any = this.recetaForm.get(key)!.errors;
      if (controlErrors != null) {
         totalErrors++;
         Object.keys(controlErrors).forEach(keyError => {
           console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
      }
    });
  
    console.log('Number of errors: ' ,totalErrors);
  }

  refresh() {
    this.recetaForm.reset();
    this.formIngredientes.clear();
    this.loadRecetas();
    this.formShowing = false;
  }

  requestDelete(id: number) {
    this.delReceta = this.recetas.filter(d => d.id == id)[0];
  }

  confirmDelete() {
    this._RecetaService.deleteReceta(this.delReceta).pipe(
      catchError(this.handleError('deleteProducto'))
    ).subscribe(d => {
      this.alertOK(this.delReceta.nombre, "eliminado");
      this.delReceta = createEmptyReceta();
      this.loadRecetas();
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
    this.alertInfo.message = "Producto " + nombre + " " + tipo + " exitosamente.";
    this.alertInfo.type = 'primary';
    this.alertInfo.show = true;
    this.alertShowing = true;
  }

  formatValorEnMoneda(valor: number) {
    return new Intl.NumberFormat().format(valor);
  }
}
