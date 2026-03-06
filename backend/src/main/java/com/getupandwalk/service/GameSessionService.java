package com.getupandwalk.service;

import com.getupandwalk.dto.GameSessionRequest;
import com.getupandwalk.dto.GameSessionUpdate;
import com.getupandwalk.dto.UserStatsResponse;
import com.getupandwalk.entity.GameSessionEntity;
import com.getupandwalk.entity.UserEntity;
import com.getupandwalk.repository.GameSessionRepository;
import com.getupandwalk.repository.UserRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import java.time.LocalDateTime;
import java.util.List;

@ApplicationScoped
public class GameSessionService {

    @Inject
    GameSessionRepository sessionRepository;

    @Inject
    UserRepository userRepository;

    @Transactional
    public GameSessionEntity createSession(String username, GameSessionRequest req) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new WebApplicationException("User not found", Response.Status.NOT_FOUND));

        GameSessionEntity session = new GameSessionEntity();
        session.user = user;
        session.waypointCount = req.waypointCount;
        session.radiusMeters = req.radiusMeters;
        sessionRepository.persist(session);
        return session;
    }

    @Transactional
    public GameSessionEntity updateSession(Long sessionId, String username, GameSessionUpdate update) {
        GameSessionEntity session = sessionRepository.findById(sessionId);
        if (session == null || !session.user.username.equals(username)) {
            throw new WebApplicationException("Session not found", Response.Status.NOT_FOUND);
        }

        session.distanceWalkedMeters = update.distanceWalkedMeters;
        session.elapsedTimeSeconds = update.elapsedTimeSeconds;
        session.completed = update.completed;
        if (update.completed && session.completedAt == null) {
            session.completedAt = LocalDateTime.now();
        }
        return session;
    }

    public List<GameSessionEntity> getUserSessions(String username) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new WebApplicationException("User not found", Response.Status.NOT_FOUND));
        return sessionRepository.findByUser(user);
    }

    public UserStatsResponse getUserStats(String username) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new WebApplicationException("User not found", Response.Status.NOT_FOUND));

        List<GameSessionEntity> sessions = sessionRepository.findByUser(user);
        long totalGames = sessions.size();
        double totalDistance = sessions.stream().mapToDouble(s -> s.distanceWalkedMeters).sum();
        long totalTime = sessions.stream().mapToLong(s -> s.elapsedTimeSeconds).sum();
        long gamesWon = sessions.stream().filter(s -> s.completed).count();

        return new UserStatsResponse(totalGames, totalDistance, totalTime, gamesWon);
    }
}
