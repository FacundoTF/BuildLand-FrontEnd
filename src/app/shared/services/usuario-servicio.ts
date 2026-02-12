import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { map, catchError, Observable, throwError, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { ReturnSearchResponse } from '../../core/response-type/return-search-response';
import { ReturnResultResponse } from '../../core/response-type/return-response';
import { Usuario } from '../../core/entities/usuario/usuario';
import { UsuarioRequest } from '../../core/entities/usuario/usuario-request';
import { EntidadRegistrada } from '../../core/entities/usuario/entidad-registrada';
import { Empleado } from '../../core/entities/empleado/empleado';
import { Distribuidora } from '../../core/entities/distribuidora/distribuidora';
import { PersonaFisica } from '../../core/entities/personaFisica/persona-fisica';

@Injectable({
  providedIn: 'root',
})
export class UsuarioServicio {
  http = inject(HttpClient);
  router = inject(Router);

  emailRecuperando = signal('');
  estaAutenticado = signal(false);
  nombreUsuario = signal('');

  enviarCodigoRestauracion = signal(false);
  confirmarNuevaContrasena = signal(false);

  private API_URL = `${environment.server.host}${environment.server.port}/api`;

  agregarUsuario(request: UsuarioRequest): Observable<EntidadRegistrada> {
    return this.http
      .post<EntidadRegistrada>(`${this.API_URL}/usuarios`, request)
      .pipe(
        map((res) => {
          console.log('Usuario agregado con éxito', res);
          return res;
        }),
        catchError((error: Error) => {
          console.error('Error al agregar usuario:', error);
          return throwError(() => error);
        }),
      );
  }

  identificarUsuario(): Observable<ReturnSearchResponse> {
    return this.http.get<Usuario>(`${this.API_URL}/usuarios`).pipe(
      map((res) => {
        console.log('Usuario identificado');
        console.log(res);
        this.estaAutenticado.set(true);
        if (res) {
          return {
            success: true,
            payload: res,
            message: 'Usuario identificado correctamente',
            statusCode: 200,
          };
        } else {
          return {
            success: false,
            payload: null,
            message: 'Usuario no identificado correctamente',
            statusCode: 404,
          };
        }
      }),
      catchError((error: Error) => {
        console.error('Error al identificar usuario:', error);
        this.estaAutenticado.set(false);
        return throwError(() => error);
      }),
    );
  }

  obtenerNombreUsuario(correo: string) {
    const response = this.http
      .get<EntidadRegistrada>(`${this.API_URL}/usuarios/email/${correo}`, {
        observe: 'response',
      })
      .pipe(
        map((res) => {
          console.log('Nombre de usuario obtenido');
          console.log(res);
          return res;
        }),
        catchError((error: Error) => {
          console.error('Error al obtener nombre de usuario:', error);
          return throwError(() => error);
        }),
      );
    response.subscribe((res) => {
      const nombre = res.body?.nombre || '';
      this.nombreUsuario.set(nombre);
    });
  }

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
          this.obtenerNombreUsuario(correo);
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

  async buscarUsuarioPorEmail(
    email: string | null | undefined,
  ): Promise<ReturnSearchResponse> {
    const emailElegido = email?.trim();

    if (emailElegido) {
      const observable = this.http.get<EntidadRegistrada>(
        `${this.API_URL}/usuarios/email/${encodeURIComponent(emailElegido)}`,
        {
          observe: 'response',
        },
      );
      try {
        const response = await lastValueFrom(observable);
        return {
          success: true,
          message: 'Usuario encontrado con éxito.',
          payload: response.body,
          statusCode: response.status,
        };
      } catch (error: any) {
        let errorMessage = 'Error al buscar usuario.';
        if (error.status === 404) {
          errorMessage = 'Usuario no encontrado con ese correo electrónico.';
        } else if (error.status === 401) {
          errorMessage =
            'No autorizado para buscar el usuario. Cierre de sesión inminente.';
        }
        return {
          success: false,
          message: errorMessage,
          payload: null,
          statusCode: error.status || 500,
        };
      }
    } else {
      return {
        success: false,
        message: 'Correo electrónico inválido o vacío.',
        payload: null,
        statusCode: 400,
      };
    }
  }

  async buscarUsuarioPorCuit(
    cuit: string | null | undefined,
  ): Promise<ReturnSearchResponse> {
    const cuitElegido = cuit?.trim();

    if (cuitElegido) {
      const observable = this.http.get<any>(
        `${this.API_URL}/usuarios/cuit/${cuitElegido}`,
        {
          observe: 'response',
        },
      );
      try {
        const response = await lastValueFrom(observable);
        const usuario = new Usuario(
          response.body!.cuit,
          response.body!.tipoUsuario,
          response.body!.estado,
          response.body!.conjunto,
          response.body!.email,
          response.body!.password,
        );
        return {
          success: true,
          message: 'Usuario encontrado con éxito.',
          payload: usuario,
          statusCode: response.status,
        };
      } catch (error: any) {
        let errorMessage = 'Error al buscar usuario.';
        if (error.status === 404) {
          errorMessage = 'Usuario no encontrado con CUIT.';
        } else if (error.status === 401) {
          errorMessage =
            'No autorizado para buscar el usuario. Cierre de sesión inminente.';
        }
        return {
          success: false,
          message: errorMessage,
          payload: null,
          statusCode: error.status || 500,
        };
      }
    } else {
      return {
        success: false,
        message: 'CUIT inválido o vacío.',
        payload: null,
        statusCode: 400,
      };
    }
  }

  async removerUsuario(
    usuarioEncontrado: Usuario,
  ): Promise<ReturnResultResponse> {
    const observable = this.http.delete(
      `${this.API_URL}/usuarios/${usuarioEncontrado.cuit}`,
      {
        observe: 'response',
      },
    );
    try {
      const response = await lastValueFrom(observable);
      return {
        success: true,
        message: 'Usuario eliminado con éxito.',
        statusCode: response.status,
      };
    } catch (error: any) {
      console.error('Error removing usuario:', error);
      let errorMessage = 'Error al eliminar usuario.';
      if (error.status === 404) {
        errorMessage = 'Usuario no encontrado.';
      } else if (error.status === 401) {
        errorMessage =
          'No autorizado para eliminar el usuario. Cierre de sesión inminente.';
      }
      return {
        success: false,
        message: errorMessage,
        statusCode: error.status || 500,
      };
    }
  }

  async modificarUsuario(
    entidad: EntidadRegistrada,
  ): Promise<ReturnResultResponse> {
    let body = null;
    if (entidad instanceof Empleado) {
      body = {
        nombre: entidad.nombre,
        ciudad: entidad.ciudad,
        codigoPostal: entidad.codigoPostal,
        numeroTelefono: entidad.numeroTelefono,
        direccion: entidad.direccion,
        usuario: entidad.usuario,
      };
    }
    if (entidad instanceof Distribuidora) {
      body = {
        nombre: entidad.nombre,
        ciudad: entidad.ciudad,
        codigoPostal: entidad.codigoPostal,
        numeroTelefono: entidad.numeroTelefono,
        direccion: entidad.direccion,
        usuario: entidad.usuario,
        descripcion: entidad.descripcion,
        categorias: entidad.categorias,
      };
    }
    if (entidad instanceof PersonaFisica) {
      body = {
        nombre: entidad.nombre,
        ciudad: entidad.ciudad,
        codigoPostal: entidad.codigoPostal,
        numeroTelefono: entidad.numeroTelefono,
        usuario: entidad.usuario,
      };
    }
    const observable = this.http.patch<EntidadRegistrada>(
      `${this.API_URL}/usuarios`,
      {
        ...body,
      },
      {
        observe: 'response',
      },
    );
    try {
      const response = await lastValueFrom(observable);
      return {
        success: true,
        message: 'Usuario modificado con éxito.',
        statusCode: response.status,
      };
    } catch (error: any) {
      console.error('Error al modificar usuario:', error);
      let errorMessage = 'Error al modificar usuario.';
      if (error.status === 404) {
        errorMessage = 'Usuario no encontrado.';
      } else if (error.status === 401) {
        errorMessage =
          'No autorizado para modificar el usuario. Cierre de sesión inminente.';
      }
      return {
        success: false,
        message: errorMessage,
        statusCode: error.status || 500,
      };
    }
  }

  async resetearClaveUsuario(
    email: string,
    nuevaContrasena: string,
  ): Promise<ReturnResultResponse> {
    const datos = [email, nuevaContrasena];
    const observable = this.http.patch<EntidadRegistrada>(
      `${this.API_URL}/usuarios/resetear`,
      {
        email: email,
        code: nuevaContrasena,
      },
      {
        observe: 'response',
      },
    );
    try {
      const response = await lastValueFrom(observable);
      return {
        success: true,
        message: 'Contraseña reseteada con éxito.',
        statusCode: response.status,
      };
    } catch (error: any) {
      console.error('Error al resetear contraseña:', error);
      let errorMessage = 'Error al resetear la contraseña.';
      if (error.status === 404) {
        errorMessage = 'Usuario no encontrado.';
      } else if (error.status === 401) {
        errorMessage =
          'No autorizado para resetear la contraseña. Cierre de sesión inminente.';
      }
      return {
        success: false,
        message: errorMessage,
        statusCode: error.status || 500,
      };
    }
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
