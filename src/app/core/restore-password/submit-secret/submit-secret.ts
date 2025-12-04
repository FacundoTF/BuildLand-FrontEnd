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
} from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioServicio } from '../../../shared/services/usuario-servicio';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-submit-secret',
  imports: [ReactiveFormsModule],
  templateUrl: './submit-secret.html',
  styleUrl: './submit-secret.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmitSecret {
  private readonly fb = new FormBuilder();
  private readonly destroyRef = inject(DestroyRef);
  private readonly usuarioServicio = inject(UsuarioServicio);
  private readonly router = inject(Router);

  email = input.required<string>();

  codeForm: FormGroup;
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  constructor() {
    this.codeForm = this.fb.group({
      code: [
        '',
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],
    });
  }

  onSubmitCode(): void {
    if (this.codeForm.invalid) {
      this.codeForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const { code } = this.codeForm.value;

    this.usuarioServicio
      .verifyPasswordCode(code)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          alert(
            'Código verificado exitosamente. Será redirigido a la página de inicio.',
          );
          this.usuarioServicio.enviarCodigoRestauracion.set(false);
          this.usuarioServicio.confirmarNuevaContrasena.set(true);
        },
        error: (error: Error) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(
            'Código inválido o expirado. Por favor, intente nuevamente.',
          );
          console.error('Error:', error);
        },
      });
  }
}
