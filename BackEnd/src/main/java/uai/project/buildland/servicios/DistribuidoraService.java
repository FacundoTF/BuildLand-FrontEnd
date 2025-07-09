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
     * Obtiene una distribuidora por ID (CUIT)
     * @param cuit CUIT de la distribuidora
     * @return Distribuidora encontrada o Optional vacío
     */
    public Optional<Distribuidora> obtenerPorId(String cuit) {
        return distribuidoraRepository.findById(cuit);
    }
    
    /**
     * Crea una nueva distribuidora
     * @param distribuidora Distribuidora a crear
     * @return Distribuidora creada
     */
    public Distribuidora crear(Distribuidora distribuidora) {
        // Validar el formato del CUIT
        if (!validarCuit(distribuidora.getId())) {
            throw new IllegalArgumentException("El CUIT debe tener exactamente 8 dígitos");
        }
        
        // Validar que no exista una distribuidora con el mismo CUIT
        if (distribuidoraRepository.existsById(distribuidora.getId())) {
            throw new IllegalArgumentException("Ya existe una distribuidora con el CUIT: " + distribuidora.getId());
        }
        
        // Validar que no exista una distribuidora con el mismo nombre
        if (distribuidoraRepository.existsByNombreIgnoreCase(distribuidora.getNombre())) {
            throw new IllegalArgumentException("Ya existe una distribuidora con el nombre: " + distribuidora.getNombre());
        }
        
        // Validar descripción (solo si no es null y no está vacía)
        if (distribuidora.getDescripcion() != null && 
            !distribuidora.getDescripcion().trim().isEmpty() && 
            distribuidora.getDescripcion().length() > 120) {
            throw new IllegalArgumentException("La descripción no puede exceder 120 caracteres");
        }
        
        // Validar código postal (solo si no es null y no está vacío)
        if (distribuidora.getCodigoPostal() != null && 
            !distribuidora.getCodigoPostal().trim().isEmpty() && 
            !validarCodigoPostal(distribuidora.getCodigoPostal())) {
            throw new IllegalArgumentException("El código postal debe tener exactamente 4 dígitos");
        }
        
        return distribuidoraRepository.save(distribuidora);
    }
    
    /**
     * Actualiza una distribuidora existente
     * @param cuit CUIT de la distribuidora a actualizar
     * @param distribuidoraActualizada Datos actualizados
     * @return Distribuidora actualizada o Optional vacío si no existe
     */
    public Optional<Distribuidora> actualizar(String cuit, Distribuidora distribuidoraActualizada) {
        Optional<Distribuidora> distribuidoraExistente = distribuidoraRepository.findById(cuit);
        
        if (distribuidoraExistente.isPresent()) {
            // Validar descripción (solo si no es null y no está vacía)
            if (distribuidoraActualizada.getDescripcion() != null && 
                !distribuidoraActualizada.getDescripcion().trim().isEmpty() && 
                distribuidoraActualizada.getDescripcion().length() > 120) {
                throw new IllegalArgumentException("La descripción no puede exceder 120 caracteres");
            }
            
            // Validar código postal (solo si no es null y no está vacío)
            if (distribuidoraActualizada.getCodigoPostal() != null && 
                !distribuidoraActualizada.getCodigoPostal().trim().isEmpty() && 
                !validarCodigoPostal(distribuidoraActualizada.getCodigoPostal())) {
                throw new IllegalArgumentException("El código postal debe tener exactamente 4 dígitos");
            }
            
            distribuidoraActualizada.setId(cuit);
            return Optional.of(distribuidoraRepository.save(distribuidoraActualizada));
        }
        
        return Optional.empty();
    }
    
    /**
     * Elimina una distribuidora por ID (CUIT)
     * @param cuit CUIT de la distribuidora a eliminar
     * @return true si se eliminó, false si no existía
     */
    public boolean eliminar(String cuit) {
        if (distribuidoraRepository.existsById(cuit)) {
            distribuidoraRepository.deleteById(cuit);
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
    
    /**
     * Valida que el CUIT tenga exactamente 8 dígitos
     * @param cuit CUIT a validar
     * @return true si es válido, false en caso contrario
     */
    private boolean validarCuit(String cuit) {
        return cuit != null && cuit.matches("\\d{8}");
    }
    
    /**
     * Valida que el código postal tenga exactamente 4 dígitos
     * @param codigoPostal Código postal a validar
     * @return true si es válido, false en caso contrario
     */
    private boolean validarCodigoPostal(String codigoPostal) {
        return codigoPostal != null && codigoPostal.matches("\\d{4}");
    }
}
