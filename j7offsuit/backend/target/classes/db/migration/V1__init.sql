CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(120) NOT NULL,
    chip_unit BIGINT NOT NULL DEFAULT 1000,
    money_per_unit BIGINT NOT NULL DEFAULT 500000,
    owner_token VARCHAR(96) NOT NULL UNIQUE,
    view_token VARCHAR(96) NOT NULL UNIQUE,
    edit_token VARCHAR(96) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_games_name_not_blank CHECK (length(trim(name)) > 0),
    CONSTRAINT chk_games_chip_unit_positive CHECK (chip_unit > 0),
    CONSTRAINT chk_games_money_per_unit_non_negative CHECK (money_per_unit >= 0)
);

CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    buy_in_chip BIGINT NOT NULL DEFAULT 0,
    cash_out_chip BIGINT NOT NULL DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_players_name_not_blank CHECK (length(trim(name)) > 0),
    CONSTRAINT chk_players_buy_in_non_negative CHECK (buy_in_chip >= 0),
    CONSTRAINT chk_players_cash_out_non_negative CHECK (cash_out_chip >= 0)
);

CREATE INDEX idx_players_game_id_sort_order ON players(game_id, sort_order, created_at);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    actor_type VARCHAR(20) NOT NULL,
    action VARCHAR(40) NOT NULL,
    target_type VARCHAR(40) NOT NULL,
    target_id UUID,
    old_value TEXT,
    new_value TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_game_id_created_at ON audit_logs(game_id, created_at DESC);
