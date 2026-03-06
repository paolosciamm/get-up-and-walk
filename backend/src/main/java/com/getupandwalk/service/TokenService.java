package com.getupandwalk.service;

import com.getupandwalk.entity.UserEntity;
import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import java.time.Duration;
import java.util.Set;

@ApplicationScoped
public class TokenService {

    public String generateToken(UserEntity user) {
        return Jwt.issuer("get-up-and-walk")
                .upn(user.email)
                .subject(user.username)
                .groups(Set.of("User"))
                .expiresIn(Duration.ofHours(24))
                .sign();
    }
}
