package uai.project.buildland.entidades;

import jakarta.persistence.*;

/**
 * Entidad que representa una distribuidora en el sistema BuildLand
 */
@Entity
@Table(name = "distribuidoras")
public class Distribuidora {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;
    
    @Column(name = "direccion", length = 200)
    private String direccion;
    
    @Column(name = "numero_telefono", length = 20)
    private String numeroTelefono;

    // Constructor por defecto
    public Distribuidora() {
    }

    // Constructor con parámetros
    public Distribuidora(String nombre, String direccion, String numeroTelefono) {
        this.nombre = nombre;
        this.direccion = direccion;
        this.numeroTelefono = numeroTelefono;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    @Override
    public String toString() {
        return "Distribuidora{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                ", direccion='" + direccion + '\'' +
                ", numeroTelefono='" + numeroTelefono + '\'' +
                '}';
    }
}
