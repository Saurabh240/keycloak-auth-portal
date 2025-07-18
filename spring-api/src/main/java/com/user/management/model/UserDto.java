package com.user.management.model;

import java.util.List;

public class UserDto {
    private String username;
    private String email;
    private String password;
    private List<String> roles;

    public List<String> getRoles() {
        return roles;
    }

    public String getUsername() { return username; }

    public String getEmail() { return email; }

    public String getPassword() { return password; }
}