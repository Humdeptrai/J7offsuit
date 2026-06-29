package com.j7offsuit.repository;

import com.j7offsuit.domain.Game;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface GameRepository extends JpaRepository<Game, UUID> {
    @EntityGraph(attributePaths = "players")
    @Query("select g from Game g where g.id = :id")
    Optional<Game> findWithPlayersById(@Param("id") UUID id);

    @EntityGraph(attributePaths = "players")
    @Query("select g from Game g where g.viewToken = :token")
    Optional<Game> findWithPlayersByViewToken(@Param("token") String token);

    @EntityGraph(attributePaths = "players")
    @Query("select g from Game g where g.editToken = :token")
    Optional<Game> findWithPlayersByEditToken(@Param("token") String token);

    @EntityGraph(attributePaths = "players")
    @Query("select g from Game g where g.ownerToken = :token")
    Optional<Game> findWithPlayersByOwnerToken(@Param("token") String token);

    @Query("select count(g) > 0 from Game g where g.ownerToken in (:tokens) or g.viewToken in (:tokens) or g.editToken in (:tokens)")
    boolean existsAnyToken(@Param("tokens") java.util.Collection<String> tokens);
}
