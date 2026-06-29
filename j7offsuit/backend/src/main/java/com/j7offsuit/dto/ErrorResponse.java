package com.j7offsuit.dto;

import java.time.OffsetDateTime;

public record ErrorResponse(
        String code,
        String message,
        OffsetDateTime timestamp
) {}
