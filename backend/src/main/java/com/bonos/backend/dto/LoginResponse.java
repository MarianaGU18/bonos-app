package com.bonos.backend.dto;
public class LoginResponse {

    private String token;
    private String message;
    private String mail;
    private String role;

    public LoginResponse(String token, String message, String mail, String role) {
        this.token = token;
        this.message = message;
        this.mail = mail;
        this.role = role;   
    }

    public String getToken() { return token; }
    public String getMessage() { return message; }
    public String getMail() { return mail; }
    public String getRole() { return role; }
}