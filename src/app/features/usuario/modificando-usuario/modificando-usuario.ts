import { Component, inject, input, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';

import { UsuarioServicio } from '../../../shared/services/usuario-servicio';
import { DialogService } from '../../../shared/services/dialog.service';
import { TipoUsuario, Usuario } from '../../../core/entities/usuario/usuario';
import { Distribuidora } from '../../../core/entities/distribuidora/distribuidora';
import { Empleado } from '../../../core/entities/empleado/empleado';
import { PersonaFisica } from '../../../core/entities/personaFisica/persona-fisica';
import { Categoria } from '../../../core/entities/categoria/categoria';
import { ReturnSearchResponse } from '../../../core/response-type/return-search-response';
import { EntidadRegistrada } from '../../../core/entities/usuario/entidad-registrada';

@Component({
  selector: 'app-modificando-usuario',
  imports: [ReactiveFormsModule, MatCheckboxModule, MatButton],
  templateUrl: './modificando-usuario.html',
  styleUrl: './modificando-usuario.scss',
})
export class ModificandoUsuario implements OnInit {
  usuarioData = input.required<ReturnSearchResponse>();
  categoriasData = input.required<ReturnSearchResponse>();

  usuarioService = inject(UsuarioServicio);
  dialogService = inject(DialogService);
  router = inject(Router);

  esDistribuidora = signal(false);
  esEmpleado = signal(false);
  esPersonaFisica = signal(false);

  categorias: Categoria[] = [];
  categoriasSeleccionadas: string[] = [];

  entidadActual: EntidadRegistrada | null = null;

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
  });

  ngOnInit() {
    this.cargarCategorias();
    this.cargarDatosUsuario();
  }

  cargarCategorias() {
    const categoriasResponse = this.categoriasData();
    if (categoriasResponse.success && categoriasResponse.payload) {
      this.categorias = categoriasResponse.payload as Categoria[];
    }
  }

  cargarDatosUsuario() {
    const usuarioResponse = this.usuarioData();
    if (usuarioResponse.success && usuarioResponse.payload) {
      const entidad = usuarioResponse.payload as EntidadRegistrada;
      this.entidadActual = entidad;

      if (this.isDistribuidora(entidad)) {
        this.esDistribuidora.set(true);
        this.cargarDatosDistribuidora(entidad);
      } else if (this.isEmpleado(entidad)) {
        this.esEmpleado.set(true);
        this.cargarDatosEmpleado(entidad);
      } else if (this.isPersonaFisica(entidad)) {
        this.esPersonaFisica.set(true);
        this.cargarDatosPersonaFisica(entidad);
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
      distribuidoraOriginal.usuario?.estado,
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

  private construirEmpleado(): Empleado {
    const empleadoOriginal = this.entidadActual as Empleado;
    const usuario = new Usuario(
      empleadoOriginal.cuit,
      TipoUsuario.EMPLEADO,
      empleadoOriginal.usuario?.estado,
      empleadoOriginal.usuario?.conjunto || null,
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
      personaFisicaOriginal.usuario?.estado,
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
