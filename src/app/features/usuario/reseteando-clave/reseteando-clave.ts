import {
  Component,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioServicio } from '../../../shared/services/usuario-servicio';
import { DialogService } from '../../../shared/services/dialog.service';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-reseteando-clave',
  imports: [ReactiveFormsModule, MatButton],
  templateUrl: './reseteando-clave.html',
  styleUrl: './reseteando-clave.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReseteandoClave implements OnInit {
  usuarioService = inject(UsuarioServicio);
  dialogService = inject(DialogService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  email = signal('');
  cargando = signal(false);

  claveForm = new FormGroup(
    {
      contrasena: new FormControl('', [
        Validators.required,
        Validators.maxLength(255),
      ]),
      confirmarContrasena: new FormControl('', [
        Validators.required,
        Validators.maxLength(255),
      ]),
    },
    { validators: this.passwordsMatchValidator },
  );

  ngOnInit() {
    const emailParam = this.route.snapshot.paramMap.get('email');
    if (emailParam) {
      this.email.set(emailParam);
    } else {
      this.dialogService
        .showMessage('Error', 'No se proporcionó un correo electrónico.')
        .subscribe(() => {
          this.router.navigate(['/base-page/usuario/resetear-clave']);
        });
    }
  }

  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const contrasena = control.get('contrasena')?.value;
    const confirmarContrasena = control.get('confirmarContrasena')?.value;

    if (
      contrasena &&
      confirmarContrasena &&
      contrasena !== confirmarContrasena
    ) {
      return { passwordsMismatch: true };
    }
    return null;
  }

  async handleConfirmarCambios() {
    if (this.claveForm.invalid) {
      if (this.claveForm.errors?.['passwordsMismatch']) {
        this.dialogService
          .showMessage('Error', 'Las contraseñas no coinciden.')
          .subscribe();
        return;
      }
      this.dialogService
        .showMessage(
          'Error',
          'Por favor, complete todos los campos correctamente.',
        )
        .subscribe();
      return;
    }

    const contrasena = this.claveForm.value.contrasena;
    if (!contrasena) {
      this.dialogService
        .showMessage('Error', 'La contraseña no puede estar vacía.')
        .subscribe();
      return;
    }

    this.cargando.set(true);

    try {
      const result = await this.usuarioService.resetearClaveUsuario(
        this.email(),
        contrasena,
      );

      if (result.success) {
        this.dialogService
          .showMessage(
            'Éxito',
            'La contraseña ha sido reseteada correctamente.',
          )
          .subscribe(() => {
            this.router.navigate(['/base-page/home']);
          });
      } else {
        if (result.statusCode === 401) {
          this.usuarioService.cerrarSesion();
        }
        this.dialogService.showMessage('Error', result.message).subscribe();
      }
    } catch (error) {
      console.error('Error al resetear la clave:', error);
      this.dialogService
        .showMessage('Error', 'Ocurrió un error al resetear la contraseña.')
        .subscribe();
    } finally {
      this.cargando.set(false);
    }
  }
}
