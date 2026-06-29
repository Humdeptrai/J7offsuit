package com.j7offsuit.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "games")
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(name = "chip_unit", nullable = false)
    private long chipUnit = 1000;

    @Column(name = "money_per_unit", nullable = false)
    private long moneyPerUnit = 500000;

    @Column(name = "owner_token", nullable = false, unique = true, length = 96)
    private String ownerToken;

    @Column(name = "view_token", nullable = false, unique = true, length = 96)
    private String viewToken;

    @Column(name = "edit_token", nullable = false, unique = true, length = 96)
    private String editToken;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC, createdAt ASC")
    private List<Player> players = new ArrayList<>();

    @PrePersist
    void prePersist() {
        OffsetDateTime now = OffsetDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = OffsetDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public long getChipUnit() { return chipUnit; }
    public void setChipUnit(long chipUnit) { this.chipUnit = chipUnit; }
    public long getMoneyPerUnit() { return moneyPerUnit; }
    public void setMoneyPerUnit(long moneyPerUnit) { this.moneyPerUnit = moneyPerUnit; }
    public String getOwnerToken() { return ownerToken; }
    public void setOwnerToken(String ownerToken) { this.ownerToken = ownerToken; }
    public String getViewToken() { return viewToken; }
    public void setViewToken(String viewToken) { this.viewToken = viewToken; }
    public String getEditToken() { return editToken; }
    public void setEditToken(String editToken) { this.editToken = editToken; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
    public List<Player> getPlayers() { return players; }
    public void setPlayers(List<Player> players) { this.players = players; }
}
