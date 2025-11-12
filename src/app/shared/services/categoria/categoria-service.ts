import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Categoria } from '../../../core/entities/categoria/categoria';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  http = inject(HttpClient);

  private API_URL = `${environment.server.host}${environment.server.port}/api/productos/categorias`;

  traerCategorias() {
    return this.http.get<Categoria[]>(this.API_URL);
  }
}
