import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ReturnResultResponse } from '../../../core/response-type/return-response';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { DetalleCotizacion } from '../../../core/entities/detalle-cotizacion/detalle-cotizacion';
import { PresupuestoServicio } from '../presupuesto/presupuesto-servicio';
import { Cotizacion } from '../../../core/entities/cotizacion/cotizacion';
import { ResultadoCotizacion } from '../../../core/entities/cotizacion/resultado-cotizacion';
import { ReturnPaginationResponse } from '../../../core/response-type/return-pagination-response';
import { ReturnSearchResponse } from '../../../core/response-type/return-search-response';
import { MensajeRechazoCotizacion } from '../../../core/entities/cotizacion/mensaje-rechazo-cotizacion';

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
    const observable = this.http.post<Cotizacion>(
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
        success: response.status === 201,
        message:
          response.status === 201
            ? 'Cotizacion enviada con éxito'
            : 'Error al enviar cotización.',
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

  rechazarCotizacion(
    IdCotizacion: number,
    mensaje: MensajeRechazoCotizacion,
  ): Observable<ReturnResultResponse> {
    const ruta = `${this.API_URL}/rechazar/${IdCotizacion}`;
    const observable = this.http.post<void>(
      ruta,
      { idMensaje: mensaje.idMensaje, mensaje: mensaje.mensaje },
      {
        observe: 'response',
      },
    );
    return observable.pipe(
      map((response) => ({
        success: response.status === 200,
        message:
          response.status === 200
            ? 'Cotización rechazada con éxito.'
            : 'Error al rechazar cotización.',
        statusCode: response.status,
      })),
      catchError((error) => {
        let message = 'Error al rechazar cotización.';
        if (error.status === 404) {
          message = 'No puede rechazar una cotización que ya aceptó.';
        } else if (error.status === 409) {
          message = 'No puede volver rechazar una cotización que ya rechazó.';
        } else if (error.status === 401) {
          message = 'No autorizado para rechazar cotización';
        }
        return of({
          success: false,
          message,
          statusCode: error.status,
        });
      }),
    );
  }

  aceptarCotizacion(IdCotizacion: number): Observable<ReturnResultResponse> {
    const ruta = `${this.API_URL}/aceptar/${IdCotizacion}`;
    const observable = this.http.post<Cotizacion>(
      ruta,
      {},
      {
        observe: 'response',
      },
    );
    return observable.pipe(
      map((response) => ({
        success: response.status === 200,
        message:
          response.status === 200
            ? 'Cotización aceptada con éxito.'
            : 'Error al aceptar cotización.',
        statusCode: response.status,
      })),
      catchError((error) => {
        let message = 'Error al aceptar cotización.';
        if (error.status === 404) {
          message = 'No puede aceptar una cotización que ya rechazó.';
        } else if (error.status === 409) {
          message = 'No puede volver a aceptar una cotización que ya aceptó.';
        } else if (error.status === 401) {
          message =
            'No autorizado para aceptar cotización. Cierre de sesión inminente.';
        }
        return of({
          success: false,
          message,
          statusCode: error.status,
        });
      }),
    );
  }

  relevarMensajesRechazo(): Observable<ReturnSearchResponse> {
    const ruta = `${this.API_URL}/mensajes-rechazo`;
    const observable = this.http.get<MensajeRechazoCotizacion[]>(ruta, {
      observe: 'response',
    });
    return observable.pipe(
      map((response) => ({
        success: response.status === 200,
        message:
          response.status === 200
            ? 'Mensajes de rechazo obtenidos con éxito.'
            : 'Error al obtener mensajes de rechazo.',
        statusCode: response.status,
        payload: response.body || [],
      })),
      catchError((error) => {
        return of({
          success: false,
          message: 'Error al obtener mensajes de rechazo.',
          statusCode: error.status || 500,
          payload: [],
        });
      }),
    );
  }

  obtenerCotizaciones(
    IdPresupuesto: number,
  ): Observable<ReturnPaginationResponse> {
    const ruta = `${this.API_URL}/enlistar/${IdPresupuesto}`;
    const observable = this.http.get<Cotizacion[]>(ruta, {
      observe: 'response',
    });
    return observable.pipe(
      map((response) => {
        const cotizacionesRaw = response.body;
        return {
          success: true,
          message: 'Cotizaciones obtenidas con éxito.',
          statusCode: response.status,
          payload: cotizacionesRaw || [],
          hasPrevious: false,
          hasNext: false,
        };
      }),
      catchError((error) =>
        of({
          success: false,
          message: 'Error al obtener cotizaciones.',
          statusCode: error.status || 500,
          payload: [],
          hasPrevious: false,
          hasNext: false,
        }),
      ),
    );
  }

  obtenerCotizacionesPorPagina(
    numeroPagina: number,
  ): Observable<ReturnPaginationResponse> {
    const observable = this.http.get<ReturnPaginationResponse>(
      `${this.API_URL}/enlistar?page=${numeroPagina}&size=4`,
      {
        observe: 'response',
      },
    );
    return this.procesarCotizacionesPaginable(
      observable as Observable<HttpResponse<ReturnPaginationResponse>>,
    );
  }

  procesarCotizacionesPaginable(
    observable: Observable<HttpResponse<ReturnPaginationResponse>>,
  ): Observable<ReturnPaginationResponse> {
    return observable.pipe(
      map((response) => {
        const cotizacionesRaw = response.body;
        const cotizaciones = cotizacionesRaw?.payload as ResultadoCotizacion[];
        return {
          success: true,
          message: 'Cotizaciones obtenidas con éxito.',
          statusCode: response.status,
          payload: cotizacionesRaw?.payload,
          hasPrevious: cotizacionesRaw!.hasPrevious,
          hasNext: cotizacionesRaw!.hasNext,
        };
      }),
      catchError((error) =>
        of({
          success: false,
          message: 'Error al obtener cotizaciones.',
          statusCode: error.status || 500,
          payload: [],
          hasPrevious: false,
          hasNext: false,
        }),
      ),
    );
  }

  alterarPaginaCotizacion(
    numero: number,
  ): Observable<ReturnPaginationResponse> {
    return this.obtenerCotizacionesPorPagina(numero);
  }
}
