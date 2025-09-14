package com.example.medi_thech.security;

import com.example.medi_thech.entities.User;
import com.example.medi_thech.enums.UserRole;
import com.example.medi_thech.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;


@Component
@Log4j2
public class CustomAuthenticationSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    @Autowired
    private UserService userService; // Service pour gérer les utilisateurs


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        try {
            String username = authentication != null ? authentication.getName() : "Utilisateur anonyme";
            log.info("Authentification réussie pour l'utilisateur : {}", username);

            // Récupérer l'utilisateur connecté via son login
            User utilisateur = userService.getUserByUsername(username);

            if (utilisateur != null) {
                // Réinitialiser les tentatives de connexion échouées
                utilisateur.setTentative(0);
                log.info("Réinitialisation des tentatives échouées pour l'utilisateur : {}", username);

                // Enregistrer les modifications de l'utilisateur
                userService.updateUser(utilisateur);
                log.info("Utilisateur sauvegardé avec les nouvelles informations : {}", utilisateur.getUsername());
            } else {
                log.warn("Aucun utilisateur trouvé pour le nom d'utilisateur : {}", username);
            }

            // Gérer la redirection après connexion réussie
            handle(request, response, authentication);
            // Effacer les attributs d'authentification de la requête
            clearAuthenticationAttributes(request);
            log.info("Attributs d'authentification effacés pour l'utilisateur : {}", username);

        } catch (IOException e) {
            log.error("Erreur lors du traitement de l'authentification réussie pour l'utilisateur : {}, erreur : {}", authentication.getName(), e.getMessage());
            throw new RuntimeException(e);
        }
    }

    protected void handle(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        try {
            // Déterminer l'URL de redirection en fonction de l'utilisateur authentifié
            String targetUrl = determineTargetUrl(authentication, request);
            log.info("Redirection de l'utilisateur {} vers l'URL : {}", authentication.getName(), targetUrl);

            // Vérifier si la réponse est déjà commise, dans ce cas, on ne fait pas de redirection
            if (response.isCommitted()) {
                log.warn("La réponse est déjà commise pour l'utilisateur {}, aucune redirection effectuée.", authentication.getName());
                return;
            }

            // Rediriger l'utilisateur vers l'URL cible déterminée
            getRedirectStrategy().sendRedirect(request, response, targetUrl);
            log.info("Redirection réussie pour l'utilisateur {}.", authentication.getName());

        } catch (IOException e) {
            // Gérer les erreurs de redirection
            log.error("Erreur lors de la redirection de l'utilisateur {} : {}", authentication.getName(), e.getMessage());
            throw new RuntimeException(e);
        }
    }

    protected String determineTargetUrl(Authentication authentication, HttpServletRequest request) {
        try {
            // Récupérer l'utilisateur par son login
            User utilisateur = userService.getUserByUsername(authentication.getName());
            if (utilisateur != null) {

                // Vérification si le compte de l'utilisateur est suspendu
                if (!utilisateur.getStatus()) {
                    log.warn("Utilisateur {} a essayé de se connecter mais son compte est suspendu.", utilisateur.getUsername());
                    return "login?blocked"; // Redirection vers une page d'avertissement
                }

                // Vérification si c'est la première connexion
                if (utilisateur.getFirstLogin() == null || utilisateur.getFirstLogin()) {
                    log.info("Utilisateur {} redirigé vers la page de vérification pour sa première connexion.", utilisateur.getUsername());
                    return "account/verify"; // Redirection vers la page de vérification
                }

                // Déterminer la redirection en fonction du rôle utilisateur
                if (utilisateur.getRole() == UserRole.ADMIN) {
                    log.info("Utilisateur {} (ADMIN) redirigé vers le tableau de bord administrateur.", utilisateur.getUsername());
                    return "dashboard";
                } else if (utilisateur.getRole() == UserRole.DOCTOR) {
                    log.info("Utilisateur {} redirigé vers le tableau de bord utilisateur.", utilisateur.getUsername());
                    return "dashboard";
                }
            } else {
                log.warn("Aucun utilisateur trouvé avec le nom d'utilisateur : {}", authentication.getName());
            }
        } catch (Exception e) {
            log.error("Une erreur s'est produite lors de la détermination de l'URL cible pour l'utilisateur {} : {}", authentication.getName(), e.getMessage());
        }

        // Redirection par défaut en cas d'erreur ou de rôle inconnu
        log.warn("Redirection par défaut vers la page d'accès refusé pour l'utilisateur {}.", authentication.getName());
        return "login?denied";
    }
}
