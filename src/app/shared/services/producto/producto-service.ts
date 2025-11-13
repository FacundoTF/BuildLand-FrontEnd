import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { Producto } from '../../../core/entities/producto/producto';
import { Categoria } from '../../../core/entities/categoria/categoria';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  http = inject(HttpClient);

  private API_URL = `${environment.server.host}${environment.server.port}/api/productos`;

  async traerProductosPorCategoria(categoria: Categoria): Promise<Producto[]> {
    const observable = this.http.get<Producto[]>(
      `${this.API_URL}/categorias/${categoria.nombre}`,
    );
    try {
      return await lastValueFrom(observable);
    } catch (error) {
      console.error('Error fetching productos:', error);
      return [];
    }
  }
}
