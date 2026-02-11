import { inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { Observable, map, catchError, of, lastValueFrom } from 'rxjs';
import { ReturnResultResponse } from '../../../core/response-type/return-response';
import { ReturnSearchResponse } from '../../../core/response-type/return-search-response';
import { Grupo } from '../../../core/entities/grupo/grupo';
import { Permiso } from '../../../core/entities/permiso/permiso';

export interface GrupoRequest {
  nombre: string;
  descripcion: string;
  permisosIds: number[];
  gruposIds: number[];
}

@Injectable({
  providedIn: 'root',
})
export class GrupoServicio {
  private http = inject(HttpClient);
  private API_URL = `${environment.server.host}${environment.server.port}/api`;

  async crearGrupo(request: Grupo): Promise<ReturnResultResponse> {
    // const obj =
    return lastValueFrom(
      this.http.post<ReturnResultResponse>(`${this.API_URL}/grupos`, {
        type: 'grupo',
        id: 0,
        nombre: request.nombre,
        descripcion: request.descripcion,
        elementos: [
          ...request.permisos.map((p) => {
            return {
              type: 'permiso',
              nombre: p.nombre,
              descripcion: p.descripcion,
              id: p.id,
            };
          }),
          ...request.grupos.map((g) => ({
            type: 'grupo',
            nombre: g.nombre,
            descripcion: g.descripcion,
            id: g.id,
          })),
        ],
      }),
    );
  }

  obtenerGrupos(): Observable<ReturnSearchResponse> {
    const observable = this.http.get<Grupo[]>(
      `${this.API_URL}/grupos/enlistar`,
      {
        observe: 'response',
      },
    );
    return observable.pipe(
      map((response: HttpResponse<Grupo[]>) => ({
        success: response.status === 200,
        payload: response.body || [],
        message:
          response.status === 200
            ? 'Grupos obtenidos con éxito.'
            : 'Error al obtener grupos.',
        statusCode: response.status,
      })),
      catchError((error: HttpErrorResponse) => {
        let message = 'Error al obtener grupos.';
        if (error.status === 404) {
          message = 'Recurso no encontrado al obtener grupos.';
        } else if (error.status === 401) {
          message =
            'No autorizado para obtener grupos. Cierre de sesión inminente.';
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

  obtenerPermisos(): Observable<ReturnSearchResponse> {
    const observable = this.http.get<Permiso[]>(
      `${this.API_URL}/permisos/enlistar`,
      {
        observe: 'response',
      },
    );
    return observable.pipe(
      map((response: HttpResponse<Permiso[]>) => ({
        success: response.status === 200,
        payload: response.body || [],
        message:
          response.status === 200
            ? 'Permisos obtenidos con éxito.'
            : 'Error al obtener permisos.',
        statusCode: response.status,
      })),
      catchError((error: HttpErrorResponse) => {
        let message = 'Error al obtener permisos.';
        if (error.status === 404) {
          message = 'Recurso no encontrado al obtener permisos.';
        } else if (error.status === 401) {
          message =
            'No autorizado para obtener permisos. Cierre de sesión inminente.';
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
