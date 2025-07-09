package uai.project.buildland.entidades;

import jakarta.persistence.*;

/**
 * Entidad que representa una distribuidora en el sistema BuildLand
 */
@Entity
@Table(name = "DISTRIBUIDORAS")
public class Distribuidora {
    
    @Id
    @Column(name = "CuitDistribuidora", nullable = false, length = 8)
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

    // Constructor por defecto
    public Distribuidora() {
    }

    // Constructor con parámetros
    public Distribuidora(String cuit, String nombre, String direccion, String numeroTelefono, String descripcion, String codigoPostal) {
        this.id = cuit;
        this.nombre = nombre;
        this.direccion = direccion;
        this.numeroTelefono = numeroTelefono;
        this.descripcion = descripcion;
        this.codigoPostal = codigoPostal;
    }

    // Getters y Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCuit() {
        return id;
    }

    public void setCuit(String cuit) {
        this.id = cuit;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getNumeroTelefono() {
        return numeroTelefono;
    }

    public void setNumeroTelefono(String numeroTelefono) {
        this.numeroTelefono = numeroTelefono;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getCodigoPostal() {
        return codigoPostal;
    }

    public void setCodigoPostal(String codigoPostal) {
        this.codigoPostal = codigoPostal;
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
                '}';
    }
}
