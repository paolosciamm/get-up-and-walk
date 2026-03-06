package com.getupandwalk.resource;

import com.getupandwalk.dto.AuthResponse;
import com.getupandwalk.dto.LoginRequest;
import com.getupandwalk.dto.RegisterRequest;
import com.getupandwalk.service.AuthService;
import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    @Inject
    AuthService authService;

    @POST
    @Path("/register")
    @PermitAll
    public Response register(@Valid RegisterRequest req) {
        AuthResponse response = authService.register(req);
        return Response.status(Response.Status.CREATED).entity(response).build();
    }

    @POST
    @Path("/login")
    @PermitAll
    public Response login(@Valid LoginRequest req) {
        AuthResponse response = authService.login(req);
        return Response.ok(response).build();
    }
}
