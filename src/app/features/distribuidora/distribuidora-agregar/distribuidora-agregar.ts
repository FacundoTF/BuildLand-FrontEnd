import { Component, inject, input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Distribuidora } from '../../../core/entities/distribuidora/distribuidora';
import { DistribuidoraServicio } from '../../../shared/services/distribuidora/distribuidora-servicio';
import { Categoria } from '../../../core/entities/categoria/categoria';
import { TipoUsuario, Usuario } from '../../../core/entities/usuario/usuario';
import { UsuarioServicio } from '../../../shared/services/usuario-servicio';
import { ReturnSearchResponse } from '../../../shared/services/return-search-response';

@Component({
  selector: 'app-distribuidora-agregar',
  imports: [ReactiveFormsModule, CommonModule],
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
