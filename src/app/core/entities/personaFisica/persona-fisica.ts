export class PersonaFisica {
  private cuit: string;
  private nombre: string;
  private numeroTelefono: string;
  private codigoPostal: string;
  private ciudad: string;

  public Cuit() {
    return this.cuit;
  }
  public Nombre() {
    return this.nombre;
  }
  public NumeroTelefono() {
    return this.numeroTelefono;
  }

  public CodigoPostal() {
    return this.codigoPostal;
  }
  public Ciudad() {
    return this.ciudad;
  }
  constructor(
    cuit: string,
    nombre: string,
    numeroTelefono: string,
    codigoPostal: string,
    ciudad: string,
  ) {
    this.cuit = cuit;
    this.nombre = nombre;
    this.numeroTelefono = numeroTelefono;
    this.codigoPostal = codigoPostal;
    this.ciudad = ciudad;
  }
}
