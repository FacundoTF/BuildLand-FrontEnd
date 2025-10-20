export class Empleado {
  private cuit: string;
  private nombre: string;
  private numeroTelefono: string;
  private direccion: string;
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
  public Direccion() {
    return this.direccion;
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
    direccion: string,
    codigoPostal: string,
    ciudad: string
  ) {
    this.cuit = cuit;
    this.nombre = nombre;
    this.numeroTelefono = numeroTelefono;
    this.direccion = direccion;
    this.codigoPostal = codigoPostal;
    this.ciudad = ciudad;
  }
}
