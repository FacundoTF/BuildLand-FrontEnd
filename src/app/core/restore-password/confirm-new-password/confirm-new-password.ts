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

  email = input.required<string>();

  passwordForm: FormGroup;
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

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
    this.errorMessage.set(null);

    const { password } = this.passwordForm.value;

    this.usuarioServicio
      .changePassword(password)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          alert('Contraseña cambiada exitosamente.');
          this.router.navigate(['/']);
        },
        error: (error: Error) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(
            'Error al cambiar la contraseña. Por favor, intente nuevamente.',
          );
          console.error('Error:', error);
        },
      });
  }
}
