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
        alert('Error: ' + distribuidora.message);
        if (distribuidora.statusCode === 401) {
          this.usuarioService.cerrarSesion();
        }
        this.distribuidoraEncontrada = null;
      }
    } else {
      alert('CUIT inválido o vacío');
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
          alert(result.message);
          this.distribuidoraCuit.reset();
          this.distribuidoraEncontrada = null;
        } else {
          alert(result.message);
          if (result.statusCode === 401) {
            this.usuarioService.cerrarSesion();
          }
        }
      } catch (error) {
        alert('Error en la solicitud de eliminación');
      }
    }
  }
}
