import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import SummaryCards from '../components/SummaryCards';
import PlayerTable from '../components/PlayerTable';
import PlayerModal, { type PlayerFormValue } from '../components/PlayerModal';
import ShareModal from '../components/ShareModal';
import { api } from '../api';
import { findOwnedGame, saveOwnedGame } from '../storage';
import type { Game, Player } from '../types';

export default function GamePage() {
  const { gameId } = useParams();
  const [searchParams] = useSearchParams();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPlayer, setEditingPlayer] = useState<Player | null | undefined>(undefined);
  const [shareOpen, setShareOpen] = useState(false);
  const [deletingPlayer, setDeletingPlayer] = useState<Player | null>(null);

  const token = useMemo(() => {
    const queryToken = searchParams.get('token');
    if (queryToken) return queryToken;
    if (!gameId) return '';
    return findOwnedGame(gameId)?.ownerToken ?? '';
  }, [gameId, searchParams]);

  async function load() {
    if (!gameId || !token) {
      setError('Không tìm thấy owner token cho game này. Hãy mở bằng owner link hoặc tạo game mới.');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await api.getGame(gameId, token);
      setGame(data);
      if (data.ownerToken) {
        saveOwnedGame({ id: data.id, name: data.name, ownerToken: data.ownerToken, updatedAt: data.updatedAt });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được game');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId, token]);

  async function savePlayer(value: PlayerFormValue) {
    if (!game || !gameId) return;
    const next = editingPlayer
        ? await api.updatePlayer(gameId, editingPlayer.id, token, value)
        : await api.addPlayer(gameId, token, value);
    setGame(next);
    if (next.ownerToken) saveOwnedGame({ id: next.id, name: next.name, ownerToken: next.ownerToken, updatedAt: next.updatedAt });
    setEditingPlayer(undefined);
  }

  function requestDeletePlayer(player: Player) {
    setDeletingPlayer(player);
  }

  async function confirmDeletePlayer() {
    if (!game || !gameId || !deletingPlayer) return;
    const next = await api.deletePlayer(gameId, deletingPlayer.id, token);
    setGame(next);
    setDeletingPlayer(null);
  }

  if (loading) return <main><Header title="Đang tải..." /></main>;
  if (error) return <main><Header title="Không mở được game" /><div className="empty-box">{error}</div><Link to="/">Về trang chính</Link></main>;
  if (!game) return null;

  return (
      <main className="page game-page">
        <Header
            title={game.name}
            actions={<button className="share-button" onClick={() => setShareOpen(true)}>Chia sẻ</button>}
        />

        <SummaryCards game={game} />

        {game.canEdit ? (
            <div className="quick-add-bar">
              <button className="add-player-button" onClick={() => setEditingPlayer(null)} aria-label="Thêm người chơi">
                <span>+</span>
                <strong>Thêm người chơi</strong>
              </button>
            </div>
        ) : null}

        <PlayerTable game={game} onEdit={setEditingPlayer} onDelete={requestDeletePlayer} />

        {editingPlayer !== undefined ? (
            <PlayerModal
                player={editingPlayer}
                chipUnit={game.chipUnit}
                moneyPerUnit={game.moneyPerUnit}
                onSave={savePlayer}
                onClose={() => setEditingPlayer(undefined)}
            />
        ) : null}

        {shareOpen ? <ShareModal game={game} onClose={() => setShareOpen(false)} /> : null}

        {/* Delete confirmation dialog */}
        {deletingPlayer ? (
            <div className="modal-backdrop delete-confirm-backdrop">
              <div className="delete-confirm-dialog">
                <p>Bạn có muốn xoá người chơi <strong>{deletingPlayer.name}</strong> không?</p>
                <div className="delete-confirm-actions">
                  <button className="danger" onClick={confirmDeletePlayer}>Có</button>
                  <button className="secondary" onClick={() => setDeletingPlayer(null)}>Không</button>
                </div>
              </div>
            </div>
        ) : null}
      </main>
  );
}