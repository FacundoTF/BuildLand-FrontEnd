import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { PersonaFisica } from '../../../core/entities/personaFisica/persona-fisica';
import { Usuario } from '../../../core/entities/usuario/usuario';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PersonaFisicaService {
  http = inject(HttpClient);

  private API_URL = `${environment.server.host}${environment.server.port}/api/personas-fisicas`;

  async agregarPersonaFisica(persona: PersonaFisica): Promise<boolean> {
    const observable = this.http.post<boolean>(this.API_URL, persona);
    try {
      return await lastValueFrom(observable);
    } catch (error) {
      console.error('Error adding persona fisica:', error);
      return false;
    }
  }

  async buscarPersonaFisica(cuit: string): Promise<PersonaFisica | null> {
    const observable = this.http.get<PersonaFisica>(`${this.API_URL}/${cuit}`);
    try {
      return await lastValueFrom(observable);
    } catch (error) {
      console.error('Error fetching persona fisica:', error);
      return null;
    }
  }

  async modificarPersonaFisica(
    usuario: Usuario,
    persona: PersonaFisica,
  ): Promise<any> {
    const body = {
      usuario: {
        email: usuario.email,
        password: usuario.password,
        tipoUsuario: 'PERSONA_FISICA',
      },
      cuit: persona.cuit,
      nombre: persona.nombre,
      numeroTelefono: persona.numeroTelefono,
      codigoPostal: persona.codigoPostal,
      ciudad: persona.ciudad,
    };

    const observable = this.http.patch(`${this.API_URL}/`, body);
    try {
      return await lastValueFrom(observable);
    } catch (error) {
      console.error('Error modifying persona fisica:', error);
      return null;
    }
  }

  async removerPersonaFisica(
    personaFisicaEncontrada: PersonaFisica,
  ): Promise<any> {
    const observable = this.http.delete(
      `${this.API_URL}/${personaFisicaEncontrada.cuit}`,
    );
    try {
      return await lastValueFrom(observable);
    } catch (error) {
      console.error('Error removing persona fisica:', error);
      return null;
    }
  }
}
