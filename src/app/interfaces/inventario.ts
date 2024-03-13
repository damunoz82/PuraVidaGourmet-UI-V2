import { User } from './user';
import { Departamento } from './departamento';
import { InventarioDetalle } from './inventarioDetalle'

export interface Inventario {
    "id": number,
    "departamento" : Departamento,
    "fecha_creacion": string,
    "fecha_modificacion": string,
    "comentario": string,
    "responsable"?: User,
    "usuarioModifica"?: User,
    "periodoMeta": string,
    "estado": string,
    "totalValorEnBodega": number,
    "detalle": InventarioDetalle[]
}

export function createEmptyInventario() {
    return {
        id: 0,
        departamento: {
            id: 1,
            nombre: '',  // fixme - always set to 1 for now.
            responsable: {
              id: 0,
              name: '',
              email: ''
            }
        },
        fecha_creacion: '',
        fecha_modificacion: '',
        comentario: '',
        periodoMeta: '',
        estado: '',
        totalValorEnBodega: 0,
        detalle: []
    };
}