import { Categoria } from '../categoria/categoria';
import { Marca } from '../marca/marca';

export class Producto {
  constructor(
    public id: number | null,
    public nombre: string,
    public categoria: Categoria | null,
    public marca: Marca,
  ) {}
}
