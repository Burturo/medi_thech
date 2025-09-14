package com.example.medi_thech.configs;

import com.example.medi_thech.entities.User;
import com.example.medi_thech.enums.UserRole;
import com.example.medi_thech.repositories.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@Log4j2
@Configuration
@RequiredArgsConstructor
public class InitialCreateAdminConfig {

    /**
     * Repository pour les opérations sur les utilisateurs.
     */
    private final UserRepository userRepository;

    /**
     * Encodeur de mots de passe pour encoder les mots de passe en toute sécurité.
     */
    private final PasswordEncoder passwordEncoder;

    /**
     * Méthode appelée après l'initialisation du contexte Spring pour créer automatiquement
     * <p>
     * un utilisateur avec le rôle "admin" s'il n'existe aucun utilisateur avec ce rôle dans la base de données.
     *
     * <p>
     * Cette méthode est annotée avec {@link PostConstruct}, ce qui signifie qu'elle est exécutée
     * automatiquement une fois que le bean est créé et injecté par Spring.
     * </p>
     */
    @PostConstruct
    public void createAdminUser() {
        try {
            // Vérifier s'il existe déjà un utilisateur avec le rôle "admin"
            Optional<User> existingAdmin = userRepository.findFirstByUsernameAndRole("admin", UserRole.ADMIN);

            if (existingAdmin.isEmpty()) {
                // Créer l'utilisateur admin
                User adminUser = new User();
                adminUser.setUsername("admin");
                adminUser.setNom("admin");
                adminUser.setPrenom("admin");
                String password = passwordEncoder.encode("1234");
                adminUser.setPassword(password); // Encodage du mot de passe
                adminUser.setRole(UserRole.ADMIN);
                adminUser.setStatus(true); // Compte activé
                adminUser.setFirstLogin(false);
                // Sauvegarder l'utilisateur admin dans la base de données
                userRepository.save(adminUser);
                log.info("Utilisateur admin créé avec succès : {}", adminUser.getUsername());
            }
        } catch (Exception e) {
            log.error("Erreur lors de la création de l'utilisateur admin", e);
        }
    }
}


