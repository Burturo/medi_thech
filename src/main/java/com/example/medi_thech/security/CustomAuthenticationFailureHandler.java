package com.example.medi_thech.security;

import com.example.medi_thech.entities.User;
import com.example.medi_thech.services.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Log4j2
@Component
public class CustomAuthenticationFailureHandler implements AuthenticationFailureHandler {

    @Autowired
    private UserService utilisateurService; // Service pour gérer les utilisateurs
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        String username = request.getParameter("username");
        log.info("Tentative de connexion échouée pour l'utilisateur: {}", username);

        User utilisateur = utilisateurService.getUserByUsername(username); // Récupérer l'utilisateur par login

        if (utilisateur != null) {
            int failedAttempts = utilisateur.getTentative();
            log.warn("Tentatives de connexion échouées précédentes pour {}: {}", username, failedAttempts);

            // Incrémenter le compteur de tentatives échouées
            utilisateur.setTentative(failedAttempts + 1);
            log.info("Incrémentation des tentatives de connexion pour {}: {}", username, utilisateur.getTentative());

            // Vérifier si le compte doit être suspendu après un certain nombre de tentatives
            boolean isBlocked = utilisateur.getTentative() >= 5;
            if (isBlocked) {
                utilisateur.setStatus(false); // Suspendre le compte
                log.warn("Le compte de l'utilisateur {} a été suspendu après plusieurs tentatives échouées.", username);
            }

            // Enregistrer les modifications de l'utilisateur une seule fois
            utilisateurService.updateUser(utilisateur);
            log.info("État de l'utilisateur {} enregistré avec {} tentatives échouées.", username, utilisateur.getTentative());

            // Rediriger vers la page de login avec le paramètre approprié
            String redirectUrl = isBlocked ? "/login?blocked" : "/login?denied";
            log.info("Redirection vers {} en raison de la tentative échouée.", redirectUrl);
            response.sendRedirect(redirectUrl);

        } else {
            log.warn("Aucun utilisateur trouvé avec le nom d'utilisateur: {}", username);
            response.sendRedirect("/login?denied");
        }
    }}
