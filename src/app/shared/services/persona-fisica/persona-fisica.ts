import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { PersonaFisica } from '../../../core/entities/personaFisica/persona-fisica';

@Injectable({
  providedIn: 'root',
})
export class PersonaFisicaService {
  private http = inject(HttpClient);
  private url = `${environment.server.host}${environment.server.port}/api/personas-fisicas`;

  agregarPersonaFisica(personaFisica: any, usuario: any): Observable<boolean> {
    const personaFisicaBackend = {
      id: personaFisica.cuit,
      nombre: personaFisica.nombre,
      numeroTelefono: personaFisica.numeroTelefono,
      codigoPostal: personaFisica.codigoPostal,
      ciudad: personaFisica.ciudad,
    };
    const usuarioBackend = {
      correoElectronico: usuario.correoElectronico,
      contraseña: usuario.contraseña,
      rol: usuario.rol,
    };

    console.log('Datos que se envían al backend:', personaFisicaBackend);
    console.log('Datos de usuario que se envían al backend:', usuarioBackend);

    return this.http
      .post<PersonaFisica>(this.url, {
        personaFisica: personaFisicaBackend,
        usuario: usuarioBackend,
      })
      .pipe(
        map((response) => {
          console.log('Persona física agregada exitosamente:', response);
          return true;
        }),
        catchError((error) => {
          console.error('Error al agregar persona física:', error);
          console.error('Error details:', error.error);
          return of(false);
        }),
      );
  }

  removerPersonaFisica(personaFisica: PersonaFisica): Observable<boolean> {
    console.log(
      'Intentando eliminar persona física con CUIT:',
      personaFisica.Cuit(),
    );
    return this.http
      .delete(`${this.url}/${personaFisica.Cuit()}`, { observe: 'response' })
      .pipe(
        map((response) => {
          console.log('Status de respuesta:', response.status);
          if (response.status === 204) {
            console.log(
              'Persona física eliminada exitosamente:',
              personaFisica.Cuit(),
            );
            return true;
          }
          return false;
        }),
        catchError((error) => {
          console.error('Error al eliminar persona física:', error);
          if (error.status === 404) {
            console.error('Persona física no encontrada');
          }
          return of(false);
        }),
      );
  }

  modificarPersonaFisica(
    cuit: string,
    personaFisica: any,
  ): Observable<boolean> {
    const personaFisicaBackend = {
      id: cuit,
      nombre: personaFisica.nombre,
      numeroTelefono: personaFisica.numeroTelefono,
      codigoPostal: personaFisica.codigoPostal,
      ciudad: personaFisica.ciudad,
      correoElectronico: personaFisica.correoElectronico,
      contraseña: personaFisica.contraseña,
    };

    console.log('Datos que se envían para modificar:', personaFisicaBackend);

    return this.http
      .put<PersonaFisica>(`${this.url}/${cuit}`, personaFisicaBackend)
      .pipe(
        map((response) => {
          console.log('Persona física modificada exitosamente:', response);
          return true;
        }),
        catchError((error) => {
          console.error('Error al modificar persona física:', error);
          console.error('Error details:', error.error);
          if (error.status === 404) {
            console.error('Persona física no encontrada');
          }
          return of(false);
        }),
      );
  }

  buscarPersonaFisica(
    cuit: string | null | undefined,
  ): Observable<PersonaFisica | null> {
    const cuitElegido = cuit?.trim();

    if (cuitElegido) {
      console.log('Buscando persona física con CUIT:', cuitElegido);

      return this.http.get<any>(`${this.url}/${cuitElegido}`).pipe(
        map((response) => {
          console.log('Persona física encontrada:', response);
          const personaFisica = new PersonaFisica(
            response.id,
            response.nombre,
            response.numeroTelefono,
            response.codigoPostal,
            response.ciudad,
          );
          return personaFisica;
        }),
        catchError((error) => {
          console.error('Error al buscar persona física:', error);
          if (error.status === 404) {
            console.error('Persona física no encontrada con CUIT:', cuitElegido);
          }
          return of(null);
        }),
      );
    } else {
      return of(null);
    }
  }
}