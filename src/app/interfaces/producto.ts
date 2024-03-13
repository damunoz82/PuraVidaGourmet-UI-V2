import { TipoProducto } from "./tipoProducto";

export interface Producto {
    "id": number,
    "nombre": string,
    "proveedor": string,
    "tipoProducto": TipoProducto,
    "unidadMedida": string,
    "precioDeCompra": number,
    "cantidadPorUnidad": number,
    "formatoCompra": string,
    "porcentajeMerma": number,
    "costeUnitario": number
}

export function createEmptyProducto(): Producto {
    return {
      id: 0,
      nombre: '',
      proveedor: '',
      tipoProducto: {
        id: 0,
        nombre: '',
        ubicacion: ''
      },
      unidadMedida: '',
      precioDeCompra: 0,
      cantidadPorUnidad: 0,
      formatoCompra: '',
      porcentajeMerma: 0,
      costeUnitario: 0
    };
  }