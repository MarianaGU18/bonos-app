package com.bonos.backend.config;

import com.bonos.backend.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 🔥 CONFIGURACIÓN CORS CORRECTA
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true);
        config.setAllowedOrigins(List.of("http://localhost:3000", "https://bonos-app-mu.vercel.app"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }

    @Bean

    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .cors(withDefaults())
            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth

                .requestMatchers(
                    "/api/v1/auth/**",
                    "/api/bonos/calcular",
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html"
                ).permitAll()

                // 🔒 CETES PROTEGIDO
                .requestMatchers("/api/v1/cetes/**")
                .hasAnyAuthority(
                        "ROLE_USER",
                        "ROLE_ADMIN",
                        "ROLE_COLABORADOR"
                )

                // 🔒 BONOS PROTEGIDO
                .requestMatchers("/api/v1/bonos/**")
                .hasAnyAuthority(
                        "ROLE_USER",
                        "ROLE_ADMIN",
                        "ROLE_COLABORADOR"
                )

                // 🔒 BONOS ACTIVOS PROTEGIDO
                .requestMatchers("/api/v1/bonos-activos/**")
                .hasAnyAuthority(
                        "ROLE_USER",
                        "ROLE_ADMIN",
                        "ROLE_COLABORADOR"
                )

                // 🔒 PORTAFOLIO PROTEGIDO
                .requestMatchers("/api/v1/portafolio/**")
                .authenticated()

                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/v1/colab/**").hasRole("COLABORADOR")
                .requestMatchers("/api/v1/user/**").hasRole("USER")

                .anyRequest().authenticated()
            )

            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)

            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable());

        return http.build();
    }
}