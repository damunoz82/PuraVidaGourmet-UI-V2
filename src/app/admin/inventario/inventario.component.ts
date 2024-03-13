import { Component, OnInit } from '@angular/core';
import { InventarioService } from '../../services/inventario.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, FormGroup, FormBuilder, FormsModule, AbstractControl } from  '@angular/forms';
import { Inventario } from '../../interfaces/inventario';
import { UsuariosService } from '../../services/usuarios.service';

import { HttpErrorResponse } from '@angular/common/http';

import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { InventarioEstados } from '../../consts/inventario.estado';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent implements OnInit {

  public inventarios: Inventario[] = [];

  constructor(private _inventarioService: InventarioService,
    private _router: Router) {}

  ngOnInit() {
    this.loadInventarios();
  }

  loadInventarios() {
    this._inventarioService.getInventarios().subscribe(inventarios => {
      this.inventarios = inventarios;
    });
  }

  viewDetails (id: number) {
    this._router.navigate(['/admin/inventario-details/' + id]);
  }

  newInventario() {
    this._router.navigate(['/admin/inventario-details']);
  }

  displayInventarioEstadoText(inventarioEstado: string) {
    return InventarioEstados.ESTADOS.filter(i => i.valor === inventarioEstado)[0].display;
  }

  styleInventarioEstadoText(inventarioEstado: string) {
    return InventarioEstados.ESTADOS.filter(i => i.valor === inventarioEstado)[0].style;
  }

  formatValorEnMoneda(valor: number) {
    return new Intl.NumberFormat().format(valor);
  }

}
