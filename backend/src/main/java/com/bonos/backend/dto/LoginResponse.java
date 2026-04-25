package com.bonos.backend.dto;
public class LoginResponse {

    private String token;
    private String refreshToken;
    private String message;
    private String mail;
    private String role;

    public LoginResponse() {}

    public LoginResponse(String token, String refreshToken, String message, String role, String mail) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.message = message;
        this.mail = mail;
        this.role = role;   
    }

    //  Getters
    public String getToken() { return token; }
    public String getRefreshToken() { return refreshToken; }
    public String getMessage() { return message; }
    public String getMail() { return mail; }
    public String getRole() { return role; }
    
    //  Setters
    public void setToken(String token) { this.token = token; }  
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    public void setMessage(String message) { this.message = message; }
    public void setMail(String mail) { this.mail = mail; }
    public void setRole(String role) { this.role = role; }

}