package com.bonos.backend.dto;
public class LoginResponse {

    private String token;
    private String refreshToken;
    private String message;
    private String email;
    private String role;

    public LoginResponse() {}

    public LoginResponse(String token, String refreshToken, String message, String role, String email) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.message = message;
        this.email = email;
        this.role = role;   
    }

    //  Getters
    public String getToken() { return token; }
    public String getRefreshToken() { return refreshToken; }
    public String getMessage() { return message; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    
    //  Setters
    public void setToken(String token) { this.token = token; }  
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    public void setMessage(String message) { this.message = message; }
    public void setEmail(String email) { this.email = email; }
    public void setRole(String role) { this.role = role; }

}