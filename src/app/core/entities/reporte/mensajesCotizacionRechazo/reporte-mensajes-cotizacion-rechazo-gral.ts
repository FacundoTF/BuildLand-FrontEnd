import { ReporteMensajesCotizacionRechazo } from './reporte-mensajes-cotizacion-rechazo';

export class ReporteMensajesCotizacionRechazoGral extends ReporteMensajesCotizacionRechazo {
  public categoria: string;

  constructor(porcentaje: number, mensaje: string, categoria: string) {
    super(porcentaje, mensaje);
    this.categoria = categoria;
  }
}
