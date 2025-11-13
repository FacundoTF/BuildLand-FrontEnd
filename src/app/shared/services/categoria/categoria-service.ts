import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Categoria } from '../../../core/entities/categoria/categoria';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  http = inject(HttpClient);

  private API_URL = `${environment.server.host}${environment.server.port}/api/categorias`;

  async traerCategorias(): Promise<Categoria[]> {
    const observable = this.http.get<Categoria[]>(this.API_URL);
    try {
      return await lastValueFrom(observable);
    } catch (error) {
      console.error('Error fetching categorias:', error);
      return [];
    }
  }
}
