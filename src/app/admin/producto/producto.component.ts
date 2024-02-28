import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../interfaces/producto';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, FormGroup, FormBuilder, FormsModule, AbstractControl } from  '@angular/forms';

import { HttpErrorResponse } from '@angular/common/http';

import { Observable, catchError, throwError } from 'rxjs';
import { TipoProducto } from '../../interfaces/tipoProducto';
import { TipoProductoService } from '../../services/tipo-producto.service';

@Component({
  selector: 'app-tipo-receta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent implements OnInit {
  public productos: Producto[] = [];
  public tipoProductos: TipoProducto[] = [];

  productoForm: FormGroup;
  public formShowing = false;

  public delProducto: Producto = this.createEmptyProducto();

  public alertInfo = {
    'show': false,
    'type': '', //primary, danger
    'message': ''
  };
  public alertShowing = false;

  constructor(private _ProductoService: ProductoService, 
    private _TipoProductoService: TipoProductoService,
    private formBuilder: FormBuilder) {
    this.productoForm = this.formBuilder.group({
      id: [''],
      nombre: ['',
        [Validators.required,
        Validators.max(50),
        Validators.min(0)]
      ],
      proveedor: ['',
        [Validators.required,
        Validators.max(50),
        Validators.min(0)]
      ],
      tipoProducto: ['',
      [Validators.required]
      ],
      unidadMedida: ['',
        [Validators.required]
      ],
      precioDeCompra: ['',
        [Validators.required,
          Validators.min(0)]
      ],
      cantidadPorUnidad: ['',
        [Validators.required,
          Validators.min(0)]
      ],
      formatoCompra: ['',
        [Validators.required]
      ],
      porcentajeMerma: ['',
        [Validators.required,
          Validators.min(0)]
      ]
    });
  }

  ngOnInit() {
    this.loadProductos();
    this.loadTipoProductos();
  }

  loadProductos() {
    this._ProductoService.getProductos().subscribe(productos => {
      this.productos = productos;
    });
  }
  
  loadTipoProductos() {
    this._TipoProductoService.getTipoProductos().subscribe(tipoProductos => {
      this.tipoProductos = tipoProductos
    })
  }

  openForm() {
    this.formShowing = true;
  }

  cancel() {
    this.productoForm.reset();
    this.formShowing = false;
  }

  edit(id: number) {
    this._ProductoService.getProductoById(id).subscribe(producto => {
      this.productoForm.patchValue({
        "id": producto.id,
        "nombre": producto.nombre,
        "proveedor": producto.proveedor,
        "tipoProducto": producto.tipoProducto.id,
        "unidadMedida": producto.unidadMedida,
        "precioDeCompra": producto.precioDeCompra,
        "cantidadPorUnidad": producto.cantidadPorUnidad,
        "formatoCompra": producto.formatoCompra,
        "porcentajeMerma": producto.porcentajeMerma
      });
      this.openForm()
    });
    
  }

  onSubmit() {
    let producto = this.productoForm.value;
    producto.tipoProducto = this.tipoProductos.filter((r) => r.id == this.productoForm.value.tipoProducto)[0];

    if (producto.id === null || producto.id === '' || producto.id <= 0) {
      this._ProductoService.newProducto(producto).pipe(
        catchError(this.handleError('addProducto', producto))
      ).subscribe(tr => {
        this.refresh();
        this.alertOK(producto.nombre, "creado");
      });
    } else {
      this._ProductoService.updateProducto(producto).pipe(
        catchError(this.handleError('updateProducto', producto))
      ).subscribe(tr => {
        this.refresh();
        this.alertOK(producto.nombre, "actualizado");
      });
    }
  }

  refresh() {
    this.productoForm.reset();
        this.loadProductos();
        this.formShowing = false;
  }

  requestDelete(id: number) {
    this.delProducto = this.productos.filter(d => d.id === id)[0];
  }

  confirmDelete() {
    this._ProductoService.deleteProducto(this.delProducto).pipe(
      catchError(this.handleError('deleteProducto'))
    ).subscribe(d => {
      this.alertOK(this.delProducto.nombre, "eliminado");
      this.delProducto = this.createEmptyProducto();
      this.loadProductos();
    });
  }

  createEmptyProducto(): Producto {
    return {
      id: 0,
      nombre: '',
      proveedor: '',
      tipoProducto: {
        id: 0,
        nombre: ''
      },
      unidadMedida: '',
      precioDeCompra: 0,
      cantidadPorUnidad: 0,
      formatoCompra: '',
      porcentajeMerma: 0,
      costeUnitario: 0
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
    this.alertInfo.message = "Producto " + nombre + " " + tipo + " exitosamente.";
    this.alertInfo.type = 'primary';
    this.alertInfo.show = true;
    this.alertShowing = true;
  }
}
