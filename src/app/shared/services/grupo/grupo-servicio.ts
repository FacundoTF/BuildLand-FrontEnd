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
    return lastValueFrom(
      this.http.post<ReturnResultResponse>(`${this.API_URL}/grupos`, {
        type: 'grupo',
        id: 0,
        nombre: request.nombre,
        descripcion: request.descripcion,
        elementos: request.elementos.map((e) => {
          // Check if it's a Grupo (has elementos property)
          if ('elementos' in e) {
            return {
              type: 'grupo',
              id: (e as Grupo).id,
              nombre: e.nombre,
              descripcion: (e as Grupo).descripcion,
            };
          }
          // It's a Permiso
          return {
            type: 'permiso',
            id: (e as Permiso).id,
            nombre: e.nombre,
            descripcion: (e as Permiso).descripcion,
          };
        }),
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

  async removerGrupo(grupoId: number): Promise<ReturnResultResponse> {
    const observable = this.http.delete(`${this.API_URL}/grupos/${grupoId}`, {
      observe: 'response',
    });

    try {
      const response = await lastValueFrom(observable);
      if (response.status === 204 || response.status === 200) {
        return {
          success: true,
          message: 'Grupo eliminado con éxito.',
          statusCode: response.status,
        };
      }
      return {
        success: false,
        message: 'Error al eliminar grupo.',
        statusCode: response.status,
      };
    } catch (error: any) {
      let errorMessage = 'Error al eliminar grupo.';
      if (error.status === 404) {
        errorMessage = 'Grupo no encontrado.';
      } else if (error.status === 401) {
        errorMessage =
          'No autorizado para eliminar el grupo. Cierre de sesión inminente.';
      }
      return {
        success: false,
        message: errorMessage,
        statusCode: error.status || 500,
      };
    }
  }

  async modificarGrupo(grupo: Grupo): Promise<ReturnResultResponse> {
    try {
      const response = await lastValueFrom(
        this.http.patch<ReturnResultResponse>(
          `${this.API_URL}/grupos`,
          {
            type: 'grupo',
            id: grupo.id,
            nombre: grupo.nombre,
            descripcion: grupo.descripcion,
            elementos: grupo.elementos.map((e) => {
              // Check if it's a Grupo (has elementos property)
              if ('elementos' in e) {
                return {
                  type: 'grupo',
                  id: (e as Grupo).id,
                  nombre: e.nombre,
                  descripcion: (e as Grupo).descripcion,
                };
              }
              // It's a Permiso
              return {
                type: 'permiso',
                id: (e as Permiso).id,
                nombre: e.nombre,
                descripcion: (e as Permiso).descripcion,
              };
            }),
          },
          { observe: 'response' },
        ),
      );

      if (response.status === 200 || response.status === 204) {
        return {
          success: true,
          message: 'Grupo modificado con éxito.',
          statusCode: response.status,
        };
      }
      return {
        success: false,
        message: 'Error al modificar grupo.',
        statusCode: response.status,
      };
    } catch (error: any) {
      let errorMessage = 'Error al modificar grupo.';
      if (error.status === 404) {
        errorMessage = 'Grupo no encontrado.';
      } else if (error.status === 401) {
        errorMessage =
          'No autorizado para modificar el grupo. Cierre de sesión inminente.';
      }
      return {
        success: false,
        message: errorMessage,
        statusCode: error.status || 500,
      };
    }
  }
}
