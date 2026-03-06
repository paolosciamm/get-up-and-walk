package com.getupandwalk.resource;

import com.getupandwalk.dto.UserStatsResponse;
import com.getupandwalk.entity.UserEntity;
import com.getupandwalk.repository.UserRepository;
import com.getupandwalk.service.GameSessionService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;

@Path("/api/users")
@Produces(MediaType.APPLICATION_JSON)
@RolesAllowed("User")
public class UserResource {

    @Inject
    JsonWebToken jwt;

    @Inject
    UserRepository userRepository;

    @Inject
    GameSessionService sessionService;

    @GET
    @Path("/me")
    public Response getCurrentUser() {
        UserEntity user = userRepository.findByUsername(jwt.getSubject())
                .orElseThrow(() -> new WebApplicationException("User not found", Response.Status.NOT_FOUND));
        return Response.ok(user).build();
    }

    @GET
    @Path("/me/stats")
    public UserStatsResponse getStats() {
        return sessionService.getUserStats(jwt.getSubject());
    }
}
