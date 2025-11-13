import { Component, inject, signal } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import { PersonaFisica } from '../../../core/entities/personaFisica/persona-fisica';
import { PersonaFisicaService } from '../../../shared/services/persona-fisica/persona-fisica-servicio';

@Component({
  selector: 'app-persona-fisica-remover',
  imports: [ReactiveFormsModule],
  templateUrl: './persona-fisica-remover.html',
  styleUrl: './persona-fisica-remover.scss',
})
export class PersonaFisicaRemover {
  mostarFormPersonaFisica = signal(false);

  mostarComponenteBorrado() {
    this.mostarFormPersonaFisica.set(!this.mostarFormPersonaFisica());
  }

  service = inject(PersonaFisicaService);
  personaFisicaEncontrada: PersonaFisica | null = null;

  personaFisicaCuit = new FormGroup({
    cuit: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{11}$'),
    ]),
  });

  deleteForm = new FormGroup({
    confirmDelete: new FormControl(false, Validators.requiredTrue),
  });

  async handleSubmitCuit() {
    if (this.personaFisicaCuit.valid) {
      const cuit = this.personaFisicaCuit.value.cuit;
      if (cuit === null || cuit === undefined) {
        this.handleCuitError();
        return;
      }
      try {
        const personaFisica = await this.service.buscarPersonaFisica(
          this.personaFisicaCuit.value.cuit!,
        );
        if (personaFisica) {
          console.log('Persona física encontrada:', personaFisica);
          this.personaFisicaEncontrada = personaFisica;
          this.mostarComponenteBorrado();
        } else {
          console.error(
            'No se encontró la persona física con el CUIT proporcionado',
          );
          this.personaFisicaEncontrada = null;
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
  }

  async handleRemove() {
    if (!this.deleteForm.valid) {
      alert(
        'Debe confirmar que desea eliminar la persona física marcando la casilla de confirmación.',
      );
      return;
    }
    if (this.personaFisicaEncontrada && this.personaFisicaCuit.valid) {
      try {
        const success = await this.service.removerPersonaFisica(
          this.personaFisicaEncontrada,
        );
        console.log('Persona física removida exitosamente');
        var container = document.querySelector(
          '.delete-container',
        ) as HTMLElement;
        container.style.display = 'none';
        this.personaFisicaCuit.reset();
        this.personaFisicaEncontrada = null;
        this.deleteForm.reset();
      } catch (error) {
        console.error('Error en la solicitud de eliminación:', error);
      }
    }
  }
}
