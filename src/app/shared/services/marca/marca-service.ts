import { inject, Injectable, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { Categoria } from '../../../core/entities/categoria/categoria';
import { Marca } from '../../../core/entities/marca/marca';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MarcaService {
  http = inject(HttpClient);

  private API_URL = `${environment.server.host}${environment.server.port}/api/marcas`;

  traerMarcas(categoria: Categoria): Marca[] {
    let marcasRelevada: Marca[] = new Array<Marca>();

    const observable: Observable<Marca[]> = this.http.get<Marca[]>(
      `${this.API_URL}/categorias/${categoria.nombre}`,
    );
    observable.subscribe({
      next: (marcas) => {
        marcasRelevada.push(...marcas);
      },
      error: (error) => {
        return marcasRelevada;
      },
    });

    return marcasRelevada;
  }
}
