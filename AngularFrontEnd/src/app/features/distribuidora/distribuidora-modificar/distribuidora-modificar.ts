import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DistribuidoraServicio } from '../distribuidora-servicio';
import { Distribuidora } from '../../../core/entities/distribuidora/distribuidora';

@Component({
  selector: 'app-distribuidora-modificar',
  imports: [ReactiveFormsModule],
  templateUrl: './distribuidora-modificar.html',
  styleUrl: './distribuidora-modificar.scss'
})
export class DistribuidoraModificar {
  service = inject(DistribuidoraServicio);
  distribuidoraEncontrada: Distribuidora | null = null;

  distribuidoraCuit = new FormGroup({
    cuit: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{11}$')])
  });

  distribuidoraForm = new FormGroup({
    cuit: new FormControl({ value: '', disabled: true }),
    correoElectronico: new FormControl('', [Validators.required, Validators.email]),
    nombre: new FormControl('', [Validators.required]),
    direccion: new FormControl('', [Validators.required]),
    codigoPostal: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{4}$')]),
    numeroTelefono: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]),
    descripcion: new FormControl('', [Validators.required])
  })

  handleSubmitCuit() {
    if (this.distribuidoraCuit.valid) {
      this.service.buscarDistribuidoraCuit(this.distribuidoraCuit.value.cuit).subscribe({
        next: (distribuidora) => {
          if (distribuidora) {
            console.log('Distribuidora encontrada:', distribuidora);
            this.distribuidoraEncontrada = distribuidora;

            const container = document.querySelector(".edit-container") as HTMLElement;
            container.style.display = "block";

            // Poblar el formulario con los datos encontrados
            this.distribuidoraForm.patchValue({
              cuit: this.distribuidoraCuit.value.cuit,
              nombre: distribuidora.Nombre(),
              direccion: distribuidora.Direccion(),
              correoElectronico: distribuidora.CorreoElectronico(),
              codigoPostal: distribuidora.CodigoPostal(),
              numeroTelefono: distribuidora.NumeroTelefono(),
              descripcion: distribuidora.Descripcion()
            });
          } else {
            console.error('No se encontró la distribuidora con el CUIT proporcionado');
            this.distribuidoraEncontrada = null;
            this.distribuidoraForm.reset();
          }
        },
        error: (error) => {
          console.error('Error al buscar la distribuidora:', error);
          this.distribuidoraEncontrada = null;
        }
      });
    }else{
      console.error('CUIT inválido o vacío');
      this.distribuidoraEncontrada = null;
      this.distribuidoraForm.reset();
    }
  }

  handleModify() {
    if (this.distribuidoraForm.valid) {
      const distribuidoraData = new Distribuidora(
        this.distribuidoraForm.get('cuit')?.value ?? '',
        this.distribuidoraForm.get('nombre')?.value ?? '',
        this.distribuidoraForm.get('direccion')?.value ?? '',
        this.distribuidoraForm.get('codigoPostal')?.value ?? '',
        this.distribuidoraForm.get('descripcion')?.value ?? '',
        this.distribuidoraForm.get('numeroTelefono')?.value ?? '',
        this.distribuidoraForm.get('correoElectronico')?.value ?? ''
      );
      this.service.modificarDistribuidora(distribuidoraData.Cuit(), distribuidoraData).subscribe({
        next: (success) => {
          if (success) {
            console.log('Distribuidora modificada exitosamente');
            this.distribuidoraForm.reset();
            this.distribuidoraCuit.reset();
            this.distribuidoraEncontrada = null;
          } else {
            console.error('Error al modificar la distribuidora');
          }
        },
        error: (error) => {
          console.error('Error en la solicitud de modificación:', error);
        }
      });
    } else {
      console.error('Formulario inválido');
      this.distribuidoraForm.reset();
      this.distribuidoraCuit.reset();
      this.distribuidoraEncontrada = null;
    }
  }
}
