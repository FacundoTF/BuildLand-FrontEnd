import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  DestroyRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { UsuarioServicio } from '../../shared/services/usuario-servicio';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SubmitSecret } from './submit-secret/submit-secret';
import { ConfirmNewPassword } from './confirm-new-password/confirm-new-password';

@Component({
  selector: 'app-restore-password',
  imports: [ReactiveFormsModule, SubmitSecret, ConfirmNewPassword],
  templateUrl: './restore-password.html',
  styleUrl: './restore-password.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestorePassword {
  private readonly fb = new FormBuilder();
  private readonly destroyRef = inject(DestroyRef);
  readonly usuarioServicio = inject(UsuarioServicio);

  emailForm: FormGroup;
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  showSubmitSecret = signal(false);
  showConfirmNewPassword = signal(false);
  userEmail = signal<string>('');

  constructor() {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmitEmail(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const { email } = this.emailForm.value;
    this.userEmail.set(email);
    this.usuarioServicio.establecerEmailRecuperando(email);

    this.usuarioServicio
      .restorePassword(email)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          alert(
            'Se ha enviado un código de verificación a su correo electrónico. El código es válido por 5 minutos.',
          );
          // this.showSubmitSecret.set(true);
          this.usuarioServicio.enviarCodigoRestauracion.set(true);
        },
        error: (error: Error) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(
            'Error al enviar el código. Verifique que el correo electrónico sea válido.',
          );
          console.error('Error:', error);
        },
      });
  }
}
