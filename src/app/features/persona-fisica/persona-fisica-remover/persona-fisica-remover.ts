import { Component, inject, signal } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import { PersonaFisica } from '../../../core/entities/personaFisica/persona-fisica';
import { PersonaFisicaService } from '../../../shared/services/persona-fisica/persona-fisica-servicio';
import { UsuarioServicio } from '../../../shared/services/usuario-servicio';
import { DialogService } from '../../../shared/services/dialog.service';

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
  usuarioService = inject(UsuarioServicio);
  dialogService = inject(DialogService);
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
        const result = await this.service.buscarPersonaFisica(
          this.personaFisicaCuit.value.cuit!,
        );
        if (result.success && result.payload) {
          const personaFisica = result.payload as PersonaFisica;
          console.log('Persona física encontrada:', personaFisica);
          this.personaFisicaEncontrada = personaFisica;
          this.mostarComponenteBorrado();
        } else {
          console.error(result.message);
          if (result.statusCode === 401) {
            this.usuarioService.cerrarSesion();
          }
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
      this.dialogService
        .showMessage(
          'Error',
          'Debe confirmar que desea eliminar la persona física marcando la casilla de confirmación.',
        )
        .subscribe();
      return;
    }
    if (this.personaFisicaEncontrada && this.personaFisicaCuit.valid) {
      try {
        const result = await this.service.removerPersonaFisica(
          this.personaFisicaEncontrada,
        );
        if (result.success) {
          this.dialogService.showMessage('Éxito', result.message).subscribe();
        } else {
          this.dialogService.showMessage('Error', result.message).subscribe();
          if (result.statusCode === 401) {
            this.usuarioService.cerrarSesion();
          }
        }
        var container = document.querySelector(
          '.delete-container',
        ) as HTMLElement;
        container.style.display = 'none';
        this.personaFisicaCuit.reset();
        this.personaFisicaEncontrada = null;
        this.deleteForm.reset();
      } catch (error) {
        this.dialogService
          .showMessage('Error', 'Error en la solicitud de eliminación')
          .subscribe();
      }
    }
  }
}
