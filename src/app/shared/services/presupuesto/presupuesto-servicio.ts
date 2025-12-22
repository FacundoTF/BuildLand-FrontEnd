import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject, input, signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Presupuesto } from '../../../core/entities/presupuesto/presupuesto';
import { catchError, lastValueFrom, map, Observable, of } from 'rxjs';
import { ReturnResultResponse } from '../../../core/response-type/return-response';
import { ReturnSearchResponse } from '../../../core/response-type/return-search-response';
import { DetallePresupuesto } from '../../../core/entities/detalle-presupuesto/detalle-presupuesto';
import { ReturnPaginationResponse } from '../../../core/response-type/return-pagination-response';

@Injectable({
  providedIn: 'root',
})
export class PresupuestoServicio {
  http = inject(HttpClient);

  private API_URL = `${environment.server.host}${environment.server.port}/api/presupuestos`;

  presupuestoId = signal<number>(-1);

  async agregarPresupuesto(
    presupuesto: Presupuesto,
  ): Promise<ReturnResultResponse> {
    const body = {
      IdPresupuesto: presupuesto.id,
      persona: presupuesto.persona,
      categoria: presupuesto.categoria,
      fecha: presupuesto.fecha,
      detalles: presupuesto.detalles,
      cotizaciones: presupuesto.cotizaciones,
    };

    const observable = this.http.post<boolean>(this.API_URL, body, {
      observe: 'response',
    });
    try {
      const response = await lastValueFrom(observable);
      return {
        success: response.body || false,
        message: response.body
          ? 'Presupuesto agregado con exito.'
          : 'Error al agregar presupuesto.',
        statusCode: response.status,
      };
    } catch (error: any) {
      if (error.status === 404) {
        return {
          success: false,
          message: 'Recurso no encontrado al agregar presupuesto.',
          statusCode: error.status,
        };
      } else if (error.status === 401) {
        return {
          success: false,
          message:
            'No autorizado para agregar presupuesto. Cierre de sesión inminente.',
          statusCode: error.status,
        };
      }
      return {
        success: false,
        message: 'Error al agregar presupuesto.',
        statusCode: error.status || 500,
      };
    }
  }

  private mapearPresupuestos(presupuestos: Presupuesto[]): Presupuesto[] {
    return presupuestos.map((p: Presupuesto) => {
      return new Presupuesto(
        p.id,
        p.persona,
        p.categoria,
        p.fecha ? new Date(p.fecha) : null,
        p.fechaLimite ? new Date(p.fechaLimite) : null,
        p.detalles,
        p.cotizaciones,
      );
    });
  }
  private mapearDetallesPresupuesto(
    detalles: DetallePresupuesto[],
  ): DetallePresupuesto[] {
    return detalles.map((p: DetallePresupuesto) => {
      return new DetallePresupuesto(
        p.id,
        p.producto,
        p.cantidad,
        p.presupuesto,
      );
    });
  }

  async obtenerPresupuestos(): Promise<ReturnPaginationResponse> {
    const observable = this.http.get<ReturnPaginationResponse>(
      `${this.API_URL}/enlistar?page=0&size=4`,
      {
        observe: 'response',
      },
    );
    return this.procesarObservableObtenerPresupuestos(
      observable as Observable<HttpResponse<ReturnPaginationResponse>>,
    );
  }

  async obtenerPresupuestosPorPagina(
    numeroPagina: number,
  ): Promise<ReturnPaginationResponse> {
    const observable = this.http.get<ReturnPaginationResponse>(
      `${this.API_URL}/enlistar?page=${numeroPagina}&size=4`,
      {
        observe: 'response',
      },
    );
    return this.procesarObservableObtenerPresupuestos(
      observable as Observable<HttpResponse<ReturnPaginationResponse>>,
    );
  }

  async procesarObservableObtenerPresupuestos(
    observable: Observable<HttpResponse<ReturnPaginationResponse>>,
  ): Promise<ReturnPaginationResponse> {
    let presupuestos: Presupuesto[] = [];
    try {
      const response = await lastValueFrom(observable);
      const presupuestosRaw = response.body;
      presupuestos = presupuestosRaw?.payload as Presupuesto[];
      presupuestos = this.mapearPresupuestos(presupuestos);
      return {
        success: true,
        message: 'Presupuestos obtenidos con éxito.',
        statusCode: response.status,
        payload: presupuestos,
        hasPrevious: presupuestosRaw!.hasPrevious,
        hasNext: presupuestosRaw!.hasNext,
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Error al obtener presupuestos.',
        statusCode: error.status || 500,
        payload: null,
        hasPrevious: false,
        hasNext: false,
      };
    }
  }

  async alterarPaginaPresupuesto(numero: number) {
    return this.obtenerPresupuestosPorPagina(numero);
  }

  obtenerPresupuestosDetalles(
    idPresupuesto: number,
  ): Observable<ReturnPaginationResponse> {
    const observable = this.http.get<ReturnPaginationResponse>(
      `${this.API_URL}/detalles/${idPresupuesto}/enlistar?page=0&size=4`,
      {
        observe: 'response',
      },
    );
    return this.procesarDetallesPresupuestoPaginable(
      observable as Observable<HttpResponse<ReturnPaginationResponse>>,
    );
  }

  obtenerDetallesParaCotizar(): Observable<ReturnSearchResponse> {
    const observable = this.http.get<DetallePresupuesto[]>(
      `${this.API_URL}/detalles/${this.presupuestoId()}/cotizar`,
      {
        observe: 'response',
      },
    );
    return this.procesarDetallesPresupuesto(
      observable as Observable<HttpResponse<DetallePresupuesto[]>>,
    );
  }

  obtenerPresupuestosDetallesPorPagina(
    numeroPagina: number,
  ): Observable<ReturnPaginationResponse> {
    const observable = this.http.get<ReturnPaginationResponse>(
      `${this.API_URL}/detalles/${this.presupuestoId()}/enlistar?page=${numeroPagina}&size=4`,
      {
        observe: 'response',
      },
    );
    return this.procesarDetallesPresupuestoPaginable(
      observable as Observable<HttpResponse<ReturnPaginationResponse>>,
    );
  }

  procesarDetallesPresupuestoPaginable(
    observable: Observable<HttpResponse<ReturnPaginationResponse>>,
  ): Observable<ReturnPaginationResponse> {
    return observable.pipe(
      map((response) => {
        const detallesRaw = response.body;
        const detalles = detallesRaw?.payload as DetallePresupuesto[];
        const detallesMapeados = this.mapearDetallesPresupuesto(detalles);
        return {
          success: true,
          message: 'Detalles de presupuesto obtenidos con éxito.',
          statusCode: response.status,
          payload: detallesMapeados,
          hasPrevious: detallesRaw!.hasPrevious,
          hasNext: detallesRaw!.hasNext,
        };
      }),
      catchError((error) =>
        of({
          success: false,
          message: 'Error al obtener detalles de presupuesto.',
          statusCode: error.status || 500,
          payload: null,
          hasPrevious: false,
          hasNext: false,
        }),
      ),
    );
  }

  procesarDetallesPresupuesto(
    observable: Observable<HttpResponse<DetallePresupuesto[]>>,
  ): Observable<ReturnSearchResponse> {
    return observable.pipe(
      map((response) => {
        const detalles = response.body as DetallePresupuesto[];
        const detallesMapeados: DetallePresupuesto[] =
          this.mapearDetallesPresupuesto(detalles);
        return {
          success: true,
          message: 'Detalles de presupuesto obtenidos con éxito.',
          statusCode: response.status,
          payload: detallesMapeados,
        };
      }),
      catchError((error) =>
        of({
          success: false,
          message: 'Error al obtener detalles de presupuesto.',
          statusCode: error.status || 500,
          payload: null,
        }),
      ),
    );
  }

  alterarPaginaDetallesPresupuesto(numero: number) {
    return this.obtenerPresupuestosDetallesPorPagina(numero);
  }
}
