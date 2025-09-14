package com.example.medi_thech.configs;

import com.example.medi_thech.security.CsrfCookieFilter;
import com.example.medi_thech.security.CustomAuthenticationFailureHandler;
import com.example.medi_thech.security.CustomAuthenticationSuccessHandler;
import com.example.medi_thech.security.SpaCsrfTokenRequestHandler;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.SessionManagementConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.session.HttpSessionEventPublisher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@Log4j2
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf((csrf) -> csrf
                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                        .csrfTokenRequestHandler(new SpaCsrfTokenRequestHandler())
                )
                .addFilterAfter(new CsrfCookieFilter(), BasicAuthenticationFilter.class)
                .authorizeHttpRequests(requests -> requests
                        .requestMatchers("/", "/login", "/css/**", "/images/**", "/vendors/**", "/js/**", "/webjars/**", "/h2-console/**").permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionFixation(SessionManagementConfigurer.SessionFixationConfigurer::migrateSession) // Crée une nouvelle session après chaque connexion pour éviter la fixation de session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) // Crée la session si nécessaire
                        .maximumSessions(1) // Limite le nombre de sessions par utilisateur
                        .maxSessionsPreventsLogin(true) // Empêche la connexion si le nombre max de sessions est atteint
                        .sessionRegistry(sessionRegistry())
                )
                .formLogin(form -> form
                        .loginPage("/login")
                        .successHandler(customAuthenticationSuccessHandler())
                        .failureHandler(customAuthenticationFailureHandler()))
                .logout(logout -> logout
                        .logoutUrl("/logout") // Optional, default is `/logout`
                        .logoutSuccessUrl("/login?logout")
                        .invalidateHttpSession(true)
                        .clearAuthentication(true))
                .exceptionHandling(exceptionHandlingConfigurer -> exceptionHandlingConfigurer
                        .accessDeniedPage("/login?denied"));

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    //todo : gestion du corsConfig
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // Permet les identifiants de session (cookies, autorisation)
        config.setAllowCredentials(true);

        // Ajoute des domaines spécifiques autorisés
        config.addAllowedOrigin("https://cdnjs.cloudflare.com");
        config.addAllowedOrigin("https://oss.maxcdn.com");
        config.addAllowedOrigin("https://fonts.googleapis.com");
        config.addAllowedOrigin("https://www.google.com");

        // Autoriser uniquement les en-têtes requis
        config.addAllowedHeader("Content-Type");
        config.addAllowedHeader("Authorization");
        config.addAllowedHeader("Accept");

        // Autoriser les méthodes spécifiques utilisées par votre application
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");

        // Applique la configuration pour tous les chemins de votre application
        source.registerCorsConfiguration("/**", config);

        // En cas d'erreur, une exception est levée avec un message
        return new CorsFilter(source);
    }


    //todo : gestion du customAuthenticationFailureHandler pour les connéxsion reussi
    @Bean
    public CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler() {
        try {
            return new CustomAuthenticationSuccessHandler();
        } catch (Exception e) {
            log.error("Error configuring customAuthenticationSuccessHandler", e);
            throw new RuntimeException(e);
        }
    }

    //todo : gestion du CustomAuthenticationFailureHandler pour les connéxsion échouer
    @Bean
    public CustomAuthenticationFailureHandler customAuthenticationFailureHandler() {
        try {
            return new CustomAuthenticationFailureHandler();
        } catch (Exception e) {
            log.error("Error configuring customAuthenticationFailureHandler", e);
            throw new RuntimeException(e);
        }
    }

    /**
     * Bean de configuration pour la gestion des sessions utilisateur dans Spring Security.
     * Le {@link SessionRegistry} est utilisé pour stocker et suivre les sessions
     * des utilisateurs authentifiés. Cela permet également de gérer les sessions
     * concurrentes et de savoir qui est connecté à tout moment.
     *
     * @return une instance de {@link SessionRegistryImpl} qui est utilisée pour gérer
     * la liste des sessions actives des utilisateurs dans l'application.
     */
    @Bean
    public SessionRegistry sessionRegistry() {
        return new SessionRegistryImpl();
    }

    /**
     * Bean pour publier les événements liés aux sessions HTTP.
     * Le {@link HttpSessionEventPublisher} permet de détecter et de gérer les événements
     * liés aux sessions, comme la création ou la destruction de celles-ci.
     * Cela est utile notamment pour les fonctionnalités de gestion de session,
     * comme la déconnexion automatique ou la gestion des sessions concurrentes.
     *
     * @return une instance de {@link HttpSessionEventPublisher} pour écouter les événements
     * de session dans l'application.
     */
    @Bean
    public HttpSessionEventPublisher httpSessionEventPublisher() {
        return new HttpSessionEventPublisher();
    }


}
