import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Categoria } from '../../../core/entities/categoria/categoria';
import { lastValueFrom, Observable } from 'rxjs';
import { ReturnSearchResponse } from '../return-search-response';

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
}
