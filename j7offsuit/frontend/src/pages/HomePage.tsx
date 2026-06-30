import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { getOwnedGames, saveOwnedGame, removeOwnedGame } from '../storage';
import type { OwnedGameRef } from '../types';
import { Link } from 'react-router-dom';

function PokerHeroGraphic() {
  return (
      <div className="poker-hero" aria-hidden="true">
        <div className="table-oval">
          <span className="table-ring" />
          <span className="hero-card hero-card-j">J♠</span>
          <span className="hero-card hero-card-7">7♥</span>
          <span className="hero-chip chip-one">500</span>
          <span className="hero-chip chip-two">1K</span>
          <span className="hero-chip chip-three">5K</span>
        </div>
      </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [games, setGames] = useState<OwnedGameRef[]>(getOwnedGames());
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const [deletingGame, setDeletingGame] = useState<OwnedGameRef | null>(null);

  async function createGame() {
    setCreating(true);

    try {
      const game = await api.createGame({
        name: name.trim() || undefined,
        chipUnit: 1000,
        moneyPerUnit: 500000
      });

      const ref = {
        id: game.id,
        name: game.name,
        ownerToken: game.ownerToken!,
        updatedAt: game.updatedAt
      };

      saveOwnedGame(ref);
      setGames(getOwnedGames());
      navigate(`/games/${game.id}`);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Không tạo được game');
    } finally {
      setCreating(false);
    }
  }

  function confirmDelete() {
    if (!deletingGame) return;
    removeOwnedGame(deletingGame.id);
    setGames(getOwnedGames());
    setDeletingGame(null);
  }

  return (
      <main className="page home-page">
        {/* Header logo – không có h1 title */}
        <div className="home-brand">
          <Link className="brand" to="/" aria-label="Trang chủ">
          <span className="brand-emblem" aria-hidden="true">
            <span className="brand-card brand-card-left">J♠</span>
            <span className="brand-card brand-card-right">7♥</span>
          </span>
            <span className="brand-text">
            <strong>J7offsuit</strong>
            <small>Develop by HUM</small>
          </span>
          </Link>
          <p className="home-eyebrow">CHUBI POKER GAME HOME</p>
        </div>

        {/* Hình poker */}
        <PokerHeroGraphic />

        {/* Form tạo game */}
        <div className="home-create-block">
          <p className="eyebrow" style={{ marginBottom: 8 }}>New table</p>
          <div className="create-row">
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createGame()}
                placeholder="Ví dụ: 28/6, Friday Cash Game..."
            />
            <button className="primary" onClick={createGame} disabled={creating}>
              {creating ? 'Đang tạo...' : 'Tạo mới'}
            </button>
          </div>
        </div>

        {/* Dropdown game đã lưu – xổ thẳng xuống */}
        <div className="home-saved-flat">
          <button
              className="home-saved-trigger"
              onClick={() => setSavedOpen(o => !o)}
              aria-expanded={savedOpen}
          >
          <span className="home-saved-trigger-text">
            <span className="eyebrow-inline">Local notes</span>
            Game đã lưu ({games.length})
          </span>
            <span className={`accordion-chevron ${savedOpen ? 'open' : ''}`}>▾</span>
          </button>

          {savedOpen && (
              <div className="home-saved-list">
                {games.length === 0 ? (
                    <div className="empty-box" style={{ margin: '8px 0 0' }}>
                      Chưa có game nào. Tạo game mới để bắt đầu.
                    </div>
                ) : (
                    games.map((game) => (
                        <div key={game.id} className="game-item-row">
                          <button
                              className="game-item"
                              onClick={() => navigate(`/games/${game.id}`)}
                          >
                    <span className="game-item-main">
                      <strong>{game.name}</strong>
                      <small>Cập nhật: {new Date(game.updatedAt).toLocaleString('vi-VN')}</small>
                    </span>
                          </button>
                          <button
                              className="game-item-delete danger"
                              onClick={() => setDeletingGame(game)}
                              aria-label={`Xoá ${game.name}`}
                          >
                            ✕
                          </button>
                        </div>
                    ))
                )}
              </div>
          )}
        </div>

        {/* Dialog xác nhận xoá */}
        {deletingGame ? (
            <div className="modal-backdrop delete-confirm-backdrop">
              <div className="delete-confirm-dialog">
                <p>Bạn có muốn xoá game <strong>{deletingGame.name}</strong> không?</p>
                <div className="delete-confirm-actions">
                  <button className="danger" onClick={confirmDelete}>Có</button>
                  <button className="secondary" onClick={() => setDeletingGame(null)}>Không</button>
                </div>
              </div>
            </div>
        ) : null}
      </main>
  );
}