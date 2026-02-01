import { Categoria } from '../../categoria/categoria';

export class PeticionProductosSolicitados {
  public categoria: Categoria;
  public fechaInicio: Date;
  public fechaFin: Date;

  constructor(categoria: Categoria, fechaInicio: Date, fechaFin: Date) {
    this.categoria = categoria;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
  }
}
