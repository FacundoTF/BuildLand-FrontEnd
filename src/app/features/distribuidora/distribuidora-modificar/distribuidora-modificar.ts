import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DistribuidoraServicio } from '../../../shared/services/distribuidora/distribuidora-servicio';
import { Distribuidora } from '../../../core/entities/distribuidora/distribuidora';

@Component({
  selector: 'app-distribuidora-modificar',
  imports: [ReactiveFormsModule],
  templateUrl: './distribuidora-modificar.html',
  styleUrl: './distribuidora-modificar.scss',
})
export class DistribuidoraModificar {
  service = inject(DistribuidoraServicio);
  distribuidoraEncontrada: Distribuidora | null = null;

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

  async handleSubmitCuit() {
    if (this.distribuidoraCuit.valid) {
      try {
        const distribuidora = await this.service.buscarDistribuidoraCuit(
          this.distribuidoraCuit.value.cuit,
        );
        if (distribuidora) {
          console.log('Distribuidora encontrada:', distribuidora);
          this.distribuidoraEncontrada = distribuidora;

          const container = document.querySelector(
            '.edit-container',
          ) as HTMLElement;
          container.className = 'edit-container is-visible';

          // Poblar el formulario con los datos encontrados
          this.distribuidoraForm.patchValue({
            cuit: this.distribuidoraCuit.value.cuit,
            nombre: distribuidora.nombre,
            direccion: distribuidora.direccion,
            codigoPostal: distribuidora.codigoPostal,
            numeroTelefono: distribuidora.numeroTelefono,
            descripcion: distribuidora.descripcion,
            ciudad: distribuidora.ciudad,
            correoElectronico: '', // Campo nuevo - se dejará vacío para que el usuario lo complete
            contraseña: '', // Campo nuevo - se dejará vacío para que el usuario lo complete
          });
        } else {
          console.error(
            'No se encontró la distribuidora con el CUIT proporcionado',
          );
          this.distribuidoraEncontrada = null;
          this.distribuidoraForm.reset();
        }
      } catch (error) {
        console.error('Error al buscar la distribuidora:', error);
        this.distribuidoraEncontrada = null;
      }
    } else {
      console.error('CUIT inválido o vacío');
      this.distribuidoraEncontrada = null;
      this.distribuidoraForm.reset();
    }
  }

  async handleModify() {
    if (this.distribuidoraForm.valid) {
      const distribuidoraData = this.distribuidoraForm.value;
      const cuit = this.distribuidoraCuit.value.cuit;

      if (!cuit) {
        console.error('CUIT no disponible');
        return;
      }

      try {
        const success = await this.service.modificarDistribuidora(
          cuit,
          distribuidoraData,
        );
        if (success) {
          console.log('Distribuidora modificada exitosamente');
          this.distribuidoraForm.reset();
          this.distribuidoraCuit.reset();
          this.distribuidoraEncontrada = null;
        } else {
          console.error('Error al modificar la distribuidora');
        }
      } catch (error) {
        console.error('Error en la solicitud de modificación:', error);
      }
    } else {
      console.error('Formulario inválido');
      this.distribuidoraForm.reset();
      this.distribuidoraCuit.reset();
      this.distribuidoraEncontrada = null;
    }
  }
}
