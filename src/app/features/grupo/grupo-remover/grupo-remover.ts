import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  input,
  OnInit,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GrupoServicio } from '../../../shared/services/grupo/grupo-servicio';
import { DialogService } from '../../../shared/services/dialog.service';
import { ReturnSearchResponse } from '../../../core/response-type/return-search-response';
import { Grupo } from '../../../core/entities/grupo/grupo';

@Component({
  selector: 'app-grupo-remover',
  imports: [MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './grupo-remover.html',
  styleUrl: './grupo-remover.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GrupoRemover implements OnInit {
  private grupoServicio = inject(GrupoServicio);
  private dialogService = inject(DialogService);

  gruposData = input.required<ReturnSearchResponse>();

  grupos = signal<Grupo[]>([]);
  displayedColumns: string[] = ['nombre', 'descripcion', 'acciones'];

  ngOnInit(): void {
    this.grupos.set((this.gruposData().payload as Grupo[]) || []);
  }

  confirmarEliminar(grupo: Grupo): void {
    this.dialogService
      .showConfirm(
        'Confirmar eliminación',
        `¿Está seguro que desea eliminar el grupo "${grupo.nombre}"? Esta acción no se puede deshacer.`,
        'Eliminar',
        'Cancelar',
      )
      .subscribe((confirmed) => {
        if (confirmed) {
          this.eliminarGrupo(grupo);
        }
      });
  }

  async eliminarGrupo(grupo: Grupo): Promise<void> {
    try {
      const result = await this.grupoServicio.removerGrupo(grupo.id);
      if (result.success) {
        this.dialogService.showMessage('Éxito', result.message).subscribe();
        this.grupos.update((grupos) => grupos.filter((g) => g.id !== grupo.id));
      } else if (result.statusCode === 401) {
        this.dialogService
          .showMessage('Error', 'No tiene permiso para eliminar este grupo.')
          .subscribe();
      } else {
        this.dialogService.showMessage('Error', result.message).subscribe();
      }
    } catch (error) {
      this.dialogService
        .showMessage('Error', 'Error al eliminar el grupo.')
        .subscribe();
    }
  }
}
