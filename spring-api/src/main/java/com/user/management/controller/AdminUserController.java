package com.user.management.controller;

import com.user.management.model.UserDto;
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
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        RealmResource realmResource = keycloak.realm(realm);
        UsersResource usersResource = realmResource.users();
        List<UserRepresentation> users = usersResource.list();
        List<ClientRepresentation> clients = realmResource.clients().findAll();

        List<Map<String, Object>> enrichedUsers = new ArrayList<>();

        for (UserRepresentation user : users) {
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("username", user.getUsername());
            userMap.put("email", user.getEmail());
            userMap.put("enabled", user.isEnabled());

            Map<String, List<String>> clientRolesMap = new HashMap<>();
            for (ClientRepresentation client : clients) {
                List<RoleRepresentation> clientRoles = realmResource.users().get(user.getId())
                        .roles().clientLevel(client.getId()).listAll();
                if (!clientRoles.isEmpty()) {
                    List<String> roleNames = clientRoles.stream().map(RoleRepresentation::getName).toList();
                    clientRolesMap.put(client.getClientId(), roleNames);
                }
            }

            userMap.put("clientRoles", clientRolesMap);
            enrichedUsers.add(userMap);
        }

        return ResponseEntity.ok(enrichedUsers);
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

        if (response.getStatus() == 201 && userDto.getClientRoles() != null && !userDto.getClientRoles().isEmpty()) {
            String userId = response.getLocation().getPath().replaceAll(".*/([^/]+)$", "$1");
            UserResource userResource = keycloak.realm(realm).users().get(userId);
            RoleMappingResource roleMapping = userResource.roles();

            for (Map.Entry<String, List<String>> entry : userDto.getClientRoles().entrySet()) {
                String clientId = entry.getKey();
                List<String> roles = entry.getValue();

                List<ClientRepresentation> clients = keycloak.realm(realm).clients().findByClientId(clientId);
                if (!clients.isEmpty()) {
                    String clientUuid = clients.get(0).getId();

                    for (String roleName : roles) {
                        RoleRepresentation role = keycloak.realm(realm).clients().get(clientUuid)
                                .roles().get(roleName).toRepresentation();
                        roleMapping.clientLevel(clientUuid).add(Collections.singletonList(role));
                    }
                }
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateUser(@PathVariable String id, @RequestBody UserDto userDto) {
        RealmResource realmResource = keycloak.realm(realm);
        UserResource userResource = realmResource.users().get(id);
        UserRepresentation user = userResource.toRepresentation();

        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setEnabled(true);
        userResource.update(user);

        if (userDto.getPassword() != null) {
            CredentialRepresentation cred = new CredentialRepresentation();
            cred.setType(CredentialRepresentation.PASSWORD);
            cred.setValue(userDto.getPassword());
            cred.setTemporary(false);
            userResource.resetPassword(cred);
        }

        if (userDto.getClientRoles() != null) {
            RoleMappingResource roleMapping = userResource.roles();

            for (Map.Entry<String, List<String>> entry : userDto.getClientRoles().entrySet()) {
                String clientAlias = entry.getKey();
                List<String> roles = entry.getValue();

                List<ClientRepresentation> clientList = realmResource.clients().findByClientId(clientAlias);
                if (!clientList.isEmpty()) {
                    String clientUuid = clientList.get(0).getId();

                    List<RoleRepresentation> allAvailableRoles = realmResource.clients().get(clientUuid).roles().list();

                    // Validate requested roles exist before calling add()
                    List<RoleRepresentation> roleRepsToAdd = allAvailableRoles.stream()
                            .filter(role -> roles.contains(role.getName()))
                            .toList();

                    // Clear existing roles safely
                    List<RoleRepresentation> existingRoles = roleMapping.clientLevel(clientUuid).listAll();
                    if (!existingRoles.isEmpty()) {
                        roleMapping.clientLevel(clientUuid).remove(existingRoles);
                    }

                    // Add new roles if valid
                    if (!roleRepsToAdd.isEmpty()) {
                        roleMapping.clientLevel(clientUuid).add(roleRepsToAdd);
                    }
                }
            }
        }

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        keycloak.realm(realm).users().delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/apps")
    public ResponseEntity<Map<String, Object>> getUserApps(@PathVariable String id) {
        RealmResource realmResource = keycloak.realm(realm);
        UserRepresentation user = realmResource.users().get(id).toRepresentation();

        // Collect realm-level roles
        List<String> realmRoles = realmResource.users().get(id).roles().realmLevel().listAll().stream()
                .map(RoleRepresentation::getName)
                .toList();

        Map<String, Object> result = new HashMap<>();
        result.put("user", user);
        result.put("realmRoles", realmRoles);

        List<Map<String, Object>> apps = new ArrayList<>();

        // Dynamically get all clients (apps) in the realm
        List<ClientRepresentation> allClients = realmResource.clients().findAll();

        for (ClientRepresentation client : allClients) {
            String clientId = client.getClientId();
            String clientUuid = client.getId();
            if (!List.of("account", "realm-management", "broker").contains(clientId)) {

            List<RoleRepresentation> clientRoles = realmResource.users().get(id)
                    .roles()
                    .clientLevel(clientUuid)
                    .listAll();

            if (!clientRoles.isEmpty()) {
                List<String> roleNames = clientRoles.stream()
                        .map(RoleRepresentation::getName)
                        .toList();

                Map<String, Object> app = new HashMap<>();
                app.put("clientId", clientId);
                app.put("name", client.getName() != null ? client.getName() : clientId);  // Use 'name' if available
                app.put("description", client.getDescription());
                app.put("baseUrl", client.getBaseUrl());
                app.put("roles", roleNames);

                apps.add(app);
            }
            }
        }

        result.put("apps", apps);
        return ResponseEntity.ok(result);
    }
}