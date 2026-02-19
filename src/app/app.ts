import { Component, signal, inject, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InactivityService } from './shared/services/inactivity.service';
import { UsuarioServicio } from './shared/services/usuario-servicio';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('AngularFrontEnd');

  private readonly inactivityService = inject(InactivityService);
  private readonly usuarioServicio = inject(UsuarioServicio);

  constructor() {
    // Monitorear cambios en el estado de autenticación
    effect(() => {
      if (this.usuarioServicio.estaAutenticado()) {
        this.inactivityService.startMonitoring();
      } else {
        this.inactivityService.stopMonitoring();
      }
    });
  }
}
