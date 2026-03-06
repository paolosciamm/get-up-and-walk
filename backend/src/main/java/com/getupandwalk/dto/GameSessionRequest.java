package com.getupandwalk.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class GameSessionRequest {

    @Min(value = 1, message = "Minimum 1 waypoint")
    @Max(value = 30, message = "Maximum 30 waypoints")
    public int waypointCount;

    @Min(value = 200, message = "Minimum radius is 200 meters")
    @Max(value = 5000, message = "Maximum radius is 5000 meters")
    public int radiusMeters;
}
