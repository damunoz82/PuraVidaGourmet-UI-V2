import { DetalleOrden } from "./detalleOrden"

export interface OrderPayload {
    header: string,
    details: DetalleOrden[]
}