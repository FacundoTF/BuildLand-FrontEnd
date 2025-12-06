import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PersonaFisicaService } from '../../../shared/services/persona-fisica/persona-fisica-servicio';
import { PersonaFisica } from '../../../core/entities/personaFisica/persona-fisica';
import { Usuario, TipoUsuario } from '../../../core/entities/usuario/usuario';
import { UsuarioServicio } from '../../../shared/services/usuario-servicio';

@Component({
  selector: 'app-persona-fisica-modificar',
  imports: [ReactiveFormsModule],
  templateUrl: './persona-fisica-modificar.html',
  styleUrl: './persona-fisica-modificar.scss',
})
export class PersonaFisicaModificar {
  service = inject(PersonaFisicaService);
  usuarioService = inject(UsuarioServicio);
  personaFisicaEncontrada: PersonaFisica | null = null;

  personaFisicaCuit = new FormGroup({
    cuit: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{11}$'),
    ]),
  });

  personaFisicaForm = new FormGroup({
    cuit: new FormControl(''),
    nombre: new FormControl(''),
    codigoPostal: new FormControl('', [Validators.pattern('^[0-9]{4}$')]),
    numeroTelefono: new FormControl('', [Validators.pattern('^[0-9]{10,15}$')]),
    ciudad: new FormControl(''),
    correoElectronico: new FormControl('', [Validators.email]),
    contraseña: new FormControl('', [Validators.minLength(6)]),
  });

  async handleSubmitCuit() {
    if (this.personaFisicaCuit.valid) {
      const cuit = this.personaFisicaCuit.value.cuit;
      if (cuit === null || cuit === undefined) {
        this.handleCuitError();
        return;
      }
      try {
        const result = await this.service.buscarPersonaFisica(
          this.personaFisicaCuit.value.cuit!,
        );
        if (result.success && result.payload) {
          const personaFisica = result.payload as PersonaFisica;
          console.log('Persona física encontrada:', personaFisica);
          console.log(typeof personaFisica);

          const container = document.querySelector(
            '.edit-container',
          ) as HTMLElement;
          container.className = 'edit-container is-visible';

          this.personaFisicaForm.patchValue({
            cuit: personaFisica.cuit,
            nombre: personaFisica.nombre,
            codigoPostal: personaFisica.codigoPostal,
            numeroTelefono: personaFisica.numeroTelefono,
            ciudad: personaFisica.ciudad,
            correoElectronico: '',
            contraseña: '',
          });
        } else {
          console.error(result.message);
          if (result.statusCode === 401) {
            this.usuarioService.cerrarSesion();
          }
          this.personaFisicaEncontrada = null;
          this.personaFisicaForm.reset();
        }
      } catch (error) {
        console.error('Error al buscar la persona física:', error);
        this.personaFisicaEncontrada = null;
      }
    } else {
      this.handleCuitError();
    }
  }

  handleCuitError() {
    console.error('CUIT inválido o vacío');
    this.personaFisicaEncontrada = null;
    this.personaFisicaForm.reset();
  }

  async handleModify() {
    if (this.personaFisicaForm.valid) {
      const personaFisicaData = this.personaFisicaForm.value;
      const cuit = this.personaFisicaCuit.value.cuit;

      if (!cuit) {
        console.error('CUIT no disponible');
        return;
      }

      const usuarioModificar = new Usuario(
        0, // id can be 0 as it's not used in the backend for modification
        TipoUsuario.PERSONA_FISICA,
        cuit,
        null as any, // grupo is not needed for modification
        personaFisicaData.correoElectronico!,
        personaFisicaData.contraseña!,
      );

      const personaModificar = new PersonaFisica(
        usuarioModificar,
        cuit,
        personaFisicaData.nombre!,
        personaFisicaData.numeroTelefono!,
        personaFisicaData.codigoPostal!,
        personaFisicaData.ciudad!,
      );

      try {
        const result = await this.service.modificarPersonaFisica(
          usuarioModificar,
          personaModificar,
        );
        if (result.success) {
          console.log(result.message);
          this.personaFisicaForm.reset();
          this.personaFisicaCuit.reset();
          this.personaFisicaEncontrada = null;
        } else {
          console.error(result.message);
          if (result.statusCode === 401) {
            this.usuarioService.cerrarSesion();
          }
        }
      } catch (error) {
        console.error('Error en la solicitud de modificación:', error);
      }
    } else {
      console.error('Formulario inválido');
      this.personaFisicaForm.reset();
      this.personaFisicaCuit.reset();
      this.personaFisicaEncontrada = null;
    }
  }
}
