import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
import { Distribuidora } from '../../../core/entities/distribuidora/distribuidora';
import { DistribuidoraServicio } from '../distribuidora-servicio';

@Component({
  selector: 'app-distribuidora-agregar',
  imports: [ReactiveFormsModule],
  templateUrl: './distribuidora-agregar.html',
  styleUrl: './distribuidora-agregar.scss'
})
export class DistribuidoraAgregar {

  service = inject(DistribuidoraServicio);

  distribuidoraForm = new FormGroup({
    cuit: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{11}$')]),
    correoElectronico: new FormControl('', [Validators.required, Validators.email]),
    nombre: new FormControl('', [Validators.required]),
    direccion: new FormControl('', [Validators.required]),
    codigoPostal: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{4}$')]),
    numeroTelefono: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]),
    descripcion: new FormControl('', [Validators.required])
  })

  handleSubmit(){
    if (this.distribuidoraForm.valid){
      const distribuidoraData = this.distribuidoraForm.value;
      this.service.agregarDistribuidora(distribuidoraData).subscribe({
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
        }
      });
    }
  }
}
