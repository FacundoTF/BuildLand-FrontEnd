export enum TipoMarca {
  GENERICA = 'GENERICA',
  NO_GENERICA = 'NO_GENERICA',
}

export class Marca {
  constructor(public tipoMarca: TipoMarca) {}
}
