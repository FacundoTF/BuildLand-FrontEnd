import { inject, Injectable } from '@angular/core';
import { ConjuntoGrupoPermiso } from '../../core/entities/conjuntoGrupoPermiso/conjunto-grupo-permiso';
import { TipoUsuario, Usuario } from '../../core/entities/usuario/usuario';
import { Grupo } from '../../core/entities/grupo/grupo';
import { Permiso } from '../../core/entities/permiso/permiso';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { map, catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioServicio {
  http = inject(HttpClient);

  private API_URL = `${environment.server.host}${environment.server.port}/api/auth/token`;

  iniciarSesion(correo: string, contra: string): Observable<Object | never> {
    return this.http
      .post(
        `${this.API_URL}`,
        {
          username: correo,
          password: contra,
        },
        {
          withCredentials: true,
        }
      )
      .pipe(
        map((res: Object) => {
          console.log('Usuario encontrado');
          console.log(res);
          return res;
        }),
        catchError((error: Error) => {
          console.error('Error al buscar usuario:', error);
          return throwError(() => error);
        }),
      );
  }

  revisarPermisos(
    elementos: ConjuntoGrupoPermiso[],
    objetivo: Permiso | Grupo,
  ): boolean {
    let encontrado = false;
    // Lógica para revisar permisos
    for (const element of elementos) {
      // Lógica para revisar permisos en cada elemento
      if (element instanceof Grupo) {
        // Verificar si el grupo contiene el permiso o grupo objetivo
        let permisoEncontrado = false;
        let grupoEncontrado = false;

        if (objetivo instanceof Permiso) {
          permisoEncontrado = element.permisos.some(
            (permiso: Permiso) => permiso.nombre === objetivo.nombre,
          );
        }
        if (objetivo instanceof Grupo) {
          grupoEncontrado = element.grupos.some(
            (grupo: Grupo) => grupo.nombre === objetivo.nombre,
          );
        }
        if (permisoEncontrado || grupoEncontrado) {
          console.log(`Permiso o grupo encontrado en: ${element.nombre}`);
          encontrado = true;
          break;
        } else {
          // Llamada recursiva para revisar grupos anidados
          if (this.revisarPermisos(element.grupos, objetivo)) {
            console.log(
              `Permiso o grupo encontrado en grupo anidado de: ${element.nombre}`,
            );
            return true;
          }
        }
      } else if (element instanceof Permiso) {
        if (element.nombre === objetivo.nombre) {
          console.log(`Permiso encontrado: ${element.nombre}`);
          encontrado = true;
          break;
        } else {
          console.log(`Permiso no encontrado: ${element.nombre}`);
        }
      }
    }
    return encontrado;
  }
}
