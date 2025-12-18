import { Component, inject, input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Distribuidora } from '../../../core/entities/distribuidora/distribuidora';
import { DistribuidoraServicio } from '../../../shared/services/distribuidora/distribuidora-servicio';
import { Categoria } from '../../../core/entities/categoria/categoria';
import { TipoUsuario, Usuario } from '../../../core/entities/usuario/usuario';
import { UsuarioServicio } from '../../../shared/services/usuario-servicio';
import { ReturnSearchResponse } from '../../../core/response-type/return-search-response';
import { MatButton } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-distribuidora-agregar',
  imports: [ReactiveFormsModule, MatButton, MatCheckboxModule],
  templateUrl: './distribuidora-agregar.html',
  styleUrl: './distribuidora-agregar.scss',
})
export class DistribuidoraAgregar implements OnInit {
  service = inject(DistribuidoraServicio);
  usuarioService = inject(UsuarioServicio);
  categoriasData = input.required<ReturnSearchResponse>();
  categorias: Categoria[] = [];
  categoriasSeleccionadas: string[] = [];

  ngOnInit() {
    this.categorias = this.categoriasData().payload as Categoria[];
  }

  distribuidoraForm = new FormGroup({
    cuit: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{11}$'),
    ]),
    nombre: new FormControl('', [Validators.required]),
    direccion: new FormControl('', [Validators.required]),
    codigoPostal: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{4}$'),
    ]),
    numeroTelefono: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{10,15}$'),
    ]),
    descripcion: new FormControl('', [Validators.required]),
    ciudad: new FormControl('', [Validators.required]),
    correoElectronico: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    contraseña: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  getCuit() {
    const valor = this.distribuidoraForm.get('cuit');
    if (valor === null) {
      throw new Error('Cuit es nulo');
    }
    return valor as AbstractControl<string>;
  }

  getNombre() {
    return this.distribuidoraForm.get('nombre');
  }

  getDireccion() {
    return this.distribuidoraForm.get('direccion');
  }

  getCodigoPostal(): AbstractControl<string> {
    const valor = this.distribuidoraForm.get('codigoPostal');
    if (valor === null) {
      throw new Error('Codigo Postal es nulo');
    }
    return valor as AbstractControl<string>;
  }

  getNumeroTelefono() {
    return this.distribuidoraForm.get('numeroTelefono');
  }

  getDescripcion() {
    return this.distribuidoraForm.get('descripcion');
  }

  getCiudad() {
    return this.distribuidoraForm.get('ciudad');
  }

  getCorreoElectronico() {
    return this.distribuidoraForm.get('correoElectronico');
  }

  getPassword() {
    return this.distribuidoraForm.get('contraseña');
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

  async handleSubmit() {
    if (
      this.distribuidoraForm.valid &&
      this.categoriasSeleccionadas.length > 0
    ) {
      const distribuidora = new Distribuidora(
        new Usuario(
          this.distribuidoraForm.value.cuit!,
          TipoUsuario.DISTRIBUIDORA,
          '',
          null,
          this.distribuidoraForm.value.correoElectronico!,
          this.distribuidoraForm.value.contraseña!,
        ),
        null,
        this.distribuidoraForm.value.nombre!,
        this.distribuidoraForm.value.direccion!,
        this.distribuidoraForm.value.numeroTelefono!,
        this.distribuidoraForm.value.descripcion!,
        this.distribuidoraForm.value.codigoPostal!,
        this.distribuidoraForm.value.ciudad!,
        this.categoriasSeleccionadas.map((nombre) => new Categoria(nombre)),
      );

      const result = await this.service.agregarDistribuidora(distribuidora);
      if (result.success) {
        alert(result.message);
        this.distribuidoraForm.reset();
        this.categoriasSeleccionadas = [];
      } else {
        alert(result.message);
        if (result.statusCode === 401) {
          this.usuarioService.cerrarSesion();
        }
      }
    } else if (this.categoriasSeleccionadas.length === 0) {
      alert('Debe seleccionar al menos una categoría');
    }
  }
}
