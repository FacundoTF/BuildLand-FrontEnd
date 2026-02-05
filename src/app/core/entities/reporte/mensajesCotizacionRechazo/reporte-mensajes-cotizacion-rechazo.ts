export class ReporteMensajesCotizacionRechazo {
  public porcentaje: number;
  public mensaje: string;

  constructor(porcentaje: number, mensaje: string) {
    this.porcentaje = porcentaje;
    this.mensaje = mensaje;
  }
}
