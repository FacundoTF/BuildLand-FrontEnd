import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Categoria } from '../../../core/entities/categoria/categoria';
import { catchError, lastValueFrom, map, Observable, of } from 'rxjs';
import { ReturnSearchResponse } from '../../../core/response-type/return-search-response';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  http = inject(HttpClient);

  private API_URL = `${environment.server.host}${environment.server.port}/api/categorias`;

  async traerCategorias(): Promise<ReturnSearchResponse> {
    const observable = this.http.get<Categoria[]>(this.API_URL, {
      observe: 'response',
    });
    try {
      const resultado = await lastValueFrom(observable);
      return {
        success: true,
        payload: resultado.body || [],
        message: 'Categorías obtenidas con éxito.',
        statusCode: resultado.status,
      };
    } catch (error: any) {
      return {
        success: false,
        payload: [],
        message: 'Error al obtener categorías.',
        statusCode: error.status || 500,
      };
    }
  }

  traerCategoriasDeDistribuidora(): Observable<ReturnSearchResponse> {
    const observable = this.http.get<Categoria[]>(
      `${this.API_URL}/por-distribuidora`,
      {
        observe: 'response',
      },
    );
    return observable.pipe(
      map((response: HttpResponse<Categoria[]>) => ({
        success: response.status === 200,
        payload: response.body || [],
        message:
          response.status === 200
            ? 'Categorías de distribuidora obtenidas con éxito.'
            : 'Error al obtener categorías de distribuidora.',
        statusCode: response.status,
      })),
      catchError((error: HttpErrorResponse) => {
        let message = 'Error al obtener categorías de distribuidora.';
        if (error.status === 404) {
          message =
            'Recurso no encontrado al obtener categorías de distribuidora.';
        } else if (error.status === 401) {
          message =
            'No autorizado para obtener categorías de distribuidora. Cierre de sesión inminente.';
        }
        return of({
          success: false,
          payload: [],
          message,
          statusCode: error.status,
        });
      }),
    );
  }
}
