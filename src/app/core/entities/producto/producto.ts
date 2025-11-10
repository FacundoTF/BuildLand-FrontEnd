import { Categoria } from '../categoria/categoria';

export class Producto {
  constructor(
    public idProducto: number,
    public nombre: string,
    public categoria: Categoria
  ) {}
}
