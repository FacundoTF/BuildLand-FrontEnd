import {
  Component,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { CotizacionServicio } from '../../services/cotizacion/cotizacion-servicio';
import { MensajeRechazoCotizacion } from '../../../core/entities/cotizacion/mensaje-rechazo-cotizacion';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rejection-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    FormsModule,
  ],
  templateUrl: './rejection-dialog.html',
  styleUrl: './rejection-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RejectionDialog implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<RejectionDialog>);
  private readonly cotizacionService = inject(CotizacionServicio);

  messages = signal<MensajeRechazoCotizacion[]>([]);
  loading = signal<boolean>(true);
  selectedMessageId = signal<number | null>(null);

  ngOnInit(): void {
    this.cotizacionService.relevarMensajesRechazo().subscribe({
      next: (response) => {
        if (response.success) {
          this.messages.set(response.payload as MensajeRechazoCotizacion[]);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  onConfirm(): void {
    const selectedId = this.selectedMessageId();
    if (selectedId) {
      const selectedMessage = this.messages().find(
        (m) => m.idMensaje === selectedId,
      );
      this.dialogRef.close(selectedMessage);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
