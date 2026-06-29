import type { Game, Player } from '../types';
import { formatChip, formatMoney, signed } from '../format';

type Props = {
  game: Game;
  onEdit: (player: Player) => void;
  onDelete: (player: Player) => void;
};

export default function PlayerTable({ game, onEdit, onDelete }: Props) {
  if (game.players.length === 0) {
    return <div className="empty-box poker-empty">Chưa có người chơi. Bấm "+" để bắt đầu nhập liệu.</div>;
  }

  return (
    <div className="table-card player-board">
      <div className="table-card-head">
        <div>
          <p className="eyebrow">Players</p>
          <h2>Chip ledger</h2>
        </div>
        <span>{game.players.length} player</span>
      </div>

      {/* Desktop table – ẩn trên mobile */}
      <div className="player-table-scroll player-board-table">
        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Buy-in</th>
              <th>Cash out</th>
              <th>Lãi/Lỗ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {game.players.map((player) => (
              <tr key={player.id}>
                <td data-label="Player">
                  <strong>{player.name}</strong>
                </td>
                <td data-label="Buy-in">
                  <strong>{formatChip(player.buyInChip)}</strong>
                  <small>{formatMoney(player.buyInMoney)}</small>
                </td>
                <td data-label="Cash out">
                  <strong>{formatChip(player.cashOutChip)}</strong>
                  <small>{formatMoney(player.cashOutMoney)}</small>
                </td>
                <td data-label="Lãi/Lỗ" className={player.profitLossChip > 0 ? 'positive-text' : player.profitLossChip < 0 ? 'negative-text' : ''}>
                  <strong>{signed(player.profitLossChip, formatChip)}</strong>
                  <small>{signed(player.profitLossMoney, formatMoney)}</small>
                </td>
                <td data-label="Action" className="row-actions">
                  {game.canEdit ? <button onClick={() => onEdit(player)}>Sửa</button> : null}
                  {game.canEdit ? <button className="danger" onClick={() => onDelete(player)}>Xóa</button> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list – ẩn trên desktop */}
      <div className="player-board-cards">
        <div className="player-cards-scroll">
          {game.players.map((player) => {
            const plClass = player.profitLossChip > 0 ? 'positive-text' : player.profitLossChip < 0 ? 'negative-text' : '';
            return (
              <div key={player.id} className="player-card">
                <div className="player-card-header">
                  <span className="player-card-name">{player.name}</span>
                  {game.canEdit ? (
                    <div className="player-card-actions">
                      <button className="secondary" onClick={() => onEdit(player)}>Sửa</button>
                      <button className="danger" onClick={() => onDelete(player)}>Xóa</button>
                    </div>
                  ) : null}
                </div>
                <div className="player-card-stats">
                  <div className="player-stat">
                    <span>Buy-in</span>
                    <strong>{formatChip(player.buyInChip)} chip</strong>
                    <small>{formatMoney(player.buyInMoney)}</small>
                  </div>
                  <div className="player-stat">
                    <span>Cash out</span>
                    <strong>{formatChip(player.cashOutChip)} chip</strong>
                    <small>{formatMoney(player.cashOutMoney)}</small>
                  </div>
                  <div className={`player-stat player-stat-pl ${plClass}`}>
                    <span>Lãi / Lỗ</span>
                    <strong>{signed(player.profitLossChip, formatChip)} chip</strong>
                    <small>{signed(player.profitLossMoney, formatMoney)}</small>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
