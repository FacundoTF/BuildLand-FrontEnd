import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ReturnResultResponse } from '../../../core/response-type/return-response';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { DetalleCotizacion } from '../../../core/entities/detalle-cotizacion/detalle-cotizacion';
import { PresupuestoServicio } from '../presupuesto/presupuesto-servicio';

@Injectable({
  providedIn: 'root',
})
export class CotizacionServicio {
  private API_URL = `${environment.server.host}${environment.server.port}/api/cotizaciones`;
  http = inject(HttpClient);
  presupuestoServicio = inject(PresupuestoServicio);

  enviarCotizacion(
    detalles: DetalleCotizacion[],
  ): Observable<ReturnResultResponse> {
    console.log(this.presupuestoServicio.presupuestoId());
    const observable = this.http.post<ReturnResultResponse>(
      `${this.API_URL}/${this.presupuestoServicio.presupuestoId()}`,
      {
        detalles,
      },
      {
        observe: 'response',
      },
    );

    return observable.pipe(
      map((response) => ({
        success: response.body?.success || false,
        message: response.body?.message || 'Error al enviar cotización.',
        statusCode: response.status,
      })),
      catchError((error) => {
        let message = 'Error al enviar cotización.';
        if (error.status === 404) {
          message = 'Recurso no encontrado al enviar cotización.';
        } else if (error.status === 401) {
          message =
            'No autorizado para enviar cotización. Cierre de sesión inminente.';
        }
        return of({
          success: false,
          message,
          statusCode: error.status,
        });
      }),
    );
  }
}
