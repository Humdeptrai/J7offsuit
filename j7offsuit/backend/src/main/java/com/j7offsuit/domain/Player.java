package com.j7offsuit.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "players")
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(name = "buy_in_chip", nullable = false)
    private long buyInChip;

    @Column(name = "cash_out_chip", nullable = false)
    private long cashOutChip;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

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
    public Game getGame() { return game; }
    public void setGame(Game game) { this.game = game; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public long getBuyInChip() { return buyInChip; }
    public void setBuyInChip(long buyInChip) { this.buyInChip = buyInChip; }
    public long getCashOutChip() { return cashOutChip; }
    public void setCashOutChip(long cashOutChip) { this.cashOutChip = cashOutChip; }
    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
