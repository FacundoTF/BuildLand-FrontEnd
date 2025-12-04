import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { Categoria } from '../../../core/entities/categoria/categoria';
import { Marca } from '../../../core/entities/marca/marca';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MarcaService {
  http = inject(HttpClient);

  private API_URL = `${environment.server.host}${environment.server.port}/api/marcas`;

  async traerMarcas(categoria: Categoria): Promise<Marca[]> {
    const observable = this.http.get<Marca[]>(
      `${this.API_URL}/categorias/${categoria.nombre}`,
    );
    try {
      return await lastValueFrom(observable);
    } catch (error) {
      console.error('Error fetching marcas:', error);
      return [];
    }
  }
}
