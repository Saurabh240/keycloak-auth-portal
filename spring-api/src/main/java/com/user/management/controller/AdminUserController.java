package com.user.management.controller;

import com.user.management.model.AppMetadata;
import com.user.management.model.UserDto;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.Response;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.RoleMappingResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.ClientRepresentation;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
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
    private static final Map<String, AppMetadata> APP_METADATA = Map.of(
            "custom-app", new AppMetadata("Custom Application", "https://custom-app.example.com"),
            "frappe-app", new AppMetadata("Frappe ERP", "https://frappe.example.com")
    );

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

        if (userDto.getPassword() != null) {
            CredentialRepresentation credential = new CredentialRepresentation();
            credential.setType(CredentialRepresentation.PASSWORD);
            credential.setValue(userDto.getPassword());
            credential.setTemporary(false);
            user.setCredentials(Collections.singletonList(credential));
        }

        Response response = keycloak.realm(realm).users().create(user);

        if (response.getStatus() == 201 && userDto.getRoles() != null && !userDto.getRoles().isEmpty()) {
            String userId = response.getLocation().getPath().replaceAll(".*/([^/]+)$", "$1");
            RoleMappingResource roleMapping = keycloak.realm(realm).users().get(userId).roles();
            for (String roleName : userDto.getRoles()) {
                RoleRepresentation role = keycloak.realm(realm).roles().get(roleName).toRepresentation();
                roleMapping.realmLevel().add(Collections.singletonList(role));
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        keycloak.realm(realm).users().delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateUser(@PathVariable String id, @RequestBody UserDto userDto) {
        UserResource userResource = keycloak.realm(realm).users().get(id);
        UserRepresentation user = userResource.toRepresentation();
        user.setEmail(userDto.getEmail());
        user.setUsername(userDto.getUsername());
        userResource.update(user);

        if (userDto.getRoles() != null) {
            RoleMappingResource roleMapping = userResource.roles();
            roleMapping.realmLevel().remove(roleMapping.realmLevel().listAll());
            for (String roleName : userDto.getRoles()) {
                RoleRepresentation role = keycloak.realm(realm).roles().get(roleName).toRepresentation();
                roleMapping.realmLevel().add(Collections.singletonList(role));
            }
        }

        return ResponseEntity.ok().build();
    }

    @GetMapping("/{username}/details")
    public ResponseEntity<?> getUserWithRolesByUsername(@PathVariable String username) {
        try {
            RealmResource realmResource = keycloak.realm(realm);
            List<UserRepresentation> foundUsers = realmResource.users().search(username);
            if (foundUsers.isEmpty()) return ResponseEntity.notFound().build();

            UserRepresentation user = foundUsers.get(0);
            String userId = user.getId();

            Map<String, Object> result = new HashMap<>();
            result.put("user", user);

            // Realm roles
            List<RoleRepresentation> realmRoles = realmResource.users().get(userId)
                    .roles()
                    .realmLevel()
                    .listAll();
            result.put("realmRoles", realmRoles.stream().map(RoleRepresentation::getName).toList());

            // Client roles
            Map<String, List<String>> clientRolesMap = new HashMap<>();

            for (String clientAlias : APP_METADATA.keySet()) {
                List<ClientRepresentation> clients = realmResource.clients().findByClientId(clientAlias);
                if (!clients.isEmpty()) {
                    String clientUuid = clients.get(0).getId();

                    List<RoleRepresentation> clientRoles = realmResource.users().get(userId)
                            .roles()
                            .clientLevel(clientUuid)
                            .listAll();

                    if (!clientRoles.isEmpty()) {
                        clientRolesMap.put(clientAlias, clientRoles.stream().map(RoleRepresentation::getName).toList());
                    }
                }
            }

            result.put("clientRoles", clientRolesMap);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/apps")
    public ResponseEntity<Map<String, Object>> getUserApps(@PathVariable String id) {
        RealmResource realmResource = keycloak.realm(realm);
        UserRepresentation user = realmResource.users().get(id).toRepresentation();

        // Collect realm roles
        List<String> realmRoles = realmResource.users().get(id).roles().realmLevel().listAll().stream()
                .map(RoleRepresentation::getName)
                .toList();

        // Collect client roles for configured apps
        Map<String, Object> result = new HashMap<>();
        result.put("user", user);
        result.put("realmRoles", realmRoles);

        List<Map<String, Object>> apps = new ArrayList<>();

        for (String clientAlias : APP_METADATA.keySet()) {
            List<ClientRepresentation> clients = realmResource.clients().findByClientId(clientAlias);
            if (!clients.isEmpty()) {
                String clientUuid = clients.get(0).getId();

                List<RoleRepresentation> clientRoles = realmResource.users().get(id)
                        .roles()
                        .clientLevel(clientUuid)
                        .listAll();

                List<String> roleNames = clientRoles.stream().map(RoleRepresentation::getName).toList();

                if (!roleNames.isEmpty()) {
                    Map<String, Object> app = new HashMap<>();
                    AppMetadata meta = APP_METADATA.get(clientAlias);

                    app.put("clientId", clientAlias);
                    app.put("name", meta.name());
                    app.put("url", meta.url());
                    app.put("roles", roleNames);

                    apps.add(app);
                }
            }
        }

        result.put("apps", apps);
        return ResponseEntity.ok(result);
    }

}