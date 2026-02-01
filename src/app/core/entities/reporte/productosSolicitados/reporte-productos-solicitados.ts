export class ReporteProductosSolicitados {
  public cantidad: number;
  public producto: string;
  public marca: string;
  public porcentaje: number;

  constructor(
    cantidad: number,
    producto: string,
    marca: string,
    porcentaje: number,
  ) {
    this.cantidad = cantidad;
    this.producto = producto;
    this.marca = marca;
    this.porcentaje = porcentaje;
  }
}
