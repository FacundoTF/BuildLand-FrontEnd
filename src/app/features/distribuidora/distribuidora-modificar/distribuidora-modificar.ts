import { Component, inject, input, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { DistribuidoraServicio } from '../../../shared/services/distribuidora/distribuidora-servicio';
import { Distribuidora } from '../../../core/entities/distribuidora/distribuidora';
import { Categoria } from '../../../core/entities/categoria/categoria';
import { TipoUsuario, Usuario } from '../../../core/entities/usuario/usuario';
import { UsuarioServicio } from '../../../shared/services/usuario-servicio';
import { ReturnSearchResponse } from '../../../core/response-type/return-search-response';
import { Permiso } from '../../../core/entities/permiso/permiso';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-distribuidora-modificar',
  imports: [ReactiveFormsModule, MatCheckboxModule, MatButton],
  templateUrl: './distribuidora-modificar.html',
  styleUrl: './distribuidora-modificar.scss',
})
export class DistribuidoraModificar implements OnInit {
  service = inject(DistribuidoraServicio);
  usuarioService = inject(UsuarioServicio);
  categoriasData = input.required<ReturnSearchResponse>();
  distribuidoraEncontrada: Distribuidora | null = null;
  categorias: Categoria[] = [];
  categoriasSeleccionadas: string[] = [];

  // Control de permisos y estado del checkbox
  tienePermisoAdmin = signal(false);
  mostrarCamposUsuario = signal(false);

  // Datos originales del usuario
  correoOriginal = '';
  contraseñaOriginal = '';

  distribuidoraCuit = new FormGroup({
    cuit: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{11}$'),
    ]),
  });

  distribuidoraForm = new FormGroup({
    cuit: new FormControl({ value: '', disabled: true }),
    nombre: new FormControl('', [Validators.required]),
    direccion: new FormControl('', [Validators.required]),
    codigoPostal: new FormControl('', [
      Validators.required,
      // Validators.pattern('^[0-9]{4}$'),
    ]),
    numeroTelefono: new FormControl('', [
      Validators.required,
      // Validators.pattern('^[0-9]{10,15}$'),
    ]),
    descripcion: new FormControl('', [Validators.required]),
    ciudad: new FormControl('', [Validators.required]),
    correoElectronico: new FormControl('', [Validators.email]),
    contraseña: new FormControl('', []),
  });

  ngOnInit() {
    this.categorias = this.categoriasData().payload as Categoria[];
    this.verificarPermisos();
  }

  verificarPermisos() {
    const permisosString = sessionStorage.getItem('permisos');
    if (permisosString) {
      try {
        const permisos = JSON.parse(permisosString);
        console.log(permisos);
        const tieneAdmin = permisos.some((permiso: any) => {
          return permiso === 'ADMIN';
        });
        this.tienePermisoAdmin.set(tieneAdmin);
      } catch (error) {
        console.error('Error al parsear permisos:', error);
        this.tienePermisoAdmin.set(false);
      }
    }
  }

  toggleCamposUsuario() {
    const nuevoEstado = !this.mostrarCamposUsuario();
    this.mostrarCamposUsuario.set(nuevoEstado);

    const correoControl = this.distribuidoraForm.get('correoElectronico');
    const contraseñaControl = this.distribuidoraForm.get('contraseña');

    if (nuevoEstado) {
      // Limpiar campos para permitir nueva entrada y agregar validaciones
      this.distribuidoraForm.patchValue({
        correoElectronico: '',
        contraseña: '',
      });
      correoControl?.setValidators([Validators.required, Validators.email]);
      contraseñaControl?.setValidators([
        Validators.required,
        Validators.minLength(6),
      ]);
    } else {
      // Restaurar datos originales y quitar validación requerida
      this.distribuidoraForm.patchValue({
        correoElectronico: this.correoOriginal,
        contraseña: this.contraseñaOriginal,
      });
      correoControl?.setValidators([Validators.email]);
      contraseñaControl?.clearValidators();
    }

    correoControl?.updateValueAndValidity();
    contraseñaControl?.updateValueAndValidity();
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

  async handleSubmitCuit() {
    if (this.distribuidoraCuit.valid) {
      try {
        const result = await this.service.buscarDistribuidoraCuit(
          this.distribuidoraCuit.value.cuit,
        );
        if (result.success && result.payload) {
          this.distribuidoraEncontrada = result.payload as Distribuidora;

          // Almacenar datos originales del usuario
          this.correoOriginal =
            this.distribuidoraEncontrada.usuario?.email || '';
          this.contraseñaOriginal =
            this.distribuidoraEncontrada.usuario?.password || '';

          const container = document.querySelector(
            '.edit-container',
          ) as HTMLElement;
          container.className = 'edit-container is-visible';

          // Poblar el formulario con los datos encontrados
          this.distribuidoraForm.patchValue({
            cuit: this.distribuidoraCuit.value.cuit,
            nombre: this.distribuidoraEncontrada.nombre,
            direccion: this.distribuidoraEncontrada.direccion,
            codigoPostal: this.distribuidoraEncontrada.codigoPostal,
            numeroTelefono: this.distribuidoraEncontrada.numeroTelefono,
            descripcion: this.distribuidoraEncontrada.descripcion,
            ciudad: this.distribuidoraEncontrada.ciudad,
            correoElectronico: this.correoOriginal,
            contraseña: this.contraseñaOriginal,
          });

          // Cargar las categorías seleccionadas
          this.categoriasSeleccionadas = [];
          if (
            this.distribuidoraEncontrada.categorias &&
            Array.isArray(this.distribuidoraEncontrada.categorias)
          ) {
            this.categoriasSeleccionadas =
              this.distribuidoraEncontrada.categorias.map((cat) => cat.nombre);
          }

          // Resetear el estado del checkbox
          this.mostrarCamposUsuario.set(false);
        } else {
          alert(result.message);
          if (result.statusCode === 401) {
            this.usuarioService.cerrarSesion();
          }
          this.distribuidoraEncontrada = null;
          this.distribuidoraForm.reset();
        }
      } catch (error) {
        alert('Error al buscar la distribuidora');
        this.distribuidoraEncontrada = null;
      }
    } else {
      alert('CUIT inválido o vacío');
      this.distribuidoraEncontrada = null;
      this.distribuidoraForm.reset();
    }
  }

  async handleModify() {
    if (
      this.distribuidoraForm.valid &&
      this.categoriasSeleccionadas.length > 0
    ) {
      const distribuidora = new Distribuidora(
        new Usuario(
          this.distribuidoraCuit.value.cuit!,
          TipoUsuario.DISTRIBUIDORA,
          '',
          null,
          this.distribuidoraForm.value.correoElectronico!,
          this.distribuidoraForm.value.contraseña!,
        ),
        this.distribuidoraCuit.value.cuit!,
        this.distribuidoraForm.value.nombre!,
        this.distribuidoraForm.value.direccion!,
        this.distribuidoraForm.value.numeroTelefono!,
        this.distribuidoraForm.value.descripcion!,
        this.distribuidoraForm.value.codigoPostal!,
        this.distribuidoraForm.value.ciudad!,
        this.categoriasSeleccionadas.map((nombre) => new Categoria(nombre)),
      );

      try {
        const result = await this.service.modificarDistribuidora(distribuidora);
        if (result.success) {
          alert(result.message);
          this.distribuidoraForm.reset();
          this.distribuidoraCuit.reset();
          this.distribuidoraEncontrada = null;
          this.categoriasSeleccionadas = [];
        } else {
          alert(result.message);
          if (result.statusCode === 401) {
            this.usuarioService.cerrarSesion();
          }
        }
      } catch (error) {
        alert('Error en la solicitud de modificación');
      }
    } else {
      if (this.categoriasSeleccionadas.length === 0) {
        alert('Debe seleccionar al menos una categoría');
      } else {
        alert('Formulario inválido');
      }
      this.distribuidoraForm.reset();
      this.distribuidoraCuit.reset();
      this.distribuidoraEncontrada = null;
      this.categoriasSeleccionadas = [];
    }
  }

  resetModifyForm() {
    this.distribuidoraForm.patchValue({
      cuit: this.distribuidoraCuit.value.cuit,
      nombre: this.distribuidoraEncontrada!.nombre,
      direccion: this.distribuidoraEncontrada!.direccion,
      codigoPostal: this.distribuidoraEncontrada!.codigoPostal,
      numeroTelefono: this.distribuidoraEncontrada!.numeroTelefono,
      descripcion: this.distribuidoraEncontrada!.descripcion,
      ciudad: this.distribuidoraEncontrada!.ciudad,
      correoElectronico: this.correoOriginal,
      contraseña: this.contraseñaOriginal,
    });
  }
}
