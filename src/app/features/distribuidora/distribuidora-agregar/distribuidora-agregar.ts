import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Distribuidora } from '../../../core/entities/distribuidora/distribuidora';
import { DistribuidoraServicio } from '../../../shared/services/distribuidora/distribuidora-servicio';
import { CategoriaService } from '../../../shared/services/categoria/categoria-service';
import { Categoria } from '../../../core/entities/categoria/categoria';
import { TipoUsuario, Usuario } from '../../../core/entities/usuario/usuario';

@Component({
  selector: 'app-distribuidora-agregar',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './distribuidora-agregar.html',
  styleUrl: './distribuidora-agregar.scss',
})
export class DistribuidoraAgregar implements OnInit {
  service = inject(DistribuidoraServicio);
  categoriaService = inject(CategoriaService);
  categorias: Categoria[] = [];
  categoriasSeleccionadas: string[] = [];

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

  async ngOnInit() {
    await this.cargarCategorias();
  }

  async cargarCategorias() {
    try {
      let result = await this.categoriaService.traerCategorias().toPromise();
      if (result) {
        this.categorias = result;
      } else {
        throw 'Las categorias resultaron ser undefined';
      }
    } catch (error) {
      alert('Error al cargar categorías');
    }
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
          null,
          TipoUsuario.DISTRIBUIDORA,
          '',
          null,
          this.distribuidoraForm.value.correoElectronico!,
          this.distribuidoraForm.value.contraseña!,
        ),
        this.distribuidoraForm.value.cuit!,
        this.distribuidoraForm.value.nombre!,
        this.distribuidoraForm.value.direccion!,
        this.distribuidoraForm.value.numeroTelefono!,
        this.distribuidoraForm.value.descripcion!,
        this.distribuidoraForm.value.codigoPostal!,
        this.distribuidoraForm.value.ciudad!,
        this.categoriasSeleccionadas.map((nombre) => new Categoria(nombre)),
      );

      try {
        const result = await this.service.agregarDistribuidora(distribuidora);
        if (result) {
          alert('Distribuidora agregada exitosamente');
          this.distribuidoraForm.reset();
          this.categoriasSeleccionadas = [];
        } else {
          alert('Error al agregar la distribuidora');
        }
      } catch (error) {
        alert('Error en la solicitud al agregar distribuidora');
      }
    } else if (this.categoriasSeleccionadas.length === 0) {
      alert('Debe seleccionar al menos una categoría');
    }
  }
}
