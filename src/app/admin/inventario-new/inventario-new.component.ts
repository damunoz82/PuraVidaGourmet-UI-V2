import { Component, Input, OnInit } from '@angular/core';
import { InventarioService } from '../../services/inventario.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, FormGroup, FormBuilder, FormsModule, FormArray } from  '@angular/forms';
import { Inventario, createEmptyInventario } from '../../interfaces/inventario';
import { StorageService } from '../../services/storage.service';

import { HttpErrorResponse } from '@angular/common/http'; 
import { ActivatedRoute, Params, Router, NavigationEnd } from '@angular/router';
import { InventarioDetalle } from '../../interfaces/inventarioDetalle';
import { Observable, catchError, map, throwError } from 'rxjs';
import { InventarioEstados } from '../../consts/inventario.estado';

@Component({
  selector: 'app-inventario-new',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './inventario-new.component.html',
  styleUrl: './inventario-new.component.css'
})
export class InventarioNewComponent implements OnInit {

  inventario: Inventario = createEmptyInventario();

  inventarioForm: FormGroup;

  @Input() id!:string;

  controlCategoria: string = '';

  isEditing: boolean = false;

  shouldTerminar: boolean = false;

  public alertInfo = {
    'show': false,
    'type': '', //primary, danger
    'message': ''
  };
  public alertShowing = false;

  constructor(private _inventarioService: InventarioService,
    private formBuilder: FormBuilder,
    private readonly _router: Router,
    private _storageService: StorageService) {
    this.inventarioForm = this.formBuilder.group({
      id: [''],
      periodoMeta: ['',
        [Validators.required,
        Validators.max(50),
        Validators.min(0)]
      ],
      comentario: ['',
        [Validators.required,
        Validators.max(250),
        Validators.min(0)]
      ],
      responsable: [''],
      fecha_creacion: [''],
      detalle: this.formBuilder.array([])
    });
  }

  ngOnInit(): void {
    if (this.id === undefined) {
      this.isEditing = false;
      this.inventario.responsable = this._storageService.getSessionInfo()

    } else {
      this.loadForm();
      this.isEditing = true;
    }
  }

  get formDetalles() {
    return (this.inventarioForm.get('detalle') as FormArray);
  }

  loadDetalle(detalle: InventarioDetalle) {
    this.formDetalles.push(this.formBuilder.group({
      'detalleId': detalle.detalleId,
      'nombreProducto': detalle.nombreProducto,
      'categoriaProducto': detalle.categoriaProducto,
      'ubicacionProducto': detalle.ubicacionProducto,
      'formatoCompraProducto': detalle.formatoCompraProducto,
      'unidadMedidaProducto': detalle.unidadMedidaProducto,
      'cantidadUnidadProducto': detalle.cantidadUnidadProducto,
      'precioCompraProducto': detalle.precioCompraProducto,
      'cantidadEnBodega': [detalle.cantidadEnBodega, [Validators.required, Validators.min(0)]],
      'valor': detalle.valor
    }));
  }

  categoriaChanged(cat: string): boolean {
    if (cat !== this.controlCategoria) {
      this.controlCategoria = cat;
      return true;
    }
    return false;
  }

  loadForm() {
    this.inventarioForm.reset();
    this.formDetalles.clear();
    this._inventarioService.getInventarioById(+this.id).subscribe(inventario => {
      this.inventario = inventario;
      this.inventarioForm.patchValue({
        id: inventario.id,
        periodoMeta: inventario.periodoMeta,
        comentario: inventario.comentario,
        responsable: inventario.responsable?.name,
        fecha_creacion: inventario.fecha_creacion

      });
      inventario.detalle.map((i: any) => this.loadDetalle(i));
    });
  }

  confirmarAbandonar() {
    this._inventarioService.abandonarInventario(this.inventario.id).subscribe(r => {
      this._router.navigate(['/admin/inventario']);
    });
  }

  submitYTerminar() {
    this.shouldTerminar = true;
    this.onSubmit();
  }

  onSubmit() {
    // create inventario.
    let inventario = this.inventarioForm.value;
    inventario.departamento = {
      id: 1
    }

    if (inventario.id === null || inventario.id === '' || inventario.id <= 0) {
      // do post
      this._inventarioService.createNewInventario(inventario).pipe(
        catchError(this.handleError('createInventario', inventario)),
        map(res => {
          let location = res.headers.get('Location').split('/');
          this.id = location[4]; // id of the newly created inventario, move somewhere else.

        })
      ).subscribe(response => {
        this.loadForm();
        this.isEditing = true;
        this.alertOK(inventario.periodoMeta, "creado");
      });

    } else {
      
      // do put
      inventario.detalle = inventario.detalle.map((i: any) => i = {
        detalleId: i.detalleId,
        cantidadEnBodega: i.cantidadEnBodega
      });

      this._inventarioService.actualizarInventario(inventario).subscribe(r => {
        if (this.shouldTerminar) {
          this._inventarioService.terminarInventario(this.inventario.id).subscribe(r => {
            this.shouldTerminar = false;
            this.loadForm();
            this.alertOK(inventario.periodoMeta, "terminado");
          });
        } else {
          this.loadForm();
          this.alertOK(inventario.periodoMeta, "actualizado");
        }
        
      });
      
    }
  }

  displayInventarioEstadoText(inventarioEstado: string) {
    if (inventarioEstado === '') {
      return 'No Creado.';
    }
    return InventarioEstados.ESTADOS.filter(i => i.valor === inventarioEstado)[0].display;
  }

  styleInventarioEstadoText(inventarioEstado: string) {
    if (inventarioEstado === '') {
      return 'secondary';
    }
    return InventarioEstados.ESTADOS.filter(i => i.valor === inventarioEstado)[0].style;
  }

  puedeAbandonarOSalvar() {
    return this.inventario.estado === 'CREADO' || this.inventario.estado === 'EN_PROCESO';
  }

  cancel() {
    this._router.navigate(['/admin/inventario']);
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

  alertOK(periodo: string, tipo: string) {
    this.alertInfo.message = "Inventario " + periodo + " " + tipo + " exitosamente.";
    this.alertInfo.type = 'primary';
    this.alertInfo.show = true;
    this.alertShowing = true;
  }

  formatValorEnMoneda(valor: number) {
    return new Intl.NumberFormat().format(valor);
  }

}
