import { Component, inject, input, OnInit } from '@angular/core';
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
import { DialogService } from '../../../shared/services/dialog.service';
import { ReturnSearchResponse } from '../../../core/response-type/return-search-response';
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
  dialogService = inject(DialogService);
  categoriasData = input.required<ReturnSearchResponse>();
  distribuidoraEncontrada: Distribuidora | null = null;
  categorias: Categoria[] = [];
  categoriasSeleccionadas: string[] = [];

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
  });

  ngOnInit() {
    this.categorias = this.categoriasData().payload as Categoria[];
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
        } else {
          await this.dialogService
            .showMessage('Error', result.message)
            .toPromise();
          if (result.statusCode === 401) {
            this.usuarioService.cerrarSesion();
          }
          this.distribuidoraEncontrada = null;
          this.distribuidoraForm.reset();
        }
      } catch (error) {
        await this.dialogService
          .showMessage('Error', 'Error al buscar la distribuidora')
          .toPromise();
        this.distribuidoraEncontrada = null;
      }
    } else {
      await this.dialogService
        .showMessage('Error', 'CUIT inválido o vacío')
        .toPromise();
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
          null,
          null,
          '',
          '',
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
          await this.dialogService
            .showMessage('Éxito', result.message)
            .toPromise();
          this.distribuidoraForm.reset();
          this.distribuidoraCuit.reset();
          this.distribuidoraEncontrada = null;
          this.categoriasSeleccionadas = [];
        } else {
          await this.dialogService
            .showMessage('Error', result.message)
            .toPromise();
          if (result.statusCode === 401) {
            this.usuarioService.cerrarSesion();
          }
        }
      } catch (error) {
        await this.dialogService
          .showMessage('Error', 'Error en la solicitud de modificación')
          .toPromise();
      }
    } else {
      if (this.categoriasSeleccionadas.length === 0) {
        await this.dialogService
          .showMessage('Validación', 'Debe seleccionar al menos una categoría')
          .toPromise();
      } else {
        await this.dialogService
          .showMessage('Validación', 'Formulario inválido')
          .toPromise();
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
    });
  }
}
