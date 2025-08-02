package uai.project.buildland.entidades;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Entidad que representa una distribuidora en el sistema BuildLand
 */
@Entity
@Table(name = "DISTRIBUIDORAS")
public class Distribuidora {
    
    @Id
    @Column(name = "CuitDistribuidora", nullable = false, length = 11)
    private String id;
    
    @Column(name = "Nombre", nullable = false, length = 100)
    private String nombre;
    
    @Column(name = "Direccion", length = 200)
    private String direccion;
    
    @Column(name = "NumeroTelefono", length = 20)
    private String numeroTelefono;
    
    @Column(name = "Descripcion", length = 120)
    private String descripcion;
    
    @Column(name = "CodigoPostal", length = 4)
    private String codigoPostal;

    @Column(name = "CorreoElectronico", length = 100)
    private String correoElectronico;

    // Constructor por defecto
    public Distribuidora() {
    }

    // Constructor con parámetros
    public Distribuidora(String cuit, String nombre, String direccion, String numeroTelefono, String descripcion, String codigoPostal, String correoElectronico) {
        this.id = cuit;
        this.nombre = nombre;
        this.direccion = direccion;
        this.numeroTelefono = numeroTelefono;
        this.descripcion = descripcion;
        this.codigoPostal = codigoPostal;
        this.correoElectronico = correoElectronico;
    }

    // Getters y Setters

    @JsonProperty("id")
    public String GetCuit() {
        return id;
    }

    @JsonProperty("id")
    public void SetCuit(String cuit) {
        this.id = cuit;
    }

    @JsonProperty("nombre")
    public String GetNombre() {
        return nombre;
    }

    @JsonProperty("nombre")
    public void SetNombre(String nombre) {
        this.nombre = nombre;
    }

    @JsonProperty("direccion")
    public String GetDireccion() {
        return direccion;
    }

    @JsonProperty("direccion")
    public void SetDireccion(String direccion) {
        this.direccion = direccion;
    }

    @JsonProperty("numeroTelefono")
    public String GetNumeroTelefono() {
        return numeroTelefono;
    }

    @JsonProperty("numeroTelefono")
    public void SetNumeroTelefono(String numeroTelefono) {
        this.numeroTelefono = numeroTelefono;
    }

    @JsonProperty("descripcion")
    public String GetDescripcion() {
        return descripcion;
    }

    @JsonProperty("descripcion")
    public void SetDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    @JsonProperty("codigoPostal")
    public String GetCodigoPostal() {
        return codigoPostal;
    }

    @JsonProperty("codigoPostal")
    public void SetCodigoPostal(String codigoPostal) {
        this.codigoPostal = codigoPostal;
    }

    @JsonProperty("correoElectronico")
    public String GetCorreoElectronico() {
        return correoElectronico;
    }

    @JsonProperty("correoElectronico")
    public void SetCorreoElectronico(String correoElectronico) {
        this.correoElectronico = correoElectronico;
    }

    @Override
    public String toString() {
        return "Distribuidora{" +
                "cuit='" + id + '\'' +
                ", nombre='" + nombre + '\'' +
                ", direccion='" + direccion + '\'' +
                ", numeroTelefono='" + numeroTelefono + '\'' +
                ", descripcion='" + descripcion + '\'' +
                ", codigoPostal='" + codigoPostal + '\'' +
                ", correoElectronico='" + correoElectronico + '\'' +
                '}';
    }
}
