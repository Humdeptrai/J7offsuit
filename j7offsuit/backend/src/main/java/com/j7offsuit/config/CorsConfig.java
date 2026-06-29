package com.j7offsuit.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {
    @Value("${app.cors.allowed-origin-patterns}")
    private String allowedOriginPatterns;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        List<String> originPatterns = Arrays.stream(allowedOriginPatterns.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .toList();

        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOriginPatterns(originPatterns.toArray(String[]::new))
                        .allowedMethods("GET", "POST", "PATCH", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }
}
