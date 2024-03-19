export interface Mesa {
    id: number,
    nombre: string,
    capacidad: number
}

export function createEmptyMesa(): Mesa {
    return {
        id: 0,
        nombre: '',
        capacidad: 0
    }
}