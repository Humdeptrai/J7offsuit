import { useMemo, useState } from 'react';
import type { Player } from '../types';
import { formatChip, formatMoney, signed } from '../format';

export type PlayerFormValue = {
  name: string;
  buyInChip: number;
  cashOutChip: number;
};

type Props = {
  player?: Player | null;
  chipUnit: number;
  moneyPerUnit: number;
  onSave: (value: PlayerFormValue) => Promise<void> | void;
  onClose: () => void;
};

function toNumber(value: string) {
  if (value.trim() === '') return 0;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.floor(n);
}

function chipToMoney(chip: number, chipUnit: number, moneyPerUnit: number) {
  return Math.round((chip * moneyPerUnit) / chipUnit);
}

export default function PlayerModal({ player, chipUnit, moneyPerUnit, onSave, onClose }: Props) {
  const [name, setName] = useState(player?.name ?? '');
  const [buyInChip, setBuyInChip] = useState(String(player?.buyInChip ?? ''));
  const [cashOutChip, setCashOutChip] = useState(player && player.cashOutChip > 0 ? String(player.cashOutChip) : '');
  const [confirmClose, setConfirmClose] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const current = useMemo(() => {
    const buy = toNumber(buyInChip);
    const cash = toNumber(cashOutChip);
    const pl = cash - buy;
    return {
      buy,
      cash,
      pl,
      buyMoney: chipToMoney(buy, chipUnit, moneyPerUnit),
      cashMoney: chipToMoney(cash, chipUnit, moneyPerUnit),
      plMoney: chipToMoney(pl, chipUnit, moneyPerUnit),
    };
  }, [buyInChip, cashOutChip, chipUnit, moneyPerUnit]);

  const dirty = name !== (player?.name ?? '')
      || toNumber(buyInChip) !== (player?.buyInChip ?? 0)
      || toNumber(cashOutChip) !== (player?.cashOutChip ?? 0);

  async function handleSave() {
    if (!name.trim()) {
      setErrorMessage('Tên người chơi không được để trống');
      return;
    }
    setSaving(true);
    try {
      await onSave({ name: name.trim(), buyInChip: current.buy, cashOutChip: current.cash });
    } finally {
      setSaving(false);
    }
  }

  function requestClose() {
    if (dirty) setConfirmClose(true);
    else onClose();
  }

  return (
      <>
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-head">
              <h2>{player ? 'Sửa người chơi' : 'Thêm người chơi'}</h2>
              <button className="icon-button" onClick={requestClose}>×</button>
            </div>

            <label>
              Tên người chơi
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ví dụ: A" autoFocus />
            </label>

            <div className="form-grid">
              <label>
                Buy-in / Total rebuy
                <input
                    type="number"
                    min="0"
                    inputMode="numeric"
                    value={buyInChip}
                    onChange={(e) => setBuyInChip(e.target.value)}
                    placeholder="0"
                />
                <small>{formatMoney(current.buyMoney)}</small>
              </label>
              <label>
                Cash out
                <input
                    type="number"
                    min="0"
                    inputMode="numeric"
                    value={cashOutChip}
                    onChange={(e) => setCashOutChip(e.target.value)}
                    placeholder="Bỏ trống = 0"
                />
                <small>{formatMoney(current.cashMoney)}</small>
              </label>
            </div>

            <div className={`live-result ${current.pl > 0 ? 'positive' : current.pl < 0 ? 'negative' : ''}`}>
              <span>Lãi/Lỗ hiện tại</span>
              <strong>{signed(current.pl, formatChip)} chip</strong>
              <small>{signed(current.plMoney, formatMoney)}</small>
            </div>

            <div className="modal-actions">
              <button className="secondary" onClick={requestClose}>Đóng</button>
              <button className="primary" onClick={handleSave} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
            </div>
          </div>
        </div>

        {errorMessage ? (
            <div className="modal-backdrop delete-confirm-backdrop">
              <div className="delete-confirm-dialog">
                <p>{errorMessage}</p>
                <div className="delete-confirm-actions">
                  <button className="primary" onClick={() => setErrorMessage('')}>OK</button>
                </div>
              </div>
            </div>
        ) : null}

        {confirmClose ? (
            <div className="modal-backdrop delete-confirm-backdrop">
              <div className="delete-confirm-dialog">
                <p>Bạn có thay đổi chưa lưu. Bạn muốn làm gì?</p>
                <div className="delete-confirm-actions">
                  <button className="secondary" onClick={() => setConfirmClose(false)}>Tiếp tục sửa</button>
                  <button className="secondary" onClick={onClose}>Không lưu</button>
                  <button className="primary" onClick={handleSave}>Lưu</button>
                </div>
              </div>
            </div>
        ) : null}
      </>
  );
}