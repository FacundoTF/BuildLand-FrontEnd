import { inject, Injectable } from '@angular/core';
import { Categoria } from '../../../core/entities/categoria/categoria';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { catchError, map, Observable, of } from 'rxjs';
import { ReporteProductosSolicitados } from '../../../core/entities/reporte/productosSolicitados/reporte-productos-solicitados';
import { ReturnSearchResponse } from '../../../core/response-type/return-search-response';
import { ReturnPaginationResponse } from '../../../core/response-type/return-pagination-response';
import { Marca } from '../../../core/entities/marca/marca';
import { Producto } from '../../../core/entities/producto/producto';
import { ReporteMensajesCotizacionRechazoGral } from '../../../core/entities/reporte/mensajesCotizacionRechazo/reporte-mensajes-cotizacion-rechazo-gral';
import { ReporteMensajesCotizacionRechazo } from '../../../core/entities/reporte/mensajesCotizacionRechazo/reporte-mensajes-cotizacion-rechazo';

@Injectable({
  providedIn: 'root',
})
export class ReporteService {
  http = inject(HttpClient);

  private API_URL = `${environment.server.host}${environment.server.port}/api/reporte`;

  productosSolicitadosGeneral(
    categoria: Categoria,
    fechaInicio: Date,
    fechaFin: Date,
  ): Observable<ReturnSearchResponse> {
    const observable = this.http.post<ReporteProductosSolicitados[]>(
      `${this.API_URL}/productos-solicitados`,
      {
        categoria: categoria.nombre,
        fechaInicio: fechaInicio.toISOString(),
        fechaFin: fechaFin.toISOString(),
      },
      {
        observe: 'response',
      },
    );
    return observable.pipe(
      map((response) => {
        const reporte = response.body as ReporteProductosSolicitados[];
        return {
          success: true,
          payload: reporte,
          message: 'Reporte de productos solicitados obtenido con éxito.',
          statusCode: response.status,
        };
      }),
      catchError((error) => {
        return of({
          success: false,
          payload: [],
          message: 'Error al obtener el reporte de productos solicitados.',
          statusCode: error.status || 500,
        });
      }),
    );
  }
  productosSolicitadosMarca(
    categoria: Categoria,
    fechaInicio: Date,
    fechaFin: Date,
    marca: Marca,
  ) {
    const observable = this.http.post<ReporteProductosSolicitados[]>(
      `${this.API_URL}/productos-solicitados/marca`,
      {
        categoria: categoria.nombre,
        fechaInicio: fechaInicio.toISOString(),
        fechaFin: fechaFin.toISOString(),
        nombre: marca.nombre,
      },
      {
        observe: 'response',
      },
    );
    return observable.pipe(
      map((response) => {
        const reporte = response.body as ReporteProductosSolicitados[];
        return {
          success: true,
          payload: reporte,
          message:
            'Reporte de productos solicitados por marca obtenido con éxito.',
          statusCode: response.status,
        };
      }),
      catchError((error) => {
        return of({
          success: false,
          payload: [],
          message:
            'Error al obtener el reporte de productos solicitados por marca.',
          statusCode: error.status || 500,
        });
      }),
    );
  }
  productosSolicitadosProducto(
    categoria: Categoria,
    fechaInicio: Date,
    fechaFin: Date,
    producto: Producto,
  ) {
    const observable = this.http.post<ReporteProductosSolicitados[]>(
      `${this.API_URL}/productos-solicitados/producto`,
      {
        categoria: categoria.nombre,
        fechaInicio: fechaInicio.toISOString(),
        fechaFin: fechaFin.toISOString(),
        nombre: producto.nombre,
      },
      {
        observe: 'response',
      },
    );
    return observable.pipe(
      map((response) => {
        const reporte = response.body as ReporteProductosSolicitados[];
        return {
          success: true,
          payload: reporte,
          message:
            'Reporte de productos solicitados por producto obtenido con éxito.',
          statusCode: response.status,
        };
      }),
      catchError((error) => {
        return of({
          success: false,
          payload: [],
          message:
            'Error al obtener el reporte de productos solicitados por producto.',
          statusCode: error.status || 500,
        });
      }),
    );
  }
  mensajesRechazoCotizacion(
    fechaInicio: Date,
    fechaFin: Date,
  ): Observable<ReturnSearchResponse> {
    const ruta = `${this.API_URL}/cotizaciones-rechazadas-mensajes`;
    const observable = this.http.post<ReporteMensajesCotizacionRechazoGral[]>(
      ruta,
      {
        fechaInicio: fechaInicio.toISOString(),
        fechaFin: fechaFin.toISOString(),
      },
      {
        observe: 'response',
      },
    );
    return observable.pipe(
      map((response) => ({
        success: response.status === 200,
        message:
          response.status === 200
            ? 'Mensajes de rechazo obtenidos con éxito.'
            : 'Error al obtener mensajes de rechazo.',
        statusCode: response.status,
        payload: this.separarCategoriasMensajeCotizacionRechazada(
          response.body || [],
        ),
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
  separarCategoriasMensajeCotizacionRechazada(
    reporte: ReporteMensajesCotizacionRechazoGral[],
  ) {
    return reporte.reduce(
      (acc, curr) => {
        const categoria = curr.categoria;
        if (!acc[categoria]) {
          acc[categoria] = [];
        }
        acc[categoria].push(curr);
        return acc;
      },
      {} as Record<string, ReporteMensajesCotizacionRechazoGral[]>,
    );
  }
  mensajesRechazoCotizacionGeneral(
    fechaInicio: Date,
    fechaFin: Date,
  ): Observable<ReturnSearchResponse> {
    const ruta = `${this.API_URL}/cotizaciones-rechazadas-mensajes-general`;
    const observable = this.http.post<ReporteMensajesCotizacionRechazo[]>(
      ruta,
      {
        fechaInicio: fechaInicio.toISOString(),
        fechaFin: fechaFin.toISOString(),
      },
      {
        observe: 'response',
      },
    );
    return observable.pipe(
      map((response) => ({
        success: response.status === 200,
        message:
          response.status === 200
            ? 'Mensajes de rechazo general obtenidos con éxito.'
            : 'Error al obtener mensajes de rechazo general.',
        statusCode: response.status,
        payload: response.body || [],
      })),
      catchError((error) => {
        return of({
          success: false,
          message: 'Error al obtener mensajes de rechazo general.',
          statusCode: error.status || 500,
          payload: [],
        });
      }),
    );
  }
  cotizacionesGanadasPerdidas(
    fechaInicio: Date,
    fechaFin: Date,
  ): Observable<ReturnSearchResponse> {
    const ruta = `${this.API_URL}/cotizaciones-ganadas-perdidas`;
    const observable = this.http.post<ReporteMensajesCotizacionRechazo[]>(
      ruta,
      {
        fechaInicio: fechaInicio.toISOString(),
        fechaFin: fechaFin.toISOString(),
      },
      {
        observe: 'response',
      },
    );
    return observable.pipe(
      map((response) => ({
        success: response.status === 200,
        message:
          response.status === 200
            ? 'Reporte de cotizaciones ganadas y perdidas obtenido con éxito.'
            : 'Error al obtener reporte de cotizaciones ganadas y perdidas.',
        statusCode: response.status,
        payload: response.body || [],
      })),
      catchError((error) => {
        return of({
          success: false,
          message:
            'Error al obtener reporte de cotizaciones ganadas y perdidas.',
          statusCode: error.status || 500,
          payload: [],
        });
      }),
    );
  }

  getTrazabilidadPersonaFisica(
    cuit: string,
    pagina: number,
  ): Observable<ReturnPaginationResponse> {
    return this.http
      .get<ReturnPaginationResponse>(
        `${this.API_URL}/trazabilidad-persona-fisica/${cuit}`,
        {
          params: { pagina: pagina },
          observe: 'response',
        },
      )
      .pipe(
        map((response) => {
          const hasPrevious = response.body!.hasPrevious;
          const body = response.body!.payload ?? [];
          const hasNext = response.body!.hasNext;
          return {
            success: true,
            message: 'Trazabilidad de persona física obtenida con éxito.',
            statusCode: response.status,
            payload: body,
            hasPrevious,
            hasNext,
          };
        }),
        catchError((error) => {
          return of({
            success: false,
            message: 'Error al obtener la trazabilidad de persona física.',
            statusCode: error.status || 500,
            payload: null,
            hasPrevious: false,
            hasNext: false,
          });
        }),
      );
  }

  getTrazabilidadLoginLogout(
    cuit: string,
    pagina: number,
  ): Observable<ReturnPaginationResponse> {
    return this.http
      .get<ReturnPaginationResponse>(
        `${this.API_URL}/trazabilidad-login-logout/${cuit}`,
        {
          params: { pagina: pagina },
          observe: 'response',
        },
      )
      .pipe(
        map((response) => {
          const hasPrevious = response.body!.hasPrevious;
          const body = response.body!.payload ?? [];
          const hasNext = response.body!.hasNext;
          return {
            success: true,
            message: 'Trazabilidad obtenida con éxito.',
            statusCode: response.status,
            payload: body,
            hasPrevious,
            hasNext,
          };
        }),
        catchError((error) => {
          return of({
            success: false,
            message: 'Error al obtener la trazabilidad de login/logout.',
            statusCode: error.status || 500,
            payload: null,
            hasPrevious: false,
            hasNext: false,
          });
        }),
      );
  }
}
