import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import SummaryCards from '../components/SummaryCards';
import PlayerTable from '../components/PlayerTable';
import PlayerModal, { type PlayerFormValue } from '../components/PlayerModal';
import { api } from '../api';
import type { Game, Player } from '../types';

export default function SharedGamePage() {
  const { token = '' } = useParams();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPlayer, setEditingPlayer] = useState<Player | null | undefined>(undefined);

  async function load() {
    setLoading(true);
    try {
      const data = await api.getSharedGame(token);
      setGame(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không mở được link chia sẻ');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function savePlayer(value: PlayerFormValue) {
    if (!game) return;
    const next = editingPlayer
      ? await api.updateSharedPlayer(token, game.id, editingPlayer.id, value)
      : await api.addSharedPlayer(token, game.id, value);
    setGame(next);
    setEditingPlayer(undefined);
  }

  async function deletePlayer(player: Player) {
    if (!game) return;
    if (!confirm(`Xóa người chơi ${player.name}?`)) return;
    const next = await api.deleteSharedPlayer(token, game.id, player.id);
    setGame(next);
  }

  if (loading) return <main><Header title="Đang tải..." /></main>;
  if (error) return <main><Header title="Link không hợp lệ" /><div className="empty-box">{error}</div><Link to="/">Về trang chính</Link></main>;
  if (!game) return null;

  return (
    <main className="page game-page">
      <Header title={game.name} subtitle={game.canEdit ? 'Shared edit link · Có quyền chỉnh sửa' : 'Shared view link · Chỉ xem'} />
      <SummaryCards game={game} />

      {game.canEdit ? (
        <div className="quick-add-bar">
          <button className="add-player-button" onClick={() => setEditingPlayer(null)} aria-label="Thêm người chơi">
            <span>+</span>
            <strong>Thêm người chơi</strong>
          </button>
        </div>
      ) : null}

      <PlayerTable game={game} onEdit={setEditingPlayer} onDelete={deletePlayer} />

      {editingPlayer !== undefined ? (
        <PlayerModal
          player={editingPlayer}
          chipUnit={game.chipUnit}
          moneyPerUnit={game.moneyPerUnit}
          onSave={savePlayer}
          onClose={() => setEditingPlayer(undefined)}
        />
      ) : null}
    </main>
  );
}
