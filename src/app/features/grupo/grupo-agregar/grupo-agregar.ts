import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  input,
  OnInit,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import {
  GrupoServicio,
  GrupoRequest,
} from '../../../shared/services/grupo/grupo-servicio';
import { DialogService } from '../../../shared/services/dialog.service';
import { ReturnSearchResponse } from '../../../core/response-type/return-search-response';
import { Grupo } from '../../../core/entities/grupo/grupo';
import { Permiso } from '../../../core/entities/permiso/permiso';
import {
  SelectionDialog,
  SelectableItem,
} from '../../../shared/components/selection-dialog/selection-dialog';

@Component({
  selector: 'app-grupo-agregar',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
  ],
  templateUrl: './grupo-agregar.html',
  styleUrl: './grupo-agregar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GrupoAgregar implements OnInit {
  private fb = inject(FormBuilder);
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

  // Selected items signals
  permisosSeleccionados = signal<Permiso[]>([]);
  gruposSeleccionados = signal<Grupo[]>([]);

  // Computed for table visibility
  hayPermisosSeleccionados = computed(
    () => this.permisosSeleccionados().length > 0,
  );
  hayGruposSeleccionados = computed(
    () => this.gruposSeleccionados().length > 0,
  );

  // Table columns
  displayedColumnsPermisos: string[] = ['nombre', 'descripcion', 'acciones'];
  displayedColumnsGrupos: string[] = ['nombre', 'descripcion', 'acciones'];

  // Form
  form = this.fb.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.gruposDisponibles = (this.gruposData().payload as Grupo[]) || [];
    this.permisosDisponibles = (this.permisosData().payload as Permiso[]) || [];
  }

  abrirDialogoPermisos(): void {
    const permisosYaSeleccionados = this.permisosSeleccionados().map(
      (p) => p.id,
    );

    const items: SelectableItem[] = this.permisosDisponibles.map((permiso) => ({
      id: permiso.id,
      nombre: permiso.nombre,
      descripcion: permiso.descripcion,
      selected: permisosYaSeleccionados.includes(permiso.id),
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
        this.permisosSeleccionados.set(nuevosPermisos);
      }
    });
  }

  abrirDialogoGrupos(): void {
    const gruposYaSeleccionados = this.gruposSeleccionados().map((g) => g.id);

    const items: SelectableItem[] = this.gruposDisponibles.map((grupo) => ({
      id: grupo.id,
      nombre: grupo.nombre,
      descripcion: grupo.descripcion,
      selected: gruposYaSeleccionados.includes(grupo.id),
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
        this.gruposSeleccionados.set(nuevosGrupos);
      }
    });
  }

  removerPermiso(index: number): void {
    this.permisosSeleccionados.update((permisos) =>
      permisos.filter((_, i) => i !== index),
    );
  }

  removerGrupo(index: number): void {
    this.gruposSeleccionados.update((grupos) =>
      grupos.filter((_, i) => i !== index),
    );
  }

  async confirmar(): Promise<void> {
    if (this.form.invalid) {
      this.dialogService
        .showMessage('Error', 'Complete todos los campos requeridos.')
        .subscribe();
      return;
    }

    if (
      this.permisosSeleccionados().length === 0 &&
      this.gruposSeleccionados().length === 0
    ) {
      this.dialogService
        .showMessage(
          'Error',
          'Debe seleccionar al menos un permiso o un grupo.',
        )
        .subscribe();
      return;
    }

    const request: Grupo = {
      id: 0, // El ID se asignará en el backend
      nombre: this.form.value.nombre!,
      descripcion: this.form.value.descripcion!,
      permisos: this.permisosSeleccionados().map((p) => p),
      grupos: this.gruposSeleccionados().map((g) => g),
    };

    try {
      const response = await this.grupoServicio.crearGrupo(request);
      if (response != null) {
        this.dialogService
          .showMessage('Éxito', 'El grupo ha sido creado correctamente.')
          .subscribe(() => {
            this.router.navigate(['/base-page']);
          });
      } else {
        this.dialogService
          .showMessage('Error', 'Error al crear el grupo.')
          .subscribe();
      }
    } catch (error) {
      console.error('Error al crear grupo:', error);
      this.dialogService
        .showMessage('Error', 'Ocurrió un error al crear el grupo.')
        .subscribe();
    }
  }
}
