export class Distribuidora {
    private cuit: string
    private nombre: string
    private direccion: string
    private codigoPostal: string
    private descripcion: string
    private numeroTelefono: string
    private correoElectronico: string

    public Cuit(){
        return this.cuit;
    }
    public Nombre(){
        return this.nombre;
    }
    public Direccion(){
        return this.direccion;
    }
    public CodigoPostal(){
        return this.codigoPostal;
    }
    public Descripcion(){
        return this.descripcion;
    }
    public NumeroTelefono(){
        return this.numeroTelefono;
    }
    public CorreoElectronico(){
        return this.correoElectronico;
    }

    constructor(cuit: string, nombre: string, direccion: string, codigoPostal: string, descripcion: string, numeroTelefono: string, correoElectronico: string) {
        this.cuit = cuit;
        this.nombre = nombre;
        this.direccion = direccion;
        this.codigoPostal = codigoPostal;
        this.descripcion = descripcion;
        this.numeroTelefono = numeroTelefono;
        this.correoElectronico = correoElectronico;
    }
}
