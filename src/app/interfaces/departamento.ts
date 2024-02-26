import {User} from './user';

export interface Departamento {
    id: number,
    nombre: string,
    responsable: User,
}