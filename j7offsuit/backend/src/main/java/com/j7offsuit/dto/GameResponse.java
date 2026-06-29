package com.j7offsuit.dto;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record GameResponse(
        UUID id,
        String name,
        long chipUnit,
        long moneyPerUnit,
        long totalBuyInChip,
        long totalCashOutChip,
        long differenceChip,
        long totalBuyInMoney,
        long totalCashOutMoney,
        long differenceMoney,
        boolean canEdit,
        boolean canDelete,
        String ownerToken,
        String viewToken,
        String editToken,
        List<PlayerResponse> players,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}
