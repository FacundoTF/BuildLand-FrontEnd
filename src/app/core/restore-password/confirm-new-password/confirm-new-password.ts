import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  DestroyRef,
  input,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { UsuarioServicio } from '../../../shared/services/usuario-servicio';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { DialogService } from '../../../shared/services/dialog.service';

@Component({
  selector: 'app-confirm-new-password',
  imports: [ReactiveFormsModule],
  templateUrl: './confirm-new-password.html',
  styleUrl: './confirm-new-password.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmNewPassword {
  private readonly fb = new FormBuilder();
  private readonly destroyRef = inject(DestroyRef);
  private readonly usuarioServicio = inject(UsuarioServicio);
  private readonly router = inject(Router);
  private dialog = inject(DialogService);

  email = input.required<string>();

  passwordForm: FormGroup;
  isSubmitting = signal(false);

  constructor() {
    this.passwordForm = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            this.noSpecialCharactersValidator,
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  private noSpecialCharactersValidator(
    control: AbstractControl,
  ): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    // Solo permite letras (mayúsculas y minúsculas) y números
    const regex = /^[a-zA-Z0-9]+$/;
    const valid = regex.test(control.value);

    return valid ? null : { specialCharacters: true };
  }

  private passwordMatchValidator(
    control: AbstractControl,
  ): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmitPassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const { password } = this.passwordForm.value;

    this.usuarioServicio
      .changePassword(password)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.dialog
            .showMessage('Exito', 'Contraseña cambiada exitosamente.')
            .subscribe(() => {
              this.usuarioServicio.enviarCodigoRestauracion.set(false);
              this.usuarioServicio.confirmarNuevaContrasena.set(false);
              this.router.navigate(['/']);
            });
        },
        error: (error: Error) => {
          this.isSubmitting.set(false);
          this.dialog
            .showMessage(
              'Error',
              'Error al cambiar la contraseña. Por favor, intente nuevamente.',
            )
            .subscribe();
        },
      });
  }
}
