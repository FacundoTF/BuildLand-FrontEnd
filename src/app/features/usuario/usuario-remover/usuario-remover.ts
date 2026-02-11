import { Component, inject, signal } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import { Usuario } from '../../../core/entities/usuario/usuario';
import { UsuarioServicio } from '../../../shared/services/usuario-servicio';
import { DialogService } from '../../../shared/services/dialog.service';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-usuario-remover',
  imports: [ReactiveFormsModule, MatButton, MatCheckbox],
  templateUrl: './usuario-remover.html',
  styleUrl: './usuario-remover.scss',
})
export class UsuarioRemover {
  mostarFormUsuario = signal(false);

  mostarComponenteBorrado() {
    this.mostarFormUsuario.set(!this.mostarFormUsuario());
  }

  usuarioService = inject(UsuarioServicio);
  dialogService = inject(DialogService);
  usuarioEncontrado: Usuario | null = null;

  usuarioCuit = new FormGroup({
    cuit: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{11}$'),
    ]),
  });

  deleteForm = new FormGroup({
    confirmDelete: new FormControl(false, Validators.requiredTrue),
  });

  async handleSubmitCuit() {
    if (this.usuarioCuit.valid) {
      const cuit = this.usuarioCuit.value.cuit;
      if (cuit === null || cuit === undefined) {
        this.handleCuitError();
        return;
      }
      try {
        const result = await this.usuarioService.buscarUsuarioPorCuit(
          this.usuarioCuit.value.cuit!,
        );
        if (result.success && result.payload) {
          const usuario = result.payload as Usuario;
          console.log('Usuario encontrado:', usuario);
          this.usuarioEncontrado = usuario;
          this.mostarComponenteBorrado();
        } else {
          console.error(result.message);
          if (result.statusCode === 401) {
            this.usuarioService.cerrarSesion();
          }
          if (result.statusCode === 404) {
            this.dialogService
              .showMessage('Error', 'Usuario no encontrado con ese CUIT.')
              .subscribe();
          } else {
            this.dialogService
              .showMessage('Error', 'Error al buscar el usuario.')
              .subscribe();
          }
          this.usuarioEncontrado = null;
        }
      } catch (error) {
        console.error('Error al buscar el usuario:', error);
        this.usuarioEncontrado = null;
      }
    } else {
      this.handleCuitError();
    }
  }

  handleCuitError() {
    console.error('CUIT inválido o vacío');
    this.usuarioEncontrado = null;
  }

  async handleRemove() {
    if (!this.deleteForm.valid) {
      this.dialogService
        .showMessage(
          'Error',
          'Debe confirmar que desea eliminar el usuario marcando la casilla de confirmación.',
        )
        .subscribe();
      return;
    }
    if (this.usuarioEncontrado && this.usuarioCuit.valid) {
      try {
        const result = await this.usuarioService.removerUsuario(
          this.usuarioEncontrado,
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
        this.usuarioCuit.reset();
        this.usuarioEncontrado = null;
        this.deleteForm.reset();
      } catch (error) {
        this.dialogService
          .showMessage('Error', 'Error en la solicitud de eliminación')
          .subscribe();
      }
    }
  }
}
