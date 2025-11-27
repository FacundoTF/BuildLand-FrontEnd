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

@Component({
  selector: 'app-inicio-sesion',
  imports: [ReactiveFormsModule],
  templateUrl: './inicio-sesion.html',
  styleUrl: './inicio-sesion.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InicioSesion {
  private readonly fb = new FormBuilder();
  private readonly destroyRef = inject(DestroyRef);
  servicioUsuario = inject(UsuarioServicio);

  loginForm: FormGroup;
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.loginForm.value;

    console.log('Login attempt:', { email, password });

    this.servicioUsuario
      .iniciarSesion(email, password)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: Object) => {
          this.isSubmitting.set(false);
          console.log('Exito: ', data);
        },
        error: (error: Error) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(
            'Inicio de sesión fallido. Revise sus credenciales.',
          );
          console.error('Hubo un error:', error);
        },
      });
  }

  onForgotPassword(): void {
    // Aquí implementarás la lógica para recuperación de contraseña
    console.log('Forgot password clicked');
  }
}
