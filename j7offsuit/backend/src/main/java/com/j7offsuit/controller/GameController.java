package com.j7offsuit.controller;

import com.j7offsuit.dto.*;
import com.j7offsuit.service.GameService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api")
public class GameController {
    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping("/games")
    @ResponseStatus(HttpStatus.CREATED)
    public GameResponse createGame(@Valid @RequestBody CreateGameRequest request) {
        return gameService.createGame(request);
    }

    @GetMapping("/games/{gameId}")
    public GameResponse getGame(@PathVariable UUID gameId, @RequestParam String token) {
        return gameService.getGame(gameId, token);
    }

    @PatchMapping("/games/{gameId}")
    public GameResponse updateGame(@PathVariable UUID gameId,
                                   @RequestParam String token,
                                   @Valid @RequestBody UpdateGameRequest request) {
        return gameService.updateGame(gameId, token, request);
    }

    @DeleteMapping("/games/{gameId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteGame(@PathVariable UUID gameId, @RequestParam String token) {
        gameService.deleteGame(gameId, token);
    }

    @PostMapping("/games/{gameId}/players")
    @ResponseStatus(HttpStatus.CREATED)
    public GameResponse addPlayer(@PathVariable UUID gameId,
                                  @RequestParam String token,
                                  @Valid @RequestBody UpsertPlayerRequest request) {
        return gameService.addPlayer(gameId, token, request);
    }

    @PatchMapping("/games/{gameId}/players/{playerId}")
    public GameResponse updatePlayer(@PathVariable UUID gameId,
                                     @PathVariable UUID playerId,
                                     @RequestParam String token,
                                     @Valid @RequestBody UpsertPlayerRequest request) {
        return gameService.updatePlayer(gameId, playerId, token, request);
    }

    @DeleteMapping("/games/{gameId}/players/{playerId}")
    public GameResponse deletePlayer(@PathVariable UUID gameId,
                                     @PathVariable UUID playerId,
                                     @RequestParam String token) {
        return gameService.deletePlayer(gameId, playerId, token);
    }


    @GetMapping("/shared/{token}")
    public GameResponse getSharedGame(@PathVariable String token) {
        return gameService.getSharedGame(token);
    }

    @PatchMapping("/shared/{token}/games/{gameId}")
    public GameResponse updateSharedGame(@PathVariable String token,
                                         @PathVariable UUID gameId,
                                         @Valid @RequestBody UpdateGameRequest request) {
        return gameService.updateGame(gameId, token, request);
    }

    @PostMapping("/shared/{token}/games/{gameId}/players")
    @ResponseStatus(HttpStatus.CREATED)
    public GameResponse addSharedPlayer(@PathVariable String token,
                                        @PathVariable UUID gameId,
                                        @Valid @RequestBody UpsertPlayerRequest request) {
        return gameService.addPlayer(gameId, token, request);
    }

    @PatchMapping("/shared/{token}/games/{gameId}/players/{playerId}")
    public GameResponse updateSharedPlayer(@PathVariable String token,
                                           @PathVariable UUID gameId,
                                           @PathVariable UUID playerId,
                                           @Valid @RequestBody UpsertPlayerRequest request) {
        return gameService.updatePlayer(gameId, playerId, token, request);
    }

    @DeleteMapping("/shared/{token}/games/{gameId}/players/{playerId}")
    public GameResponse deleteSharedPlayer(@PathVariable String token,
                                           @PathVariable UUID gameId,
                                           @PathVariable UUID playerId) {
        return gameService.deletePlayer(gameId, playerId, token);
    }
}
