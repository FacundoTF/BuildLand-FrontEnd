import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { PersonaFisica } from '../../../core/entities/personaFisica/persona-fisica';
import { Usuario } from '../../../core/entities/usuario/usuario';

@Injectable({
  providedIn: 'root',
})
export class PersonaFisicaService {
  http = inject(HttpClient);

  private API_URL = `${environment.server.host}${environment.server.port}/api/personas-fisicas`;

  agregarPersonaFisica(persona: PersonaFisica, usuario: Usuario) {
    const body = {
      personaFisica: persona,
      usuario: usuario,
    };

    return this.http.post<boolean>(this.API_URL, body);
  }

  buscarPersonaFisica(cuit: string) {
    const body = {
      personaFisica: cuit,
    };

    return this.http.get<PersonaFisica>(`${this.API_URL}/${cuit}`);
  }

  modificarPersonaFisica(usuario: Usuario, persona: PersonaFisica) {
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

    return this.http.patch(`${this.API_URL}/`, body);
  }

  removerPersonaFisica(personaFisicaEncontrada: PersonaFisica) {
    return this.http.delete(
      `${this.API_URL}/${personaFisicaEncontrada.cuit}`,
    );
  }
}
