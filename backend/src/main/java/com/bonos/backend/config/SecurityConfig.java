package com.bonos.backend.config;

import com.bonos.backend.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()

                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/v1/colab/**").hasRole("COLABORADOR")
                .requestMatchers("/api/v1/user/**").hasRole("USER")

                .anyRequest().authenticated()
            )
                        /*.authorizeHttpRequests(auth -> auth
                // 🔓 públicos
                .requestMatchers(
                    "/api/v1/auth/**",
                    "/api/v1/cetes/**"
                ).permitAll()

                // 🔒 protegidos
                .anyRequest().authenticated()
            )*/

            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)

            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable());

        return http.build();
    }
}