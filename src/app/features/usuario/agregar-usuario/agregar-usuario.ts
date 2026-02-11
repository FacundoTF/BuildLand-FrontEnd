import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormArray,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioServicio } from '../../../shared/services/usuario-servicio';
import { UsuarioRequest } from '../../../core/entities/usuario/usuario-request';
import { CategoriaService } from '../../../shared/services/categoria/categoria-service';
import { Categoria } from '../../../core/entities/categoria/categoria';
import { TipoUsuario } from '../../../core/entities/usuario/usuario';
import { MatButton } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DialogService } from '../../../shared/services/dialog.service';

@Component({
  selector: 'app-agregar-usuario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButton,
    MatRadioModule,
    MatCheckboxModule,
  ],
  templateUrl: './agregar-usuario.html',
  styleUrls: ['./agregar-usuario.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgregarUsuario {
  private fb = inject(FormBuilder);
  private usuarioServicio = inject(UsuarioServicio);
  private categoriaService = inject(CategoriaService);
  private router = inject(Router);
  private dialog = inject(DialogService);

  // Signals
  categoriasData = signal<Categoria[]>([]);

  // Form
  form = this.fb.group({
    cuit: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    ciudad: ['', [Validators.required]],
    codigoPostal: ['', [Validators.required]],
    numeroTelefono: ['', [Validators.required]],
    password: ['', [Validators.required]],
    tipoUsuario: [null as TipoUsuario | null, [Validators.required]],
    // Distribuidora & Empleado fields
    direccion: [''],
    // Distribuidora specific
    descripcion: [''],
    categoriasSeleccionadas: this.fb.array([]),
  });

  // Access to Form Controls for Template
  get categoriasSeleccionadas() {
    return this.form.get('categoriasSeleccionadas') as FormArray;
  }

  TipoUsuario = TipoUsuario; // Expose enum to template

  constructor() {
    this.form.get('tipoUsuario')?.valueChanges.subscribe(async (tipo) => {
      if (tipo === TipoUsuario.DISTRIBUIDORA) {
        // Validators
        this.form.get('direccion')?.setValidators([Validators.required]);
        this.form.get('descripcion')?.setValidators([Validators.required]);
        this.categoriasSeleccionadas.setValidators(minSelectedCheckboxes(1));

        // Load categories if not already loaded
        if (!this.categoriasData().length) {
          try {
            const response = await this.categoriaService.traerCategorias();
            if (response.success && response.payload) {
              this.categoriasData.set(response.payload as Categoria[]);
              this.buildCategoriasCheckboxes();
            }
          } catch (error) {
            console.error('Error loading categories', error);
          }
        } else {
          // If already loaded but FormArray empty (e.g. switched back and forth), rebuild checks
          if (this.categoriasSeleccionadas.length === 0) {
            this.buildCategoriasCheckboxes();
          }
        }
      } else if (tipo === TipoUsuario.EMPLEADO) {
        this.form.get('direccion')?.setValidators([Validators.required]);
        this.form.get('descripcion')?.clearValidators();
        this.form.get('descripcion')?.setValue('');
        this.categoriasSeleccionadas.clearValidators();
        this.clearCategorias();
      } else {
        // Persona Fisica or null
        this.form.get('direccion')?.clearValidators();
        this.form.get('direccion')?.setValue('');
        this.form.get('descripcion')?.clearValidators();
        this.form.get('descripcion')?.setValue('');
        this.categoriasSeleccionadas.clearValidators();
        this.clearCategorias();
      }
      this.form.get('direccion')?.updateValueAndValidity();
      this.form.get('descripcion')?.updateValueAndValidity();
      this.categoriasSeleccionadas.updateValueAndValidity();
    });
  }

  private buildCategoriasCheckboxes() {
    this.categoriasSeleccionadas.clear();
    this.categoriasData().forEach(() => {
      this.categoriasSeleccionadas.push(this.fb.control(false));
    });
  }

  private clearCategorias() {
    this.categoriasSeleccionadas.clear();
  }

  confirmar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    const tipo = formValue.tipoUsuario;

    const request: UsuarioRequest = {
      nombre: formValue.nombre!,
      ciudad: formValue.ciudad!,
      codigoPostal: formValue.codigoPostal!,
      numeroTelefono: formValue.numeroTelefono!,
      usuario: {
        cuit: formValue.cuit!,
        email: formValue.email!,
        password: formValue.password!,
        tipoUsuario: tipo!,
        conjunto: [],
      },
    };

    if (tipo === TipoUsuario.EMPLEADO) {
      request.direccion = formValue.direccion!;
    } else if (tipo === TipoUsuario.DISTRIBUIDORA) {
      request.direccion = formValue.direccion!;
      request.descripcion = formValue.descripcion!;

      request.categorias = this.categoriasSeleccionadas.controls
        .map((control, i) => (control.value ? this.categoriasData()[i] : null))
        .filter((cat): cat is Categoria => cat !== null);
    }

    this.usuarioServicio.agregarUsuario(request).subscribe({
      next: () => {
        this.dialog.showMessage('Exito', 'Usuario creado con éxito');
      },
      error: () => {
        this.dialog.showMessage(
          'Error',
          'No se pudo crear el usuario. Por favor, intente nuevamente.',
        );
      },
    });
  }
}

export function minSelectedCheckboxes(min = 1): ValidatorFn {
  return (formArray: AbstractControl): ValidationErrors | null => {
    const totalSelected = (formArray as FormArray).controls.filter(
      (control) => control.value,
    ).length;
    return totalSelected < min
      ? { minSelectedCheckboxes: { required: min, actual: totalSelected } }
      : null;
  };
}
