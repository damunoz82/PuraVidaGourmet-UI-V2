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