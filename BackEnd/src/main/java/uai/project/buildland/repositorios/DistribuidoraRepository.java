package uai.project.buildland.repositorios;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uai.project.buildland.entidades.Distribuidora;

/**
 * Repositorio para manejar las operaciones de base de datos de las distribuidoras
 */
@Repository
public interface DistribuidoraRepository extends JpaRepository<Distribuidora, Long> {
    
    /**
     * Busca distribuidoras por nombre (case insensitive)
     * @param nombre Nombre a buscar
     * @return Lista de distribuidoras que contienen el nombre
     */
    boolean existsByNombreIgnoreCase(String nombre);
    
    /**
     * Busca distribuidoras que contengan el texto en el nombre
     * @param nombre Texto a buscar en el nombre
     * @return Lista de distribuidoras
     */
    java.util.List<Distribuidora> findByNombreContainingIgnoreCase(String nombre);
}
