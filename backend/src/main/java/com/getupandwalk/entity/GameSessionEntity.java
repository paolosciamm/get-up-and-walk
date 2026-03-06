package com.getupandwalk.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "game_sessions")
public class GameSessionEntity extends PanacheEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    public UserEntity user;

    @Column(name = "waypoint_count", nullable = false)
    public int waypointCount;

    @Column(name = "radius_meters", nullable = false)
    public int radiusMeters;

    @Column(name = "distance_walked_meters")
    public double distanceWalkedMeters = 0;

    @Column(name = "elapsed_time_seconds")
    public int elapsedTimeSeconds = 0;

    @Column(nullable = false)
    public boolean completed = false;

    @Column(name = "completed_at")
    public LocalDateTime completedAt;

    @Column(name = "created_at", nullable = false)
    public LocalDateTime createdAt = LocalDateTime.now();
}
