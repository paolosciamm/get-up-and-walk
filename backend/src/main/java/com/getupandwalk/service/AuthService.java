package com.getupandwalk.service;

import com.getupandwalk.dto.AuthResponse;
import com.getupandwalk.dto.LoginRequest;
import com.getupandwalk.dto.RegisterRequest;
import com.getupandwalk.entity.UserEntity;
import com.getupandwalk.repository.UserRepository;
import io.quarkus.elytron.security.common.BcryptUtil;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

@ApplicationScoped
public class AuthService {

    @Inject
    UserRepository userRepository;

    @Inject
    TokenService tokenService;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.findByUsername(req.username).isPresent()) {
            throw new WebApplicationException("Username already exists", Response.Status.CONFLICT);
        }
        if (userRepository.findByEmail(req.email).isPresent()) {
            throw new WebApplicationException("Email already exists", Response.Status.CONFLICT);
        }

        UserEntity user = new UserEntity();
        user.username = req.username;
        user.email = req.email;
        user.passwordHash = BcryptUtil.bcryptHash(req.password);
        userRepository.persist(user);

        String token = tokenService.generateToken(user);
        return new AuthResponse(token, user.username, user.email);
    }

    public AuthResponse login(LoginRequest req) {
        UserEntity user = userRepository.findByUsername(req.username)
                .orElseThrow(() -> new WebApplicationException("Invalid credentials", Response.Status.UNAUTHORIZED));

        if (!BcryptUtil.matches(req.password, user.passwordHash)) {
            throw new WebApplicationException("Invalid credentials", Response.Status.UNAUTHORIZED);
        }

        String token = tokenService.generateToken(user);
        return new AuthResponse(token, user.username, user.email);
    }
}
