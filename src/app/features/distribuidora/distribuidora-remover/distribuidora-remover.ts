import { Component, inject, signal } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import { Distribuidora } from '../../../core/entities/distribuidora/distribuidora';
import { DistribuidoraServicio } from '../../../shared/services/distribuidora/distribuidora-servicio';
import { UsuarioServicio } from '../../../shared/services/usuario-servicio';
import { DialogService } from '../../../shared/services/dialog.service';

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
  usuarioService = inject(UsuarioServicio);
  dialogService = inject(DialogService);
  distribuidoraEncontrada: Distribuidora | null = null;

  distribuidoraCuit = new FormGroup({
    cuit: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{11}$'),
    ]),
  });

  async handleSubmitCuit() {
    if (this.distribuidoraCuit.valid) {
      const distribuidora = await this.service.buscarDistribuidoraCuit(
        this.distribuidoraCuit.value.cuit,
      );
      if (distribuidora.success) {
        this.distribuidoraEncontrada = distribuidora.payload as Distribuidora;
      } else {
        this.dialogService
          .showMessage('Error', distribuidora.message)
          .subscribe();
        if (distribuidora.statusCode === 401) {
          this.usuarioService.cerrarSesion();
        }
        this.distribuidoraEncontrada = null;
      }
    } else {
      this.dialogService
        .showMessage('Error', 'CUIT inválido o vacío')
        .subscribe();
      this.distribuidoraEncontrada = null;
    }
  }

  async handleRemove() {
    if (this.distribuidoraEncontrada) {
      try {
        const result = await this.service.removerDistribuidora(
          this.distribuidoraEncontrada,
        );
        if (result.success) {
          this.dialogService
            .showMessage('Éxito', result.message)
            .subscribe(() => {
              this.distribuidoraCuit.reset();
              this.distribuidoraEncontrada = null;
            });
        } else {
          this.dialogService.showMessage('Error', result.message).subscribe();
          if (result.statusCode === 401) {
            this.usuarioService.cerrarSesion();
          }
        }
      } catch (error) {
        this.dialogService
          .showMessage('Error', 'Error en la solicitud de eliminación')
          .subscribe();
      }
    }
  }
}
