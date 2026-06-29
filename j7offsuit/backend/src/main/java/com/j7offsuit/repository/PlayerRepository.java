package com.j7offsuit.repository;

import com.j7offsuit.domain.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface PlayerRepository extends JpaRepository<Player, UUID> {
    Optional<Player> findByIdAndGameId(UUID id, UUID gameId);

    @Query("select coalesce(max(p.sortOrder), -1) from Player p where p.game.id = :gameId")
    int maxSortOrder(@Param("gameId") UUID gameId);
}
