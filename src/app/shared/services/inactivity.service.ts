import { Injectable, inject, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, merge, timer, Subject } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { UsuarioServicio } from './usuario-servicio';
import { DialogService } from './dialog.service';

@Injectable({
  providedIn: 'root',
})
export class InactivityService {
  private readonly usuarioServicio = inject(UsuarioServicio);
  private readonly dialogService = inject(DialogService);
  private readonly destroyRef = inject(DestroyRef);

  private activityEvents$ = new Subject<void>();
  private isMonitoring = signal(false);
  private warningShown = signal(false);
  private logoutCountdownId: ReturnType<typeof setTimeout> | null = null;

  private readonly INACTIVITY_TIMEOUT_MS =
    environment.inactivity.timeoutMinutes * 60 * 1000;
  private readonly WARNING_TIME_MS =
    environment.inactivity.warningMinutes * 60 * 1000;

  startMonitoring(): void {
    if (this.isMonitoring()) {
      return;
    }

    const timeUntilWarning = this.INACTIVITY_TIMEOUT_MS - this.WARNING_TIME_MS;

    // Validar configuración
    if (timeUntilWarning <= 0) {
      console.warn(
        'La configuración de inactividad es inválida: warningMinutes debe ser menor que timeoutMinutes',
      );
      return;
    }

    this.isMonitoring.set(true);
    this.warningShown.set(false);

    // Eventos de actividad del usuario
    const userActivityEvents = [
      fromEvent(document, 'mousemove'),
      fromEvent(document, 'keydown'),
      fromEvent(document, 'click'),
      fromEvent(document, 'scroll'),
      fromEvent(document, 'touchstart'),
    ];

    // Fusionar todos los eventos de actividad y crear un observable que reinicia el temporizador
    merge(...userActivityEvents, this.activityEvents$)
      .pipe(
        debounceTime(1000), // Evitar demasiadas actualizaciones
        tap(() => {
          // Si el modal está abierto, solo reiniciar el countdown de logout
          if (this.warningShown()) {
            this.restartLogoutCountdown();
          }
        }),
        switchMap(() =>
          timer(timeUntilWarning).pipe(
            tap(() => {
              // Solo mostrar advertencia si seguimos monitoreando y no hay modal abierto
              if (this.isMonitoring() && !this.warningShown()) {
                this.showWarning();
              }
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    // Iniciar el temporizador inicial
    this.activityEvents$.next();
  }

  stopMonitoring(): void {
    this.isMonitoring.set(false);
    this.warningShown.set(false);
    this.clearLogoutCountdown();
  }

  private showWarning(): void {
    if (this.warningShown() || !this.isMonitoring()) {
      return;
    }

    this.warningShown.set(true);
    this.restartLogoutCountdown();

    this.dialogService
      .showConfirm(
        'Sesión inactiva',
        '¿Deseas continuar trabajando?',
        'Sí, continuar',
        'No, cerrar sesión',
      )
      .subscribe((continuar) => {
        this.clearLogoutCountdown();

        if (continuar === true) {
          // El usuario quiere continuar, reiniciar el contador
          this.warningShown.set(false);
          this.activityEvents$.next();
        } else if (continuar === false) {
          // El usuario eligió cerrar sesión explícitamente
          this.logout();
        } else {
          // El usuario cerró el modal sin elegir, considerarlo como continuar
          this.warningShown.set(false);
          this.activityEvents$.next();
        }
      });
  }

  private logout(): void {
    this.stopMonitoring();
    // Cerrar cualquier modal abierto antes de hacer logout
    this.dialogService.closeAll();
    this.usuarioServicio.cerrarSesion();
  }

  private restartLogoutCountdown(): void {
    this.clearLogoutCountdown();

    this.logoutCountdownId = setTimeout(() => {
      if (this.isMonitoring() && this.warningShown()) {
        this.logout();
      }
    }, this.WARNING_TIME_MS);
  }

  private clearLogoutCountdown(): void {
    if (this.logoutCountdownId) {
      clearTimeout(this.logoutCountdownId);
      this.logoutCountdownId = null;
    }
  }
}
