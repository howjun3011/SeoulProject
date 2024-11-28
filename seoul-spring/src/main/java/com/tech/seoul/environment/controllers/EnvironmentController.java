package com.tech.seoul.environment.controllers;

import com.tech.seoul.environment.service.EnvironmentService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/Environment")
public class EnvironmentController {
    private EnvironmentService environmentService;

}
