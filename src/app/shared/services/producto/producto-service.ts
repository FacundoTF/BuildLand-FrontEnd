import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { Producto } from '../../../core/entities/producto/producto';
import { Categoria } from '../../../core/entities/categoria/categoria';
import { lastValueFrom } from 'rxjs';
import { ReturnSearchResponse } from '../../../core/response-type/return-search-response';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  http = inject(HttpClient);

  private API_URL = `${environment.server.host}${environment.server.port}/api/productos`;

  async traerProductosPorCategoria(
    categoria: Categoria,
  ): Promise<ReturnSearchResponse> {
    const observable = this.http.get<Producto[]>(
      `${this.API_URL}/categorias/${categoria.nombre}`,
      {
        observe: 'response',
      },
    );
    try {
      const resultado = await lastValueFrom(observable);
      if (resultado.status === 200) {
        console.log(resultado.body);
        return {
          success: true,
          payload: resultado.body || [],
          message: 'Productos obtenidos con éxito.',
          statusCode: resultado.status,
        };
      } else {
        return {
          success: false,
          payload: [],
          message: 'Error al obtener productos.',
          statusCode: resultado.status,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        payload: [],
        message: 'Error al obtener productos.',
        statusCode: error.status || 500,
      };
    }
  }
}
