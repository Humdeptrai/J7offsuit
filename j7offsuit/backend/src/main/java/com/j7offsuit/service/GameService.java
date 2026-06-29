package com.j7offsuit.service;

import com.j7offsuit.domain.AuditLog;
import com.j7offsuit.domain.Game;
import com.j7offsuit.domain.Player;
import com.j7offsuit.dto.*;
import com.j7offsuit.exception.AppException;
import com.j7offsuit.repository.AuditLogRepository;
import com.j7offsuit.repository.GameRepository;
import com.j7offsuit.repository.PlayerRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;
import java.util.UUID;

@Service
public class GameService {
    private final GameRepository gameRepository;
    private final PlayerRepository playerRepository;
    private final AuditLogRepository auditLogRepository;
    private final TokenGenerator tokenGenerator;
    private final GameMapper mapper;

    public GameService(GameRepository gameRepository,
                       PlayerRepository playerRepository,
                       AuditLogRepository auditLogRepository,
                       TokenGenerator tokenGenerator,
                       GameMapper mapper) {
        this.gameRepository = gameRepository;
        this.playerRepository = playerRepository;
        this.auditLogRepository = auditLogRepository;
        this.tokenGenerator = tokenGenerator;
        this.mapper = mapper;
    }

    @Transactional
    public GameResponse createGame(CreateGameRequest request) {
        Game game = new Game();
        game.setName(cleanName(request.name()));
        game.setChipUnit(request.chipUnit() == null ? 1000 : request.chipUnit());
        game.setMoneyPerUnit(request.moneyPerUnit() == null ? 500000 : request.moneyPerUnit());
        assignUniqueTokens(game);
        Game saved = gameRepository.save(game);
        audit(saved, AccessLevel.OWNER, "CREATE_GAME", "GAME", saved.getId(), null, snapshotGame(saved));
        return mapper.toGameResponse(saved, AccessLevel.OWNER);
    }

    @Transactional(readOnly = true)
    public GameResponse getGame(UUID gameId, String token) {
        Game game = gameRepository.findWithPlayersById(gameId)
                .orElseThrow(() -> notFound("Game not found"));
        AccessLevel accessLevel = resolveAccess(game, token);
        return mapper.toGameResponse(game, accessLevel);
    }

    @Transactional(readOnly = true)
    public GameResponse getSharedGame(String token) {
        Game game = gameRepository.findWithPlayersByOwnerToken(token)
                .or(() -> gameRepository.findWithPlayersByEditToken(token))
                .or(() -> gameRepository.findWithPlayersByViewToken(token))
                .orElseThrow(() -> forbidden("Invalid share link"));
        return mapper.toGameResponse(game, resolveAccess(game, token));
    }

    @Transactional
    public GameResponse updateGame(UUID gameId, String token, UpdateGameRequest request) {
        Game game = gameRepository.findWithPlayersById(gameId)
                .orElseThrow(() -> notFound("Game not found"));
        AccessLevel accessLevel = requireEdit(game, token);
        String oldValue = snapshotGame(game);

        if (request.name() != null) {
            game.setName(cleanName(request.name()));
        }
        if (request.chipUnit() != null) {
            game.setChipUnit(request.chipUnit());
        }
        if (request.moneyPerUnit() != null) {
            game.setMoneyPerUnit(request.moneyPerUnit());
        }
        audit(game, accessLevel, "UPDATE_GAME", "GAME", game.getId(), oldValue, snapshotGame(game));
        return mapper.toGameResponse(game, accessLevel);
    }

    @Transactional
    public void deleteGame(UUID gameId, String token) {
        Game game = gameRepository.findWithPlayersById(gameId)
                .orElseThrow(() -> notFound("Game not found"));
        requireOwner(game, token);
        gameRepository.delete(game);
    }

    @Transactional
    public GameResponse addPlayer(UUID gameId, String token, UpsertPlayerRequest request) {
        Game game = gameRepository.findWithPlayersById(gameId)
                .orElseThrow(() -> notFound("Game not found"));
        AccessLevel accessLevel = requireEdit(game, token);

        Player player = new Player();
        player.setGame(game);
        player.setName(cleanName(request.name()));
        player.setBuyInChip(nonNullNonNegative(request.buyInChip()));
        player.setCashOutChip(nonNullNonNegative(request.cashOutChip()));
        player.setSortOrder(playerRepository.maxSortOrder(game.getId()) + 1);
        playerRepository.save(player);
        game.getPlayers().add(player);

        audit(game, accessLevel, "CREATE_PLAYER", "PLAYER", player.getId(), null, snapshotPlayer(player));
        return mapper.toGameResponse(game, accessLevel);
    }

    @Transactional
    public GameResponse updatePlayer(UUID gameId, UUID playerId, String token, UpsertPlayerRequest request) {
        Game game = gameRepository.findWithPlayersById(gameId)
                .orElseThrow(() -> notFound("Game not found"));
        AccessLevel accessLevel = requireEdit(game, token);
        Player player = playerRepository.findByIdAndGameId(playerId, gameId)
                .orElseThrow(() -> notFound("Player not found"));

        String oldValue = snapshotPlayer(player);
        player.setName(cleanName(request.name()));
        player.setBuyInChip(nonNullNonNegative(request.buyInChip()));
        player.setCashOutChip(nonNullNonNegative(request.cashOutChip()));
        audit(game, accessLevel, "UPDATE_PLAYER", "PLAYER", player.getId(), oldValue, snapshotPlayer(player));
        return mapper.toGameResponse(game, accessLevel);
    }

    @Transactional
    public GameResponse deletePlayer(UUID gameId, UUID playerId, String token) {
        Game game = gameRepository.findWithPlayersById(gameId)
                .orElseThrow(() -> notFound("Game not found"));
        AccessLevel accessLevel = requireEdit(game, token);
        Player player = playerRepository.findByIdAndGameId(playerId, gameId)
                .orElseThrow(() -> notFound("Player not found"));
        String oldValue = snapshotPlayer(player);
        playerRepository.delete(player);
        game.getPlayers().removeIf(p -> Objects.equals(p.getId(), playerId));
        audit(game, accessLevel, "DELETE_PLAYER", "PLAYER", playerId, oldValue, null);
        return mapper.toGameResponse(game, accessLevel);
    }


    private void assignUniqueTokens(Game game) {
        String ownerToken;
        String viewToken;
        String editToken;
        do {
            ownerToken = tokenGenerator.generate();
            viewToken = tokenGenerator.generate();
            editToken = tokenGenerator.generate();
        } while (gameRepository.existsAnyToken(java.util.List.of(ownerToken, viewToken, editToken)));
        game.setOwnerToken(ownerToken);
        game.setViewToken(viewToken);
        game.setEditToken(editToken);
    }

    private AccessLevel resolveAccess(Game game, String token) {
        if (token == null || token.isBlank()) {
            throw forbidden("Access token is required");
        }
        if (token.equals(game.getOwnerToken())) return AccessLevel.OWNER;
        if (token.equals(game.getEditToken())) return AccessLevel.EDIT;
        if (token.equals(game.getViewToken())) return AccessLevel.VIEW;
        throw forbidden("Invalid access token");
    }

    private AccessLevel requireEdit(Game game, String token) {
        AccessLevel accessLevel = resolveAccess(game, token);
        if (accessLevel == AccessLevel.VIEW) {
            throw forbidden("This link is view-only");
        }
        return accessLevel;
    }

    private void requireOwner(Game game, String token) {
        if (resolveAccess(game, token) != AccessLevel.OWNER) {
            throw forbidden("Only the owner can delete this game");
        }
    }

    private String cleanName(String value) {
        String cleaned = value == null ? "" : value.trim();
        if (cleaned.isBlank()) throw new AppException(HttpStatus.BAD_REQUEST, "INVALID_NAME", "Name is required");
        if (cleaned.length() > 120) throw new AppException(HttpStatus.BAD_REQUEST, "INVALID_NAME", "Name must be at most 120 characters");
        return cleaned;
    }

    private long nonNullNonNegative(Long value) {
        long result = value == null ? 0 : value;
        if (result < 0) throw new AppException(HttpStatus.BAD_REQUEST, "INVALID_AMOUNT", "Amount must not be negative");
        return result;
    }

    private AppException notFound(String message) {
        return new AppException(HttpStatus.NOT_FOUND, "NOT_FOUND", message);
    }

    private AppException forbidden(String message) {
        return new AppException(HttpStatus.FORBIDDEN, "FORBIDDEN", message);
    }

    private void audit(Game game, AccessLevel actorType, String action, String targetType, UUID targetId, String oldValue, String newValue) {
        AuditLog log = new AuditLog();
        log.setGame(game);
        log.setActorType(actorType.name());
        log.setAction(action);
        log.setTargetType(targetType);
        log.setTargetId(targetId);
        log.setOldValue(oldValue);
        log.setNewValue(newValue);
        auditLogRepository.save(log);
    }

    private String snapshotGame(Game game) {
        return "{\"id\":\"" + game.getId() + "\",\"name\":\"" + escape(game.getName()) + "\",\"chipUnit\":" + game.getChipUnit() + ",\"moneyPerUnit\":" + game.getMoneyPerUnit() + "}";
    }

    private String snapshotPlayer(Player player) {
        return "{\"id\":\"" + player.getId() + "\",\"name\":\"" + escape(player.getName()) + "\",\"buyInChip\":" + player.getBuyInChip() + ",\"cashOutChip\":" + player.getCashOutChip() + "}";
    }

    private String escape(String value) {
        return value == null ? "" : value.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
