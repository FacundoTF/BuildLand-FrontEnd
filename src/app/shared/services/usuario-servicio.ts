import { inject, Injectable, signal } from '@angular/core';
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

  emailRecuperando = signal('');

  enviarCodigoRestauracion = signal(false);
  confirmarNuevaContrasena = signal(false);

  private API_URL = `${environment.server.host}${environment.server.port}/api`;

  iniciarSesion(correo: string, contra: string): Observable<Object | never> {
    return this.http
      .post(`${this.API_URL}/auth/token`, {
        username: correo,
        password: contra,
      })
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

  restorePassword(email: string): Observable<Object | never> {
    return this.http
      .post(`${this.API_URL}/auth/restorePassword`, { email })
      .pipe(
        map((res: Object) => {
          console.log('Código de restauración enviado');
          console.log(res);
          return res;
        }),
        catchError((error: Error) => {
          console.error('Error al enviar código de restauración:', error);
          return throwError(() => error);
        }),
      );
  }

  verifyPasswordCode(code: string): Observable<Object | never> {
    return this.http
      .post(`${this.API_URL}/auth/verifyPasswordCode`, {
        code,
        email: this.emailRecuperando(),
      })
      .pipe(
        map((res: Object) => {
          console.log('Código verificado exitosamente');
          console.log(res);
          return res;
        }),
        catchError((error: Error) => {
          console.error('Error al verificar código:', error);
          return throwError(() => error);
        }),
      );
  }

  changePassword(password: string): Observable<Object | never> {
    return this.http
      .post(`${this.API_URL}/auth/changePassword`, {
        password,
        email: this.emailRecuperando(),
      })
      .pipe(
        map((res: Object) => {
          console.log('Contraseña cambiada exitosamente');
          console.log(res);
          return res;
        }),
        catchError((error: Error) => {
          console.error('Error al cambiar contraseña:', error);
          return throwError(() => error);
        }),
      );
  }

  establecerEmailRecuperando(email: string) {
    this.emailRecuperando.set(email);
  }
}
