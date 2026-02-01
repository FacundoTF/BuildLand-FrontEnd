import { inject, Injectable } from '@angular/core';
import { Categoria } from '../../../core/entities/categoria/categoria';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { catchError, map, Observable, of } from 'rxjs';
import { ReporteProductosSolicitados } from '../../../core/entities/reporte/productosSolicitados/reporte-productos-solicitados';
import { ReturnSearchResponse } from '../../../core/response-type/return-search-response';
import { Marca } from '../../../core/entities/marca/marca';
import { Producto } from '../../../core/entities/producto/producto';

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
}
