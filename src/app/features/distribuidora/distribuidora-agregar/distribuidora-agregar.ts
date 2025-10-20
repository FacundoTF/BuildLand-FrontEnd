import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
import { Distribuidora } from '../../../core/entities/distribuidora/distribuidora';
import { DistribuidoraServicio } from '../distribuidora-servicio';

@Component({
  selector: 'app-distribuidora-agregar',
  imports: [ReactiveFormsModule],
  templateUrl: './distribuidora-agregar.html',
  styleUrl: './distribuidora-agregar.scss',
})
export class DistribuidoraAgregar {
  service = inject(DistribuidoraServicio);

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

  handleSubmit() {
    if (this.distribuidoraForm.valid) {
      const distribuidoraData = {
        cuit: this.distribuidoraForm.value.cuit,
        nombre: this.distribuidoraForm.value.nombre,
        direccion: this.distribuidoraForm.value.direccion,
        codigoPostal: this.distribuidoraForm.value.codigoPostal,
        numeroTelefono: this.distribuidoraForm.value.numeroTelefono,
        descripcion: this.distribuidoraForm.value.descripcion,
        ciudad: this.distribuidoraForm.value.ciudad,
      };
      const usuarioData = {
        correoElectronico: this.distribuidoraForm.value.correoElectronico,
        contraseña: this.distribuidoraForm.value.contraseña,
        rol: 'DISTRIBUIDORA',
      };
      this.service
        .agregarDistribuidora(distribuidoraData, usuarioData)
        .subscribe({
          next: (result) => {
            if (result) {
              console.log('Distribuidora agregada exitosamente');
              this.distribuidoraForm.reset();
            } else {
              console.error('Error al agregar la distribuidora');
            }
          },
          error: (error) => {
            console.error('Error en la solicitud:', error);
          },
        });
    }
  }
}
