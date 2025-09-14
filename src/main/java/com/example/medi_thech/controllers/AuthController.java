package com.example.medi_thech.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Log4j2
@Controller
@RequiredArgsConstructor
public class AuthController {

    @GetMapping({"/login", "/"})
    public String login() {
        return "authentification/login";
    }

    @GetMapping("/forgot-password")
    public String forgotPassword() {
        return "authentification/forgot-password";
    }


}
