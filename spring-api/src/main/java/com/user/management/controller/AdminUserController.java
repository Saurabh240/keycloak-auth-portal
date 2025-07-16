package com.user.management.controller;

import com.user.management.model.UserDto;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/admin/users")
public class AdminUserController {

    private final Keycloak keycloak;
    private final String realm;

    public AdminUserController(
            @Value("${keycloak.auth-server-url}") String serverUrl,
            @Value("${keycloak.realm}") String realm,
            @Value("${keycloak.resource}") String clientId,
            @Value("${keycloak.credentials.secret}") String clientSecret
    ) {
        this.keycloak = KeycloakBuilder.builder()
                .serverUrl(serverUrl)
                .realm(realm)
                .clientId(clientId)
                .clientSecret(clientSecret)
                .grantType("client_credentials")
                .build();
        this.realm = realm;
    }

    @GetMapping
    public ResponseEntity<List<UserRepresentation>> getAllUsers() {
        RealmResource realmResource = keycloak.realm(realm);
        UsersResource usersResource = realmResource.users();
        List<UserRepresentation> users = usersResource.list();
        return ResponseEntity.ok(users);
    }

    @PostMapping
    public ResponseEntity<Void> createUser(@RequestBody UserDto userDto) {
        UserRepresentation user = new UserRepresentation();
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setEnabled(true);

        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(userDto.getPassword());
        credential.setTemporary(false);
        user.setCredentials(Collections.singletonList(credential));

        keycloak.realm(realm).users().create(user);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        keycloak.realm(realm).users().delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateUser(@PathVariable String id, @RequestBody UserDto userDto) {
        UserRepresentation user = keycloak.realm(realm).users().get(id).toRepresentation();
        user.setEmail(userDto.getEmail());
        user.setUsername(userDto.getUsername());
        keycloak.realm(realm).users().get(id).update(user);
        return ResponseEntity.ok().build();
    }
}