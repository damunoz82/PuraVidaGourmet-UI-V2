import {User} from './user';

export interface Departamento {
    id: number,
    nombre: string,
    responsable: User,
}

export function createEmptyDep(): Departamento {
    return {
      id: 0,
      nombre: '',
      responsable: {
        id: 0,
        name: '',
        email: ''
      }
    };
  }