import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
import { PersonaFisicaService } from '../../../shared/services/persona-fisica/persona-fisica-servicio';
import { PersonaFisica } from '../../../core/entities/personaFisica/persona-fisica';
import { Usuario, TipoUsuario } from '../../../core/entities/usuario/usuario';
import { Grupo } from '../../../core/entities/grupo/grupo';

@Component({
  selector: 'app-persona-fisica-agregar',
  imports: [ReactiveFormsModule],
  templateUrl: './persona-fisica-agregar.html',
  styleUrl: './persona-fisica-agregar.scss',
})
export class PersonaFisicaAgregar {
  service = inject(PersonaFisicaService);

  personaFisicaForm = new FormGroup({
    cuit: new FormControl('', {
      validators: [Validators.required, Validators.pattern('^[0-9]{11}$')],
      nonNullable: true,
    }),
    nombre: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    codigoPostal: new FormControl('', {
      validators: [Validators.required, Validators.pattern('^[0-9]{4}$')],
      nonNullable: true,
    }),
    numeroTelefono: new FormControl('', {
      validators: [Validators.required, Validators.pattern('^[0-9]{10,15}$')],
      nonNullable: true,
    }),
    ciudad: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    correoElectronico: new FormControl('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    contraseña: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
      nonNullable: true,
    }),
  });

  async handleSubmit() {
    if (this.personaFisicaForm.valid) {
      const {
        cuit,
        nombre,
        numeroTelefono,
        codigoPostal,
        ciudad,
        correoElectronico,
        contraseña,
      } = this.personaFisicaForm.getRawValue();

      const usuario = new Usuario(
        null,
        TipoUsuario.PERSONA_FISICA,
        cuit,
        null as any,
        correoElectronico,
        contraseña,
      );
      const persona = new PersonaFisica(
        usuario,
        cuit,
        nombre,
        numeroTelefono,
        codigoPostal,
        ciudad,
      );

      try {
        const result = await this.service.agregarPersonaFisica(persona);
        if (result) {
          alert('Persona física agregada exitosamente');
          this.personaFisicaForm.reset();
        } else {
          alert('Error al agregar la persona física');
        }
      } catch (error) {
        alert('Error en la solicitud:');
      }
    }
  }
}
