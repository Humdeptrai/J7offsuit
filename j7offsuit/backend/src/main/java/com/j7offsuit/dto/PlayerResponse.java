package com.j7offsuit.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record PlayerResponse(
        UUID id,
        String name,
        long buyInChip,
        long cashOutChip,
        long profitLossChip,
        long buyInMoney,
        long cashOutMoney,
        long profitLossMoney,
        int sortOrder,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}
