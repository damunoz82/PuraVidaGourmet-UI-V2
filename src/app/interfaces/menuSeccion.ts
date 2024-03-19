import { MenuItem } from "./menuItem";

export interface MenuSeccion {
    seccionId: number,
    nombre: string,
    itemMenus: MenuItem[]
}

export function createEmtpyMenuSeccion() {
    return {
        seccionId: 0,
        nombre: '',
        itemMenus: []
    }
}