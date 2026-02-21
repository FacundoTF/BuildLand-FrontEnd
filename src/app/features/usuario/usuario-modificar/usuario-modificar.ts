import { Component, inject, signal } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TipoUsuario, Usuario } from '../../../core/entities/usuario/usuario';
import { UsuarioServicio } from '../../../shared/services/usuario-servicio';
import { DialogService } from '../../../shared/services/dialog.service';
import { MatButton } from '@angular/material/button';
import { Distribuidora } from '../../../core/entities/distribuidora/distribuidora';
import { Empleado } from '../../../core/entities/empleado/empleado';
import { PersonaFisica } from '../../../core/entities/personaFisica/persona-fisica';
import { EntidadRegistrada } from '../../../core/entities/usuario/entidad-registrada';

@Component({
  selector: 'app-usuario-modificar',
  imports: [ReactiveFormsModule, MatButton],
  templateUrl: './usuario-modificar.html',
  styleUrl: './usuario-modificar.scss',
})
export class UsuarioModificar {
  mostrarDatosUsuario = signal(false);
  cuitUsuario = signal('');

  usuarioService = inject(UsuarioServicio);
  dialogService = inject(DialogService);
  router = inject(Router);

  usuarioEncontrado: Usuario | null = null;
  cuitEncontrado: string | null = null;

  usuarioEmailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  async handleSubmitEmail() {
    if (this.usuarioEmailForm.valid) {
      const email = this.usuarioEmailForm.value.email;
      if (!email) {
        this.handleEmailError();
        return;
      }
      try {
        const result = await this.usuarioService.buscarUsuarioPorEmail(email);
        if (result.success && result.payload) {
          const entidad = result.payload as EntidadRegistrada;

          // Determinar el tipo de usuario y extraer datos
          if (entidad.usuario.tipoUsuario === TipoUsuario.DISTRIBUIDORA) {
            this.usuarioEncontrado = entidad.usuario;
            this.cuitEncontrado = entidad.cuit;
            this.cuitUsuario.set(<string>entidad.cuit);
          } else if (entidad.usuario.tipoUsuario === TipoUsuario.EMPLEADO) {
            this.usuarioEncontrado = entidad.usuario;
            this.cuitEncontrado = entidad.cuit;
            this.cuitUsuario.set(<string>entidad.cuit);
          } else if (
            entidad.usuario.tipoUsuario === TipoUsuario.PERSONA_FISICA
          ) {
            this.usuarioEncontrado = entidad.usuario;
            this.cuitEncontrado = entidad.cuit;
            this.cuitUsuario.set(<string>entidad.cuit);
          }

          this.mostrarDatosUsuario.set(true);
        } else {
          console.error(result.message);
          if (result.statusCode === 401) {
            this.usuarioService.cerrarSesion();
          }
          if (result.statusCode === 404) {
            this.dialogService
              .showMessage(
                'Error',
                'Usuario no encontrado con ese correo electrónico.',
              )
              .subscribe();
          } else {
            this.dialogService
              .showMessage('Error', 'Error al buscar el usuario.')
              .subscribe();
          }
          this.resetState();
        }
      } catch (error) {
        console.error('Error al buscar el usuario:', error);
        this.resetState();
      }
    } else {
      this.handleEmailError();
    }
  }

  handleEmailError() {
    this.dialogService
      .showMessage('Error', 'Correo electrónico inválido o vacío.')
      .subscribe();
    this.resetState();
  }

  resetState() {
    this.usuarioEncontrado = null;
    this.cuitEncontrado = null;
    this.cuitUsuario.set('');
    this.mostrarDatosUsuario.set(false);
  }

  handleModificar() {
    if (this.cuitEncontrado && this.usuarioEncontrado) {
      this.router.navigate([
        '/base-page/usuario/modificando',
        this.usuarioEncontrado.email,
      ]);
    }
  }
}
