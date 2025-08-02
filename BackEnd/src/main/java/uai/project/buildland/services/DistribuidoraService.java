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
        
        // Validar que no exista una distribuidora con el mismo CUIT
        if (distribuidoraRepository.existsById(distribuidora.GetCuit())) {
            throw new IllegalArgumentException("Ya existe una distribuidora con el CUIT: " + distribuidora.GetCuit());
        }
        
        // Validar que no exista una distribuidora con el mismo nombre
        if (distribuidoraRepository.existsByNombreIgnoreCase(distribuidora.GetNombre())) {
            throw new IllegalArgumentException("Ya existe una distribuidora con el nombre: " + distribuidora.GetNombre());
        }

        // Validar que no exista una distribuidora con el mismo correo electrónico
        if (distribuidoraRepository.existsByCorreoElectronicoIgnoreCase(distribuidora.GetCorreoElectronico())) {
            throw new IllegalArgumentException("Ya existe una distribuidora con el correo electrónico: " + distribuidora.GetCorreoElectronico());
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
            distribuidoraActualizada.SetCuit(cuit);
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
        System.out.println("Eliminando distribuidora con CUIT: " + cuit);
        if (distribuidoraRepository.existsById(cuit)) {
            System.out.println("Distribuidora encontrada, procediendo a eliminar.");
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
     * Busca distribuidoras por correo electrónico
     * @param correoElectronico Correo electrónico a buscar
     * @return true si existe una distribuidora con ese correo, false en caso contrario
     */
    public boolean buscarPorCorreoElectronico(String correoElectronico) {
        return distribuidoraRepository.existsByCorreoElectronicoIgnoreCase(correoElectronico);
    }
}
