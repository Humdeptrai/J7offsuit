package com.j7offsuit.service;

import com.j7offsuit.domain.Game;
import com.j7offsuit.domain.Player;
import com.j7offsuit.dto.GameResponse;
import com.j7offsuit.dto.PlayerResponse;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.List;

@Component
public class GameMapper {
    public GameResponse toGameResponse(Game game, AccessLevel accessLevel) {
        List<PlayerResponse> players = game.getPlayers().stream()
                .sorted(Comparator.comparingInt(Player::getSortOrder).thenComparing(Player::getCreatedAt))
                .map(player -> toPlayerResponse(player, game.getChipUnit(), game.getMoneyPerUnit()))
                .toList();

        long totalBuyInChip = players.stream().mapToLong(PlayerResponse::buyInChip).sum();
        long totalCashOutChip = players.stream().mapToLong(PlayerResponse::cashOutChip).sum();
        long differenceChip = totalCashOutChip - totalBuyInChip;

        boolean isOwner = accessLevel == AccessLevel.OWNER;
        boolean canEdit = accessLevel == AccessLevel.OWNER || accessLevel == AccessLevel.EDIT;

        return new GameResponse(
                game.getId(),
                game.getName(),
                game.getChipUnit(),
                game.getMoneyPerUnit(),
                totalBuyInChip,
                totalCashOutChip,
                differenceChip,
                chipToMoney(totalBuyInChip, game.getChipUnit(), game.getMoneyPerUnit()),
                chipToMoney(totalCashOutChip, game.getChipUnit(), game.getMoneyPerUnit()),
                chipToMoney(differenceChip, game.getChipUnit(), game.getMoneyPerUnit()),
                canEdit,
                isOwner,
                isOwner ? game.getOwnerToken() : null,
                isOwner ? game.getViewToken() : null,
                isOwner ? game.getEditToken() : null,
                players,
                game.getCreatedAt(),
                game.getUpdatedAt()
        );
    }

    public PlayerResponse toPlayerResponse(Player player, long chipUnit, long moneyPerUnit) {
        long profitLossChip = player.getCashOutChip() - player.getBuyInChip();
        return new PlayerResponse(
                player.getId(),
                player.getName(),
                player.getBuyInChip(),
                player.getCashOutChip(),
                profitLossChip,
                chipToMoney(player.getBuyInChip(), chipUnit, moneyPerUnit),
                chipToMoney(player.getCashOutChip(), chipUnit, moneyPerUnit),
                chipToMoney(profitLossChip, chipUnit, moneyPerUnit),
                player.getSortOrder(),
                player.getCreatedAt(),
                player.getUpdatedAt()
        );
    }


    private long chipToMoney(long chip, long chipUnit, long moneyPerUnit) {
        return BigDecimal.valueOf(chip)
                .multiply(BigDecimal.valueOf(moneyPerUnit))
                .divide(BigDecimal.valueOf(chipUnit), 0, RoundingMode.HALF_UP)
                .longValue();
    }
}
