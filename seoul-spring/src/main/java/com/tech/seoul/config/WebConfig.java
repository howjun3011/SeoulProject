package com.tech.seoul.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
	// [ CORS 허용 설정 ]
	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**")
				.allowedOriginPatterns("*")
				.allowedOrigins("http://localhost:3000")
		        .allowedMethods("GET", "POST", "PUT", "DELETE")
		        .allowedHeaders("Authorization", "Content-Type")
		        .exposedHeaders("Custom-Header")
		        .allowCredentials(true)
		        .maxAge(3600);
	}
	// [ Json 설정 ]
	@Override
	public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
		configurer.defaultContentType(MediaType.APPLICATION_JSON)  				// Default to JSON
		          .favorParameter(true)                            				// Use request parameters for content negotiation
		          .parameterName("mediaType")
		          .ignoreAcceptHeader(true)
		          .useRegisteredExtensionsOnly(false)
		          .mediaType("json", MediaType.APPLICATION_JSON)
		          .mediaType("xml", MediaType.APPLICATION_XML);
	}
	// [ 정적 자원 설정 ]
	@Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");
    }
}
