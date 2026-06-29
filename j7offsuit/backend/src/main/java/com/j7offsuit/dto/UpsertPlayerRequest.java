package com.j7offsuit.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpsertPlayerRequest(
        @NotBlank @Size(max = 120) String name,
        @Min(0) Long buyInChip,
        @Min(0) Long cashOutChip
) {}
