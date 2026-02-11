import { Empleado } from '../empleado/empleado';
import { Distribuidora } from '../distribuidora/distribuidora';
import { PersonaFisica } from '../personaFisica/persona-fisica';

export type EntidadRegistrada = Empleado | Distribuidora | PersonaFisica;
