export interface User {
    id: number,
    name: string,
    email: string,
    password?: string,
    roles?: string[],
    enabled?: boolean,
}