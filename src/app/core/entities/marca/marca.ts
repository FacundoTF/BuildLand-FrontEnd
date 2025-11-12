import { Categoria } from '../categoria/categoria';

export class Marca {
  id: number;
  nombre: string;
  categoria: Categoria;

  constructor(id: number, nombre: string, categoria: Categoria) {
    this.id = id;
    this.nombre = nombre;
    this.categoria = categoria;
  }
}