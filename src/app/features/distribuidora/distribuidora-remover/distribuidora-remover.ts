import { Component, inject, signal } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import { Distribuidora } from '../../../core/entities/distribuidora/distribuidora';
import { DistribuidoraServicio } from '../../../shared/services/distribuidora/distribuidora-servicio';

@Component({
  selector: 'app-distribuidora-remover',
  imports: [ReactiveFormsModule],
  templateUrl: './distribuidora-remover.html',
  styleUrl: './distribuidora-remover.scss',
})
export class DistribuidoraRemover {
  mostarFormDistribuidora = signal(false);

  mostrarFormDistribuidora() {
    this.mostarFormDistribuidora.set(!this.mostarFormDistribuidora());
  }

  service = inject(DistribuidoraServicio);
  distribuidoraEncontrada: Distribuidora | null = null;

  distribuidoraCuit = new FormGroup({
    cuit: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{11}$'),
    ]),
  });

  async handleSubmitCuit() {
    if (this.distribuidoraCuit.valid) {
      try {
        const distribuidora = await this.service.buscarDistribuidoraCuit(
          this.distribuidoraCuit.value.cuit,
        );
        if (distribuidora) {
          console.log('Distribuidora encontrada:', distribuidora);
          this.distribuidoraEncontrada = distribuidora;
        } else {
          console.error(
            'No se encontró la distribuidora con el CUIT proporcionado',
          );
          this.distribuidoraEncontrada = null;
        }
      } catch (error) {
        console.error('Error al buscar la distribuidora:', error);
        this.distribuidoraEncontrada = null;
      }
    } else {
      console.error('CUIT inválido o vacío');
      this.distribuidoraEncontrada = null;
    }
  }

  async handleRemove() {
    if (this.distribuidoraEncontrada) {
      try {
        const success = await this.service.removerDistribuidora(
          this.distribuidoraEncontrada,
        );
        if (success) {
          console.log('Distribuidora eliminada exitosamente');
          this.distribuidoraCuit.reset();
          this.distribuidoraEncontrada = null;
        } else {
          console.error('Error al eliminar la distribuidora');
        }
      } catch (error) {
        console.error('Error en la solicitud de eliminación:', error);
      }
    }
  }
}
