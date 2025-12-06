import { ReturnResultResponse } from './return-response';
import { Distribuidora } from '../../core/entities/distribuidora/distribuidora';
import { PersonaFisica } from '../../core/entities/personaFisica/persona-fisica';

type NullOrUndefined = null | undefined;

export interface ReturnSearchResponse extends ReturnResultResponse {
  payload: Distribuidora | PersonaFisica | NullOrUndefined;
}
