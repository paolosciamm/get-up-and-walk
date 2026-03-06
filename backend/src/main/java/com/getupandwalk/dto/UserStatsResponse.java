package com.getupandwalk.dto;

public class UserStatsResponse {

    public long totalGames;
    public double totalDistanceMeters;
    public long totalTimeSeconds;
    public long gamesWon;

    public UserStatsResponse() {}

    public UserStatsResponse(long totalGames, double totalDistanceMeters, long totalTimeSeconds, long gamesWon) {
        this.totalGames = totalGames;
        this.totalDistanceMeters = totalDistanceMeters;
        this.totalTimeSeconds = totalTimeSeconds;
        this.gamesWon = gamesWon;
    }
}
