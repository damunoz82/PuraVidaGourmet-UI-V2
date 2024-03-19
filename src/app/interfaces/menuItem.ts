export interface MenuItem {
    itemMenuId: number,
    recetaId?: number,
    nombreComercial?: string,
    descripcion?: string,
    precioVenta?: number
}

export function createEmptyMenuItem(): MenuItem {
    return {
        itemMenuId: 0,
        recetaId: 0,
        nombreComercial: '',
        descripcion: '',
        precioVenta: 0
    };
  }