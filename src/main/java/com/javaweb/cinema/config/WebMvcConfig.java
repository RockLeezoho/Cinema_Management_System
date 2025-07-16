package com.javaweb.cinema.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${upload.path}")
    private String uploadPath;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/customer/**")
                .addResourceLocations("classpath:/static/customer/");

        registry.addResourceHandler("/admin/**")
                .addResourceLocations("classpath:/static/admin/");

        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/static/images/");

        registry.addResourceHandler("/images/users/**")
                .addResourceLocations("file:" + System.getProperty("user.dir").replace("\\", "/") + "/upload/users/");

        registry.addResourceHandler("/images/movies/**")
                .addResourceLocations("file:" + System.getProperty("user.dir").replace("\\", "/") + "/upload/movies/");

        registry.addResourceHandler("/images/cinemas/**")
                .addResourceLocations("file:" + System.getProperty("user.dir").replace("\\", "/") + "/upload/cinemas/");

        registry.addResourceHandler("/images/rooms/**")
                .addResourceLocations("file:" + System.getProperty("user.dir").replace("\\", "/") + "/upload/rooms/");

        registry.addResourceHandler("/images/seats/**")
                .addResourceLocations("file:" + System.getProperty("user.dir").replace("\\", "/") + "/upload/seats/");

        registry.addResourceHandler("/images/vouchers/**")
                .addResourceLocations("file:" + System.getProperty("user.dir").replace("\\", "/") + "/upload/vouchers/");

        registry.addResourceHandler("/images/concessions/**")
                .addResourceLocations("file:" + System.getProperty("user.dir").replace("\\", "/") + "/upload/concessions/");
    }

}
