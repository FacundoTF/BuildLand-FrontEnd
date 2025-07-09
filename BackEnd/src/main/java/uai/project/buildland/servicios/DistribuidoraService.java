package uai.project.buildland.servicios;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uai.project.buildland.entidades.Distribuidora;
import uai.project.buildland.repositorios.DistribuidoraRepository;

import java.util.List;
import java.util.Optional;

/**
 * Servicio para manejar la lógica de negocio de las distribuidoras
 */
@Service
public class DistribuidoraService {
    
    @Autowired
    private DistribuidoraRepository distribuidoraRepository;
    
    /**
     * Obtiene todas las distribuidoras
     * @return Lista de distribuidoras
     */
    public List<Distribuidora> obtenerTodas() {
        return distribuidoraRepository.findAll();
    }
    
    /**
     * Obtiene una distribuidora por ID
     * @param id ID de la distribuidora
     * @return Distribuidora encontrada o Optional vacío
     */
    public Optional<Distribuidora> obtenerPorId(Long id) {
        return distribuidoraRepository.findById(id);
    }
    
    /**
     * Crea una nueva distribuidora
     * @param distribuidora Distribuidora a crear
     * @return Distribuidora creada con ID asignado
     */
    public Distribuidora crear(Distribuidora distribuidora) {
        // Validar que no exista una distribuidora con el mismo nombre
        if (distribuidoraRepository.existsByNombreIgnoreCase(distribuidora.getNombre())) {
            throw new IllegalArgumentException("Ya existe una distribuidora con el nombre: " + distribuidora.getNombre());
        }
        
        return distribuidoraRepository.save(distribuidora);
    }
    
    /**
     * Actualiza una distribuidora existente
     * @param id ID de la distribuidora a actualizar
     * @param distribuidoraActualizada Datos actualizados
     * @return Distribuidora actualizada o Optional vacío si no existe
     */
    public Optional<Distribuidora> actualizar(Long id, Distribuidora distribuidoraActualizada) {
        Optional<Distribuidora> distribuidoraExistente = distribuidoraRepository.findById(id);
        
        if (distribuidoraExistente.isPresent()) {
            distribuidoraActualizada.setId(id);
            return Optional.of(distribuidoraRepository.save(distribuidoraActualizada));
        }
        
        return Optional.empty();
    }
    
    /**
     * Elimina una distribuidora por ID
     * @param id ID de la distribuidora a eliminar
     * @return true si se eliminó, false si no existía
     */
    public boolean eliminar(Long id) {
        if (distribuidoraRepository.existsById(id)) {
            distribuidoraRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    /**
     * Busca distribuidoras por nombre
     * @param nombre Texto a buscar en el nombre
     * @return Lista de distribuidoras que contienen el texto
     */
    public List<Distribuidora> buscarPorNombre(String nombre) {
        return distribuidoraRepository.findByNombreContainingIgnoreCase(nombre);
    }
}
