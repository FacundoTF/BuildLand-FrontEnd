import { Categoria } from '../categoria/categoria';

export class Marca {
  constructor(
    public id: number | null,
    public nombre: string,
    public categoria: Categoria | null,
  ) {}
}
