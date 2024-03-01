import { Ingrediente } from "./ingrediente"
import { TipoReceta } from "./tipoReceta"

export interface Receta {
    "id": number,
    "nombre": string,
    "categoria": TipoReceta,
    "tamanioPorcion": number,
    "numeroPorciones": number,
    "temperaturaDeServido": number,
    "tiempoPreparacion": number,
    "tiempoCoccion": number,
    "precioDeVenta": number,
    "impuestos": number,
    "elaboracion": string,
    "equipoNecesario": string,
    "alergenos": string,
    "ingredientes": Ingrediente[],
    "costoReceta": number,
    "costoPorcion": number,
    "margenGanancia": number
  }

export function createEmptyReceta(): Receta {
    return {
        id: 0,
        nombre: '',
        categoria: {
            id: 0,
            nombre: ''
        },
        tamanioPorcion: 0,
        numeroPorciones: 0,
        temperaturaDeServido: 0,
        tiempoPreparacion: 0,
        tiempoCoccion: 0,
        precioDeVenta: 0,
        impuestos: 0,
        elaboracion: '',
        equipoNecesario: '',
        alergenos: '',
        ingredientes: [],
        costoReceta: 0,
        costoPorcion: 0,
        margenGanancia: 0
    }
}