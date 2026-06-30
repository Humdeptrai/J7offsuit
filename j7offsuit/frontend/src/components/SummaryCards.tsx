import type { Game } from '../types';
import { formatChip, formatMoney, getDiffLabel, signed } from '../format';

export default function SummaryCards({ game }: { game: Game }) {
  const diffClass = game.differenceChip === 0 ? 'ok' : game.differenceChip > 0 ? 'negative' : 'positive';

  return (
    <section className="summary-grid">
      <div className="card metric-card">
        <span>Total Buy-in</span>
        <strong>{formatChip(game.totalBuyInChip)} chip</strong>
        <small>{formatMoney(game.totalBuyInMoney)}</small>
      </div>
      <div className="card metric-card">
        <span>Total Cash out</span>
        <strong>{formatChip(game.totalCashOutChip)} chip</strong>
        <small>{formatMoney(game.totalCashOutMoney)}</small>
      </div>
      <div className={`card metric-card ${diffClass}`}>
        <span>Difference</span>
        <strong>{signed(game.differenceChip, formatChip)} chip</strong>
        <small>{signed(game.differenceMoney, formatMoney)}</small>
      </div>
      <div className="card metric-card rate-card">
        <span>Table status</span>
        <strong>{getDiffLabel(game.differenceChip)}</strong>
        <small>{formatChip(game.chipUnit)} chip = {formatMoney(game.moneyPerUnit)}</small>
      </div>
    </section>
  );
}
