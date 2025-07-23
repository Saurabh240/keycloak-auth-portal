package com.user.management.model;

import java.util.List;
import java.util.Map;

public class UserDto {
    private String username;
    private String email;
    private String password;
    private Map<String, List<String>> clientRoles;

    public String getUsername() { return username; }

    public String getEmail() { return email; }

    public String getPassword() { return password; }

    public Map<String, List<String>> getClientRoles() {
        return clientRoles;
    }
}