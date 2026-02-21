import {
  Component,
  inject,
  input,
  OnInit,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';

import { UsuarioServicio } from '../../../shared/services/usuario-servicio';
import { DialogService } from '../../../shared/services/dialog.service';
import { TipoUsuario, Usuario } from '../../../core/entities/usuario/usuario';
import { Distribuidora } from '../../../core/entities/distribuidora/distribuidora';
import { Empleado } from '../../../core/entities/empleado/empleado';
import { PersonaFisica } from '../../../core/entities/personaFisica/persona-fisica';
import { Categoria } from '../../../core/entities/categoria/categoria';
import { ReturnSearchResponse } from '../../../core/response-type/return-search-response';
import { EntidadRegistrada } from '../../../core/entities/usuario/entidad-registrada';
import { Grupo } from '../../../core/entities/grupo/grupo';
import { Permiso } from '../../../core/entities/permiso/permiso';
import { ConjuntoGrupoPermiso } from '../../../core/entities/conjuntoGrupoPermiso/conjunto-grupo-permiso';
import {
  SelectionDialog,
  SelectableItem,
} from '../../../shared/components/selection-dialog/selection-dialog';

@Component({
  selector: 'app-modificando-usuario',
  imports: [
    ReactiveFormsModule,
    MatCheckboxModule,
    MatButton,
    MatTableModule,
    MatIconModule,
    MatRadioModule,
  ],
  templateUrl: './modificando-usuario.html',
  styleUrl: './modificando-usuario.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModificandoUsuario implements OnInit {
  usuarioData = input.required<ReturnSearchResponse>();
  categoriasData = input.required<ReturnSearchResponse>();
  gruposData = input.required<ReturnSearchResponse>();
  permisosData = input.required<ReturnSearchResponse>();

  usuarioService = inject(UsuarioServicio);
  dialogService = inject(DialogService);
  router = inject(Router);
  private matDialog = inject(MatDialog);

  esDistribuidora = signal(false);
  esEmpleado = signal(false);
  esPersonaFisica = signal(false);

  categorias: Categoria[] = [];
  categoriasSeleccionadas: string[] = [];

  entidadActual: EntidadRegistrada | null = null;

  // Available items from API
  gruposDisponibles: Grupo[] = [];
  permisosDisponibles: Permiso[] = [];

  // Changes to apply for Empleado
  permisosParaAgregar = signal<Permiso[]>([]);
  permisosParaRemover = signal<Permiso[]>([]);
  gruposParaAgregar = signal<Grupo[]>([]);
  gruposParaRemover = signal<Grupo[]>([]);

  // Computed for visibility
  hayPermisosParaAgregar = computed(
    () => this.permisosParaAgregar().length > 0,
  );
  hayPermisosParaRemover = computed(
    () => this.permisosParaRemover().length > 0,
  );
  hayGruposParaAgregar = computed(() => this.gruposParaAgregar().length > 0);
  hayGruposParaRemover = computed(() => this.gruposParaRemover().length > 0);

  // Table columns for items to add/remove
  displayedColumnsItems: string[] = ['nombre', 'descripcion', 'acciones'];

  usuarioForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    correoElectronico: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    numeroTelefono: new FormControl('', [Validators.required]),
    codigoPostal: new FormControl('', [Validators.required]),
    ciudad: new FormControl('', [Validators.required]),
    direccion: new FormControl(''),
    descripcion: new FormControl(''),
    estado: new FormControl<boolean>(true, [Validators.required]),
  });

  ngOnInit() {
    this.cargarCategorias();
    this.cargarGruposYPermisos();
    this.cargarDatosUsuario();
  }

  cargarCategorias() {
    const categoriasResponse = this.categoriasData();
    if (categoriasResponse.success && categoriasResponse.payload) {
      this.categorias = categoriasResponse.payload as Categoria[];
    }
  }

  cargarGruposYPermisos() {
    this.gruposDisponibles = (this.gruposData().payload as Grupo[]) || [];
    this.permisosDisponibles = (this.permisosData().payload as Permiso[]) || [];
  }

  cargarDatosUsuario() {
    const usuarioResponse = this.usuarioData();
    if (usuarioResponse.success && usuarioResponse.payload) {
      const entidad = usuarioResponse.payload as EntidadRegistrada;
      this.entidadActual = entidad;

      if (entidad.usuario.tipoUsuario === TipoUsuario.DISTRIBUIDORA) {
        this.esDistribuidora.set(true);
        this.cargarDatosDistribuidora(entidad as Distribuidora);
      } else if (entidad.usuario.tipoUsuario === TipoUsuario.EMPLEADO) {
        this.esEmpleado.set(true);
        this.cargarDatosEmpleado(entidad as Empleado);
      } else if (entidad.usuario.tipoUsuario === TipoUsuario.PERSONA_FISICA) {
        this.esPersonaFisica.set(true);
        this.cargarDatosPersonaFisica(entidad as PersonaFisica);
      }
    }
  }

  cargarDatosDistribuidora(distribuidora: Distribuidora) {
    this.usuarioForm.patchValue({
      nombre: distribuidora.nombre,
      correoElectronico: distribuidora.usuario?.email || '',
      numeroTelefono: distribuidora.numeroTelefono,
      codigoPostal: distribuidora.codigoPostal,
      ciudad: distribuidora.ciudad,
      direccion: distribuidora.direccion,
      descripcion: distribuidora.descripcion,
      estado: distribuidora.usuario?.estado ?? true,
    });

    // Agregar validadores para campos de distribuidora
    this.usuarioForm.get('direccion')?.setValidators([Validators.required]);
    this.usuarioForm.get('direccion')?.updateValueAndValidity();

    // Cargar categorías seleccionadas
    if (distribuidora.categorias && Array.isArray(distribuidora.categorias)) {
      this.categoriasSeleccionadas = distribuidora.categorias.map(
        (cat) => cat.nombre,
      );
    }
  }

  cargarDatosEmpleado(empleado: Empleado) {
    this.usuarioForm.patchValue({
      nombre: empleado.nombre,
      correoElectronico: empleado.usuario?.email || '',
      numeroTelefono: empleado.numeroTelefono,
      codigoPostal: empleado.codigoPostal,
      ciudad: empleado.ciudad,
      direccion: empleado.direccion,
      estado: empleado.usuario?.estado ?? true,
    });

    // Agregar validadores para campos de empleado
    this.usuarioForm.get('direccion')?.setValidators([Validators.required]);
    this.usuarioForm.get('direccion')?.updateValueAndValidity();
  }

  cargarDatosPersonaFisica(personaFisica: PersonaFisica) {
    this.usuarioForm.patchValue({
      nombre: personaFisica.nombre,
      correoElectronico: personaFisica.usuario?.email || '',
      numeroTelefono: personaFisica.numeroTelefono,
      codigoPostal: personaFisica.codigoPostal,
      ciudad: personaFisica.ciudad,
      estado: personaFisica.usuario?.estado ?? true,
    });
  }

  toggleCategoria(nombreCategoria: string) {
    const index = this.categoriasSeleccionadas.indexOf(nombreCategoria);
    if (index > -1) {
      this.categoriasSeleccionadas.splice(index, 1);
    } else {
      this.categoriasSeleccionadas.push(nombreCategoria);
    }
  }

  isCategoriaSeleccionada(nombreCategoria: string): boolean {
    return this.categoriasSeleccionadas.includes(nombreCategoria);
  }

  // Helper methods to extract permisos and grupos from conjunto
  private getPermisosDelUsuario(): Permiso[] {
    const conjunto = this.entidadActual?.usuario?.conjunto;
    if (!conjunto) return [];
    // return (conjunto as Grupo).elementos.filter(
    //   (e): e is Permiso => !('elementos' in e),
    // );
    let permisos: Permiso[] = [];
    if (Array.isArray(conjunto)) {
      conjunto.forEach((e) => {
        if (!('elementos' in e)) {
          permisos.push(e as Permiso);
        }
      });
    }
    return permisos;
  }

  private getGruposDelUsuario(): Grupo[] {
    const conjunto = this.entidadActual?.usuario?.conjunto;
    if (!conjunto) return [];
    let grupos: Grupo[] = [];
    if (Array.isArray(conjunto)) {
      conjunto.forEach((e) => {
        if ('elementos' in e && e.nombre !== 'EMPLEADO') {
          grupos.push(e as Grupo);
        }
      });
    }
    return grupos;
    // return (conjunto as Grupo).elementos.filter(
    //   (e): e is Grupo => 'elementos' in e,
    // );
  }

  // Dialog methods for adding/removing permissions and groups
  abrirDialogoAgregarPermisos(): void {
    // Get IDs of permissions the user already has
    const permisosDelUsuario = this.getPermisosDelUsuario().map((p) => p.id);
    // Get IDs of permissions already selected to add
    const permisosYaParaAgregar = this.permisosParaAgregar().map((p) => p.id);

    // Filter: show only permissions NOT in the user's conjunto
    const items: SelectableItem[] = this.permisosDisponibles
      .filter((p) => !permisosDelUsuario.includes(p.id))
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
    // Get permissions the user has
    const permisosDelUsuario = this.getPermisosDelUsuario();
    // Get IDs of permissions already selected to remove
    const permisosYaParaRemover = this.permisosParaRemover().map((p) => p.id);

    // Filter: show only permissions the user HAS
    const items: SelectableItem[] = permisosDelUsuario.map((permiso) => ({
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
          (item) => permisosDelUsuario.find((p) => p.id === item.id)!,
        );
        this.permisosParaRemover.set(permisosARemover);
      }
    });
  }

  abrirDialogoAgregarGrupos(): void {
    // Get IDs of groups the user already has
    const gruposDelUsuario = this.getGruposDelUsuario().map((g) => g.id);
    // Get IDs of groups already selected to add
    const gruposYaParaAgregar = this.gruposParaAgregar().map((g) => g.id);

    // Filter: show only groups NOT in the user's conjunto
    const items: SelectableItem[] = this.gruposDisponibles
      .filter((g) => !gruposDelUsuario.includes(g.id))
      .map((grupo) => ({
        id: grupo.id,
        nombre: grupo.nombre,
        descripcion: grupo.descripcion,
        selected: gruposYaParaAgregar.includes(grupo.id),
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
    // Get groups the user has
    const gruposDelUsuario = this.getGruposDelUsuario();
    // Get IDs of groups already selected to remove
    const gruposYaParaRemover = this.gruposParaRemover().map((g) => g.id);

    // Filter: show only groups the user HAS
    const items: SelectableItem[] = gruposDelUsuario.map((grupo) => ({
      id: grupo.id,
      nombre: grupo.nombre,
      descripcion: grupo.descripcion,
      selected: gruposYaParaRemover.includes(grupo.id),
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
          (item) => gruposDelUsuario.find((g) => g.id === item.id)!,
        );
        this.gruposParaRemover.set(gruposARemover);
      }
    });
  }

  // Methods to remove items from pending lists
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

  isFormValid(): boolean {
    if (!this.usuarioForm.valid) {
      return false;
    }
    if (this.esDistribuidora() && this.categoriasSeleccionadas.length === 0) {
      return false;
    }
    return true;
  }

  async handleConfirmarCambios() {
    if (!this.isFormValid()) {
      if (this.esDistribuidora() && this.categoriasSeleccionadas.length === 0) {
        this.dialogService
          .showMessage('Error', 'Debe seleccionar al menos una categoría.')
          .subscribe();
      } else {
        this.dialogService
          .showMessage(
            'Error',
            'Por favor complete todos los campos requeridos.',
          )
          .subscribe();
      }
      return;
    }

    if (!this.entidadActual) {
      this.dialogService
        .showMessage('Error', 'No se encontró la entidad a modificar.')
        .subscribe();
      return;
    }

    try {
      let entidadModificada: EntidadRegistrada;

      if (this.esDistribuidora() && this.isDistribuidora(this.entidadActual)) {
        entidadModificada = this.construirDistribuidora();
      } else if (this.esEmpleado() && this.isEmpleado(this.entidadActual)) {
        entidadModificada = this.construirEmpleado();
      } else {
        entidadModificada = this.construirPersonaFisica();
      }

      const result =
        await this.usuarioService.modificarUsuario(entidadModificada);

      if (result.success) {
        this.dialogService
          .showMessage('Éxito', 'Usuario modificado correctamente.')
          .subscribe(() => {
            this.router.navigate(['/base-page/usuario/modificar']);
          });
      } else {
        this.dialogService.showMessage('Error', result.message).subscribe();
        if (result.statusCode === 401) {
          // this.usuarioService.cerrarSesion();
        }
      }
    } catch (error) {
      console.error('Error al modificar usuario:', error);
      this.dialogService
        .showMessage('Error', 'Error en la solicitud de modificación.')
        .subscribe();
    }
  }

  private construirDistribuidora(): Distribuidora {
    const distribuidoraOriginal = this.entidadActual as Distribuidora;
    const usuario = new Usuario(
      distribuidoraOriginal.cuit,
      TipoUsuario.DISTRIBUIDORA,
      this.usuarioForm.value.estado ?? true,
      distribuidoraOriginal.usuario?.conjunto || null,
      this.usuarioForm.value.correoElectronico!,
      distribuidoraOriginal.usuario?.password || '',
    );

    return new Distribuidora(
      usuario,
      distribuidoraOriginal.cuit,
      this.usuarioForm.value.nombre!,
      this.usuarioForm.value.direccion!,
      this.usuarioForm.value.numeroTelefono!,
      this.usuarioForm.value.descripcion!,
      this.usuarioForm.value.codigoPostal!,
      this.usuarioForm.value.ciudad!,
      this.categoriasSeleccionadas.map((nombre) => new Categoria(nombre)),
    );
  }

  private construirConjuntoModificado():
    | ConjuntoGrupoPermiso
    | ConjuntoGrupoPermiso[]
    | null {
    const conjuntoOriginal = this.entidadActual?.usuario?.conjunto;

    // Si no hay cambios de permisos/grupos, devolver el conjunto original
    if (
      this.permisosParaAgregar().length === 0 &&
      this.permisosParaRemover().length === 0 &&
      this.gruposParaAgregar().length === 0 &&
      this.gruposParaRemover().length === 0
    ) {
      return conjuntoOriginal || null;
    }

    // Calculate IDs to remove
    const permisosIdsParaRemover = this.permisosParaRemover().map((p) => p.id);
    const gruposIdsParaRemover = this.gruposParaRemover().map((g) => g.id);

    // Get current permisos and grupos
    const permisosActuales = this.getPermisosDelUsuario();
    const gruposActuales = this.getGruposDelUsuario();

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

    // Create new conjunto (Grupo)
    const conjuntoAnterior = conjuntoOriginal as Grupo | null;
    // return new Grupo(
    //   conjuntoAnterior?.id || 0,
    //   conjuntoAnterior?.nombre || 'conjunto',
    //   conjuntoAnterior?.descripcion || '',
    //   elementosFinal,
    // );
    return elementosFinal;
  }

  private construirEmpleado(): Empleado {
    const empleadoOriginal = this.entidadActual as Empleado;
    const conjuntoModificado = this.construirConjuntoModificado();
    let conjuntoFinal: ConjuntoGrupoPermiso;

    // if (conjuntoModificado instanceof Grupo) {
    //   const a = conjuntoModificado as Grupo;
    //   conjuntoFinal = a.elementos;
    // } else if (conjuntoModificado instanceof Permiso) {
    //   conjuntoFinal = conjuntoModificado as Permiso;
    // } else {
    //   conjuntoFinal = conjuntoModificado as any;
    // }

    const usuario = new Usuario(
      empleadoOriginal.cuit,
      TipoUsuario.EMPLEADO,
      this.usuarioForm.value.estado ?? true,
      conjuntoModificado,
      this.usuarioForm.value.correoElectronico!,
      empleadoOriginal.usuario?.password || '',
    );

    return new Empleado(
      usuario,
      empleadoOriginal.cuit,
      this.usuarioForm.value.nombre!,
      this.usuarioForm.value.numeroTelefono!,
      this.usuarioForm.value.direccion!,
      this.usuarioForm.value.codigoPostal!,
      this.usuarioForm.value.ciudad!,
    );
  }

  private construirPersonaFisica(): PersonaFisica {
    const personaFisicaOriginal = this.entidadActual as PersonaFisica;
    const usuario = new Usuario(
      personaFisicaOriginal.cuit,
      TipoUsuario.PERSONA_FISICA,
      this.usuarioForm.value.estado ?? true,
      personaFisicaOriginal.usuario?.conjunto || null,
      this.usuarioForm.value.correoElectronico!,
      personaFisicaOriginal.usuario?.password || '',
    );

    return new PersonaFisica(
      usuario,
      personaFisicaOriginal.cuit,
      this.usuarioForm.value.nombre!,
      this.usuarioForm.value.numeroTelefono!,
      this.usuarioForm.value.codigoPostal!,
      this.usuarioForm.value.ciudad!,
    );
  }

  private isDistribuidora(entidad: unknown): entidad is Distribuidora {
    return (entidad as Distribuidora).descripcion !== undefined;
  }

  private isEmpleado(entidad: unknown): entidad is Empleado {
    return (
      (entidad as Empleado).direccion !== undefined &&
      !this.isDistribuidora(entidad)
    );
  }

  private isPersonaFisica(entidad: unknown): entidad is PersonaFisica {
    return (
      (entidad as PersonaFisica).nombre !== undefined &&
      !this.isDistribuidora(entidad) &&
      !this.isEmpleado(entidad)
    );
  }
}
