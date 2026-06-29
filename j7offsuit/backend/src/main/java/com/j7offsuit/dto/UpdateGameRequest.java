package com.j7offsuit.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public record UpdateGameRequest(
        @Size(max = 120) String name,
        @Min(1) Long chipUnit,
        @Min(0) Long moneyPerUnit
) {}
