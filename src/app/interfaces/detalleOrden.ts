import { MenuItem } from "./menuItem";

export interface DetalleOrden {
    detalleId: number,
    item: MenuItem,
    cantidad: number,
    estadoDetalleOrden: string
}