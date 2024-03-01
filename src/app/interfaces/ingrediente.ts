import { Producto } from "./producto";

export interface Ingrediente {
    "ingredienteId": number,
    "cantidad": number,
    "producto": Producto
}