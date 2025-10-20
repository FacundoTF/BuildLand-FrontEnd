import { Component, inject, signal } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import { Distribuidora } from '../../../core/entities/distribuidora/distribuidora';
import { DistribuidoraServicio } from '../distribuidora-servicio';

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

  handleSubmitCuit() {
    if (this.distribuidoraCuit.valid) {
      this.service
        .buscarDistribuidoraCuit(this.distribuidoraCuit.value.cuit)
        .subscribe({
          next: (distribuidora) => {
            if (distribuidora) {
              console.log('Distribuidora encontrada:', distribuidora);
              this.distribuidoraEncontrada = distribuidora;
              // var container = document.querySelector(
              //   '.delete-container'
              // ) as HTMLElement;
              // container.style.display = 'block';
              this.mostrarFormDistribuidora();
            } else {
              console.error(
                'No se encontró la distribuidora con el CUIT proporcionado'
              );
              this.distribuidoraEncontrada = null;
            }
          },
          error: (error) => {
            console.error('Error al buscar la distribuidora:', error);
            this.distribuidoraEncontrada = null;
          },
        });
    }
  }

  handleRemove() {
    if (this.distribuidoraEncontrada && this.distribuidoraCuit.valid) {
      this.service
        .removerDistribuidora(this.distribuidoraEncontrada)
        .subscribe({
          next: (success) => {
            if (success) {
              console.log('Distribuidora removida exitosamente');
              // Ocultar el contenedor de eliminación y resetear el formulario
              var container = document.querySelector(
                '.delete-container'
              ) as HTMLElement;
              container.style.display = 'none';
              this.distribuidoraCuit.reset();
              this.distribuidoraEncontrada = null;
            } else {
              console.error('Error al remover la distribuidora');
            }
          },
          error: (error) => {
            console.error('Error en la solicitud de eliminación:', error);
          },
        });
    }
  }
}
