import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  DestroyRef,
  OnInit,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UsuarioServicio } from '../../shared/services/usuario-servicio';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-sesion',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './inicio-sesion.html',
  styleUrl: './inicio-sesion.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InicioSesion implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly usuarioServicio = inject(UsuarioServicio);

  ngOnInit() {
    this.usuarioServicio.enviarCodigoRestauracion.set(false);
    this.usuarioServicio.confirmarNuevaContrasena.set(false);
  }

  loginForm = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
      nonNullable: true,
    }),
  });

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.loginForm.value;

    this.usuarioServicio
      .iniciarSesion(email!, password!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: object) => {
          this.isSubmitting.set(false);
          const dataLogin = Object.values(data);
          const usuario = dataLogin[0];
          const grupos = dataLogin[1];
          const permisos = dataLogin[2];
          sessionStorage.setItem('usuario', JSON.stringify(usuario));
          sessionStorage.setItem('permisos', JSON.stringify(permisos));
          sessionStorage.setItem('grupos', JSON.stringify(grupos));
          this.router.navigateByUrl('/base-page');
        },
        error: () => {
          this.isSubmitting.set(false);
          this.errorMessage.set(
            'Inicio de sesión fallido. Revise sus credenciales.',
          );
        },
      });
  }

  onForgotPassword(): void {
    this.router.navigate(['/restore-password']);
  }
}
