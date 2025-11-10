import { inject, Injectable } from '@angular/core';
import { Distribuidora } from '../../../core/entities/distribuidora/distribuidora';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class DistribuidoraServicio {
  private http = inject(HttpClient);
  private url = `${environment.server.host}${environment.server.port}/api/distribuidoras`;

  agregarDistribuidora(distribuidora: any, usuario: any): Observable<boolean> {
    // Mapear los datos del formulario al formato que espera el backend
    const distribuidoraBackend = {
      id: distribuidora.cuit,
      nombre: distribuidora.nombre,
      direccion: distribuidora.direccion,
      numeroTelefono: distribuidora.numeroTelefono,
      descripcion: distribuidora.descripcion,
      codigoPostal: distribuidora.codigoPostal,
      ciudad: distribuidora.ciudad,
    };
    const usuarioBackend = {
      correoElectronico: usuario.correoElectronico,
      contraseña: usuario.contraseña,
      rol: usuario.rol,
    };

    console.log('Datos que se envían al backend:', distribuidoraBackend);
    console.log('Datos de usuario que se envían al backend:', usuarioBackend);

    return this.http
      .post<Distribuidora>(this.url, {
        distribuidora: distribuidoraBackend,
        usuario: usuarioBackend,
      })
      .pipe(
        map((response) => {
          console.log('Distribuidora agregada exitosamente:', response);
          return true;
        }),
        catchError((error) => {
          console.error('Error al agregar distribuidora:', error);
          console.error('Error details:', error.error);
          return of(false);
        }),
      );
  }
  removerDistribuidora(distribuidora: Distribuidora): Observable<boolean> {
    console.log(
      'Intentando eliminar distribuidora con CUIT:',
      distribuidora.cuit,
    );
    return this.http
      .delete(`${this.url}/${distribuidora.cuit}`, { observe: 'response' })
      .pipe(
        map((response) => {
          console.log('Status de respuesta:', response.status);
          if (response.status === 204) {
            console.log(
              'Distribuidora eliminada exitosamente:',
              distribuidora.cuit,
            );
            return true;
          }
          return false;
        }),
        catchError((error) => {
          console.error('Error al eliminar distribuidora:', error);
          if (error.status === 404) {
            console.error('Distribuidora no encontrada');
          }
          return of(false);
        }),
      );
  }
  modificarDistribuidora(
    cuit: string,
    distribuidora: any,
  ): Observable<boolean> {
    // Mapear los datos del formulario al formato que espera el backend
    const distribuidoraBackend = {
      id: cuit, // Mantener el CUIT original
      nombre: distribuidora.nombre,
      direccion: distribuidora.direccion,
      numeroTelefono: distribuidora.numeroTelefono,
      descripcion: distribuidora.descripcion,
      codigoPostal: distribuidora.codigoPostal,
      ciudad: distribuidora.ciudad,
      correoElectronico: distribuidora.correoElectronico,
      contraseña: distribuidora.contraseña,
    };

    console.log('Datos que se envían para modificar:', distribuidoraBackend);

    return this.http
      .put<Distribuidora>(`${this.url}/${cuit}`, distribuidoraBackend)
      .pipe(
        map((response) => {
          console.log('Distribuidora modificada exitosamente:', response);
          return true;
        }),
        catchError((error) => {
          console.error('Error al modificar distribuidora:', error);
          console.error('Error details:', error.error);
          if (error.status === 404) {
            console.error('Distribuidora no encontrada');
          }
          return of(false);
        }),
      );
  }

  buscarDistribuidoraCuit(
    cuit: string | null | undefined,
  ): Observable<Distribuidora | null> {
    const cuitElegido = cuit?.trim();

    if (cuitElegido) {
      console.log('Buscando distribuidora con CUIT:', cuitElegido);

      return this.http.get<any>(`${this.url}/${cuitElegido}`).pipe(
        map((response) => {
          console.log('Distribuidora encontrada:', response);
          // Crear una instancia de Distribuidora a partir de la respuesta JSON
          const distribuidora = new Distribuidora(
            null as any, // The user is not sent in this request
            response.cuit,
            response.nombre,
            response.direccion,
            response.numeroTelefono,
            response.descripcion,
            response.codigoPostal,
            response.ciudad
          );
          return distribuidora;
        }),
        catchError((error) => {
          console.error('Error al buscar distribuidora:', error);
          if (error.status === 404) {
            console.error('Distribuidora no encontrada con CUIT:', cuitElegido);
          }
          return of(null);
        }),
      );
    } else {
      return of(null);
    }
  }
}
