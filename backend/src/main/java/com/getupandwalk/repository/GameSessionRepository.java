package com.getupandwalk.repository;

import com.getupandwalk.entity.GameSessionEntity;
import com.getupandwalk.entity.UserEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;

@ApplicationScoped
public class GameSessionRepository implements PanacheRepository<GameSessionEntity> {

    public List<GameSessionEntity> findByUser(UserEntity user) {
        return find("user", user).list();
    }

    public long countByUser(UserEntity user) {
        return count("user", user);
    }

    public long countCompletedByUser(UserEntity user) {
        return count("user = ?1 and completed = true", user);
    }
}
