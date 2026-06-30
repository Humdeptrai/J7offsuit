package com.j7offsuit.service;

import com.j7offsuit.domain.Game;
import com.j7offsuit.dto.CreateGameRequest;
import com.j7offsuit.dto.GameResponse;
import com.j7offsuit.exception.AppException;
import com.j7offsuit.repository.AuditLogRepository;
import com.j7offsuit.repository.GameRepository;
import com.j7offsuit.repository.PlayerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class GameServiceTest {
    private GameRepository gameRepository;
    private PlayerRepository playerRepository;
    private AuditLogRepository auditLogRepository;
    private TokenGenerator tokenGenerator;
    private GameMapper gameMapper;
    private GameService gameService;

    @BeforeEach
    void setUp() {
        gameRepository = mock(GameRepository.class);
        playerRepository = mock(PlayerRepository.class);
        auditLogRepository = mock(AuditLogRepository.class);
        tokenGenerator = mock(TokenGenerator.class);
        gameMapper = mock(GameMapper.class);
        gameService = new GameService(gameRepository, playerRepository, auditLogRepository, tokenGenerator, gameMapper);
    }

    @Test
    void testCreateGame_withValidName() {
        CreateGameRequest request = new CreateGameRequest("My Game", 100L, 500L);
        when(tokenGenerator.generate()).thenReturn("token1", "token2", "token3");
        when(gameRepository.existsAnyToken(any())).thenReturn(false);
        when(gameRepository.save(any(Game.class))).thenAnswer(invocation -> {
            Game g = invocation.getArgument(0);
            g.setId(UUID.randomUUID());
            return g;
        });

        gameService.createGame(request);

        verify(gameRepository).save(argThat(game -> "My Game".equals(game.getName())));
    }

    @Test
    void testCreateGame_withNullName() {
        CreateGameRequest request = new CreateGameRequest(null, 100L, 500L);
        when(tokenGenerator.generate()).thenReturn("token1", "token2", "token3");
        when(gameRepository.existsAnyToken(any())).thenReturn(false);
        when(gameRepository.save(any(Game.class))).thenAnswer(invocation -> {
            Game g = invocation.getArgument(0);
            g.setId(UUID.randomUUID());
            return g;
        });

        gameService.createGame(request);

        verify(gameRepository).save(argThat(game -> "Untitled Game".equals(game.getName())));
    }

    @Test
    void testCreateGame_withEmptyName() {
        CreateGameRequest request = new CreateGameRequest("", 100L, 500L);
        when(tokenGenerator.generate()).thenReturn("token1", "token2", "token3");
        when(gameRepository.existsAnyToken(any())).thenReturn(false);
        when(gameRepository.save(any(Game.class))).thenAnswer(invocation -> {
            Game g = invocation.getArgument(0);
            g.setId(UUID.randomUUID());
            return g;
        });

        gameService.createGame(request);

        verify(gameRepository).save(argThat(game -> "Untitled Game".equals(game.getName())));
    }

    @Test
    void testCreateGame_withWhitespaceName() {
        CreateGameRequest request = new CreateGameRequest("    ", 100L, 500L);
        when(tokenGenerator.generate()).thenReturn("token1", "token2", "token3");
        when(gameRepository.existsAnyToken(any())).thenReturn(false);
        when(gameRepository.save(any(Game.class))).thenAnswer(invocation -> {
            Game g = invocation.getArgument(0);
            g.setId(UUID.randomUUID());
            return g;
        });

        gameService.createGame(request);

        verify(gameRepository).save(argThat(game -> "Untitled Game".equals(game.getName())));
    }
}
