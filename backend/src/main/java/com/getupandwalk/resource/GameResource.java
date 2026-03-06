package com.getupandwalk.resource;

import com.getupandwalk.dto.GameSessionRequest;
import com.getupandwalk.dto.GameSessionUpdate;
import com.getupandwalk.entity.GameSessionEntity;
import com.getupandwalk.service.GameSessionService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;
import java.util.List;

@Path("/api/game/sessions")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("User")
public class GameResource {

    @Inject
    JsonWebToken jwt;

    @Inject
    GameSessionService sessionService;

    @POST
    public Response createSession(@Valid GameSessionRequest req) {
        GameSessionEntity session = sessionService.createSession(jwt.getSubject(), req);
        return Response.status(Response.Status.CREATED).entity(session).build();
    }

    @PUT
    @Path("/{id}")
    public Response updateSession(@PathParam("id") Long id, GameSessionUpdate update) {
        GameSessionEntity session = sessionService.updateSession(id, jwt.getSubject(), update);
        return Response.ok(session).build();
    }

    @GET
    public List<GameSessionEntity> getSessions() {
        return sessionService.getUserSessions(jwt.getSubject());
    }
}
