import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { map, catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UsuarioServicio {
  http = inject(HttpClient);
  router = inject(Router);

  emailRecuperando = signal('');
  estaAutenticado = signal(false);

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
          this.estaAutenticado.set(true);
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

  cerrarSesion() {
    // Establecer inmediatamente el estado de autenticación en false
    this.estaAutenticado.set(false);

    sessionStorage.removeItem('permisos');
    sessionStorage.removeItem('grupos');

    const observable = this.http.post(`${this.API_URL}/auth/logout`, {});
    observable.subscribe({
      next: () => {
        this.router.navigate(['/iniciar-sesion']);
      },
      error: (a) => {
        console.error('Error al cerrar sesión:', a);
        // Aún así redirigir al login
        this.router.navigate(['/iniciar-sesion']);
      },
    });
  }
}
