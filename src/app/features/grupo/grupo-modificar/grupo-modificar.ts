import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  input,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { GrupoServicio } from '../../../shared/services/grupo/grupo-servicio';
import { DialogService } from '../../../shared/services/dialog.service';
import { ReturnSearchResponse } from '../../../core/response-type/return-search-response';
import { Grupo } from '../../../core/entities/grupo/grupo';
import { Permiso } from '../../../core/entities/permiso/permiso';
import { ConjuntoGrupoPermiso } from '../../../core/entities/conjuntoGrupoPermiso/conjunto-grupo-permiso';
import {
  SelectionDialog,
  SelectableItem,
} from '../../../shared/components/selection-dialog/selection-dialog';

@Component({
  selector: 'app-grupo-modificar',
  imports: [MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './grupo-modificar.html',
  styleUrl: './grupo-modificar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GrupoModificar implements OnInit {
  private grupoServicio = inject(GrupoServicio);
  private dialogService = inject(DialogService);
  private matDialog = inject(MatDialog);
  private router = inject(Router);

  // Input data from resolvers
  gruposData = input.required<ReturnSearchResponse>();
  permisosData = input.required<ReturnSearchResponse>();

  // Available items from API
  gruposDisponibles: Grupo[] = [];
  permisosDisponibles: Permiso[] = [];

  // Signal for groups list
  grupos = signal<Grupo[]>([]);

  // Selected group for modification
  grupoSeleccionado = signal<Grupo | null>(null);

  // Changes to apply
  permisosParaAgregar = signal<Permiso[]>([]);
  permisosParaRemover = signal<Permiso[]>([]);
  gruposParaAgregar = signal<Grupo[]>([]);
  gruposParaRemover = signal<Grupo[]>([]);

  // Computed for visibility
  hayGrupoSeleccionado = computed(() => this.grupoSeleccionado() !== null);
  hayPermisosParaAgregar = computed(
    () => this.permisosParaAgregar().length > 0,
  );
  hayPermisosParaRemover = computed(
    () => this.permisosParaRemover().length > 0,
  );
  hayGruposParaAgregar = computed(() => this.gruposParaAgregar().length > 0);
  hayGruposParaRemover = computed(() => this.gruposParaRemover().length > 0);

  // Table columns
  displayedColumns: string[] = ['nombre', 'descripcion', 'acciones'];
  displayedColumnsItems: string[] = ['nombre', 'descripcion', 'acciones'];

  ngOnInit(): void {
    this.grupos.set((this.gruposData().payload as Grupo[]) || []);
    this.gruposDisponibles = (this.gruposData().payload as Grupo[]) || [];
    this.permisosDisponibles = (this.permisosData().payload as Permiso[]) || [];
  }

  // Helper methods to extract permisos and grupos from elementos
  private getPermisosDelGrupo(grupo: Grupo): Permiso[] {
    return grupo.elementos.filter(
      (e): e is Permiso => e instanceof Permiso || !('elementos' in e),
    ) as Permiso[];
  }

  private getGruposDelGrupo(grupo: Grupo): Grupo[] {
    return grupo.elementos.filter(
      (e): e is Grupo => e instanceof Grupo || 'elementos' in e,
    ) as Grupo[];
  }

  seleccionarGrupo(grupo: Grupo): void {
    this.grupoSeleccionado.set(grupo);
    // Reset changes when selecting a new group
    this.permisosParaAgregar.set([]);
    this.permisosParaRemover.set([]);
    this.gruposParaAgregar.set([]);
    this.gruposParaRemover.set([]);
  }

  cancelarSeleccion(): void {
    this.grupoSeleccionado.set(null);
    this.permisosParaAgregar.set([]);
    this.permisosParaRemover.set([]);
    this.gruposParaAgregar.set([]);
    this.gruposParaRemover.set([]);
  }

  abrirDialogoAgregarPermisos(): void {
    const grupo = this.grupoSeleccionado();
    if (!grupo) return;

    // Get IDs of permissions the group already has
    const permisosDelGrupo = this.getPermisosDelGrupo(grupo).map((p) => p.id);
    // Get IDs of permissions already selected to add
    const permisosYaParaAgregar = this.permisosParaAgregar().map((p) => p.id);

    // Filter: show only permissions NOT in the group
    const items: SelectableItem[] = this.permisosDisponibles
      .filter((p) => !permisosDelGrupo.includes(p.id))
      .map((permiso) => ({
        id: permiso.id,
        nombre: permiso.nombre,
        descripcion: permiso.descripcion,
        selected: permisosYaParaAgregar.includes(permiso.id),
      }));

    const dialogRef = this.matDialog.open(SelectionDialog, {
      width: '450px',
      disableClose: false,
    });

    dialogRef.componentInstance.title.set('Agregar Permisos');
    dialogRef.componentInstance.items.set(items);

    dialogRef.afterClosed().subscribe((result: SelectableItem[] | null) => {
      if (result) {
        const nuevosPermisos = result.map(
          (item) => this.permisosDisponibles.find((p) => p.id === item.id)!,
        );
        this.permisosParaAgregar.set(nuevosPermisos);
      }
    });
  }

  abrirDialogoRemoverPermisos(): void {
    const grupo = this.grupoSeleccionado();
    if (!grupo) return;

    // Get permissions the group has
    const permisosDelGrupo = this.getPermisosDelGrupo(grupo);
    // Get IDs of permissions already selected to remove
    const permisosYaParaRemover = this.permisosParaRemover().map((p) => p.id);

    // Filter: show only permissions the group HAS
    const items: SelectableItem[] = permisosDelGrupo.map((permiso) => ({
      id: permiso.id,
      nombre: permiso.nombre,
      descripcion: permiso.descripcion,
      selected: permisosYaParaRemover.includes(permiso.id),
    }));

    const dialogRef = this.matDialog.open(SelectionDialog, {
      width: '450px',
      disableClose: false,
    });

    dialogRef.componentInstance.title.set('Remover Permisos');
    dialogRef.componentInstance.items.set(items);

    dialogRef.afterClosed().subscribe((result: SelectableItem[] | null) => {
      if (result) {
        const permisosARemover = result.map(
          (item) => permisosDelGrupo.find((p) => p.id === item.id)!,
        );
        this.permisosParaRemover.set(permisosARemover);
      }
    });
  }

  abrirDialogoAgregarGrupos(): void {
    const grupo = this.grupoSeleccionado();
    if (!grupo) return;

    // Get IDs of groups the selected group already has
    const gruposDelGrupo = this.getGruposDelGrupo(grupo).map((g) => g.id);
    // Get IDs of groups already selected to add
    const gruposYaParaAgregar = this.gruposParaAgregar().map((g) => g.id);

    // Filter: show only groups NOT in the group and not the group itself
    const items: SelectableItem[] = this.gruposDisponibles
      .filter((g) => !gruposDelGrupo.includes(g.id) && g.id !== grupo.id)
      .map((g) => ({
        id: g.id,
        nombre: g.nombre,
        descripcion: g.descripcion,
        selected: gruposYaParaAgregar.includes(g.id),
      }));

    const dialogRef = this.matDialog.open(SelectionDialog, {
      width: '450px',
      disableClose: false,
    });

    dialogRef.componentInstance.title.set('Agregar Grupos');
    dialogRef.componentInstance.items.set(items);

    dialogRef.afterClosed().subscribe((result: SelectableItem[] | null) => {
      if (result) {
        const nuevosGrupos = result.map(
          (item) => this.gruposDisponibles.find((g) => g.id === item.id)!,
        );
        this.gruposParaAgregar.set(nuevosGrupos);
      }
    });
  }

  abrirDialogoRemoverGrupos(): void {
    const grupo = this.grupoSeleccionado();
    if (!grupo) return;

    // Get groups the selected group has
    const gruposDelGrupo = this.getGruposDelGrupo(grupo);
    // Get IDs of groups already selected to remove
    const gruposYaParaRemover = this.gruposParaRemover().map((g) => g.id);

    // Filter: show only groups the selected group HAS
    const items: SelectableItem[] = gruposDelGrupo.map((g) => ({
      id: g.id,
      nombre: g.nombre,
      descripcion: g.descripcion,
      selected: gruposYaParaRemover.includes(g.id),
    }));

    const dialogRef = this.matDialog.open(SelectionDialog, {
      width: '450px',
      disableClose: false,
    });

    dialogRef.componentInstance.title.set('Remover Grupos');
    dialogRef.componentInstance.items.set(items);

    dialogRef.afterClosed().subscribe((result: SelectableItem[] | null) => {
      if (result) {
        const gruposARemover = result.map(
          (item) => gruposDelGrupo.find((g) => g.id === item.id)!,
        );
        this.gruposParaRemover.set(gruposARemover);
      }
    });
  }

  quitarPermisoParaAgregar(index: number): void {
    this.permisosParaAgregar.update((permisos) =>
      permisos.filter((_, i) => i !== index),
    );
  }

  quitarPermisoParaRemover(index: number): void {
    this.permisosParaRemover.update((permisos) =>
      permisos.filter((_, i) => i !== index),
    );
  }

  quitarGrupoParaAgregar(index: number): void {
    this.gruposParaAgregar.update((grupos) =>
      grupos.filter((_, i) => i !== index),
    );
  }

  quitarGrupoParaRemover(index: number): void {
    this.gruposParaRemover.update((grupos) =>
      grupos.filter((_, i) => i !== index),
    );
  }

  async confirmar(): Promise<void> {
    const grupo = this.grupoSeleccionado();
    if (!grupo) return;

    // Check if there are any changes
    if (
      this.permisosParaAgregar().length === 0 &&
      this.permisosParaRemover().length === 0 &&
      this.gruposParaAgregar().length === 0 &&
      this.gruposParaRemover().length === 0
    ) {
      this.dialogService
        .showMessage('Aviso', 'No hay cambios para aplicar.')
        .subscribe();
      return;
    }

    // Calculate final state
    const permisosIdsParaRemover = this.permisosParaRemover().map((p) => p.id);
    const gruposIdsParaRemover = this.gruposParaRemover().map((g) => g.id);

    // Get current permisos and grupos from elementos
    const permisosActuales = this.getPermisosDelGrupo(grupo);
    const gruposActuales = this.getGruposDelGrupo(grupo);

    const permisosFinal = [
      ...permisosActuales.filter((p) => !permisosIdsParaRemover.includes(p.id)),
      ...this.permisosParaAgregar(),
    ];

    const gruposFinal = [
      ...gruposActuales.filter((g) => !gruposIdsParaRemover.includes(g.id)),
      ...this.gruposParaAgregar(),
    ];

    // Combine into elementos
    const elementosFinal: ConjuntoGrupoPermiso[] = [
      ...permisosFinal,
      ...gruposFinal,
    ];

    const grupoModificado = new Grupo(
      grupo.id,
      grupo.nombre,
      grupo.descripcion,
      elementosFinal,
    );

    try {
      const response = await this.grupoServicio.modificarGrupo(grupoModificado);
      if (response.success) {
        this.dialogService
          .showMessage('Éxito', 'El grupo ha sido modificado correctamente.')
          .subscribe(() => {
            this.router.navigate(['/base-page/home']);
          });
      } else if (response.statusCode === 401) {
        this.dialogService
          .showMessage('Error', 'No tiene permiso para modificar este grupo.')
          .subscribe();
      } else {
        this.dialogService.showMessage('Error', response.message).subscribe();
      }
    } catch (error) {
      console.error('Error al modificar grupo:', error);
      this.dialogService
        .showMessage('Error', 'Ocurrió un error al modificar el grupo.')
        .subscribe();
    }
  }
}
