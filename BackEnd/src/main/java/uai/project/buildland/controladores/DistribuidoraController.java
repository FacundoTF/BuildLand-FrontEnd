package uai.project.buildland.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uai.project.buildland.entidades.Distribuidora;
import uai.project.buildland.servicios.DistribuidoraService;

import java.util.List;
import java.util.Optional;

/**
 * Controlador REST para manejar las operaciones CRUD de distribuidoras
 */
@RestController
@RequestMapping("/api/distribuidoras")
@CrossOrigin(origins = "*")
public class DistribuidoraController {
    
    @Autowired
    private DistribuidoraService distribuidoraService;
    
    /**
     * Obtiene todas las distribuidoras
     * @return Lista de distribuidoras
     */
    @GetMapping
    public ResponseEntity<List<Distribuidora>> obtenerTodas() {
        List<Distribuidora> distribuidoras = distribuidoraService.obtenerTodas();
        return ResponseEntity.ok(distribuidoras);
    }
    
    /**
     * Obtiene una distribuidora por ID (CUIT)
     * @param cuit CUIT de la distribuidora
     * @return Distribuidora encontrada o 404 si no existe
     */
    @GetMapping("/{cuit}")
    public ResponseEntity<Distribuidora> obtenerPorId(@PathVariable String cuit) {
        Optional<Distribuidora> distribuidora = distribuidoraService.obtenerPorId(cuit);
        
        if (distribuidora.isPresent()) {
            return ResponseEntity.ok(distribuidora.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Crea una nueva distribuidora
     * @param distribuidora Distribuidora a crear
     * @return Distribuidora creada con status 201
     */
    @PostMapping
    public ResponseEntity<Distribuidora> crear(@RequestBody Distribuidora distribuidora) {
        try {
            // Validaciones básicas
            if (distribuidora.getNombre() == null || distribuidora.getNombre().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            
            if (distribuidora.getId() == null || distribuidora.getId().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            
            Distribuidora nuevaDistribuidora = distribuidoraService.crear(distribuidora);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaDistribuidora);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Actualiza una distribuidora existente
     * @param cuit CUIT de la distribuidora a actualizar
     * @param distribuidora Datos actualizados
     * @return Distribuidora actualizada o 404 si no existe
     */
    @PutMapping("/{cuit}")
    public ResponseEntity<Distribuidora> actualizar(@PathVariable String cuit, @RequestBody Distribuidora distribuidora) {
        try {
            // Validaciones básicas
            if (distribuidora.getNombre() == null || distribuidora.getNombre().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            
            Optional<Distribuidora> distribuidoraActualizada = distribuidoraService.actualizar(cuit, distribuidora);
            
            if (distribuidoraActualizada.isPresent()) {
                return ResponseEntity.ok(distribuidoraActualizada.get());
            } else {
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Elimina una distribuidora por CUIT
     * @param cuit CUIT de la distribuidora a eliminar
     * @return 204 si se eliminó correctamente, 404 si no existía
     */
    @DeleteMapping("/{cuit}")
    public ResponseEntity<Void> eliminar(@PathVariable String cuit) {
        boolean eliminada = distribuidoraService.eliminar(cuit);
        
        if (eliminada) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Busca distribuidoras por nombre
     * @param nombre Texto a buscar en el nombre
     * @return Lista de distribuidoras que contienen el texto
     */
    @GetMapping("/buscar")
    public ResponseEntity<List<Distribuidora>> buscarPorNombre(@RequestParam String nombre) {
        List<Distribuidora> distribuidoras = distribuidoraService.buscarPorNombre(nombre);
        return ResponseEntity.ok(distribuidoras);
    }
}
