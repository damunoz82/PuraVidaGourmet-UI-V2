import { User } from "./user";
import { MenuSeccion } from "./menuSeccion";

export interface Menu {
    id: number,
    nombre: string,
    descripcion: string,
    temporada: string,
    usuarioRegistra?: User,
    fechaCreacion?: string,
    usuarioModifica?: User,
    fechaModificacion?: string,
    secciones: MenuSeccion[],
    menuEstado: boolean
}

export function createEmptyMenu(): Menu {
    return {
        id: 0,
        nombre: '',
        descripcion: '',
        temporada: '',
        secciones: [],
        menuEstado: false
    }
}