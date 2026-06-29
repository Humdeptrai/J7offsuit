import type { Game } from '../types';

type Props = {
  game: Game;
  onClose: () => void;
};

function copy(value: string) {
  navigator.clipboard.writeText(value);
}

export default function ShareModal({ game, onClose }: Props) {
  const origin = window.location.origin;
  const viewLink = game.viewToken ? `${origin}/share/${game.viewToken}` : '';
  const editLink = game.editToken ? `${origin}/share/${game.editToken}` : '';
  const ownerLink = game.ownerToken ? `${origin}/games/${game.id}?token=${game.ownerToken}` : '';

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-head">
          <h2>Chia sẻ game</h2>
          <button className="icon-button" onClick={onClose}>×</button>
        </div>
        <div className="share-list">
          <ShareField label="Link chỉ xem" value={viewLink} />
          <ShareField label="Link chỉnh sửa" value={editLink} />
          <ShareField label="Owner link - giữ riêng cho banker" value={ownerLink} />
        </div>
        <p className="warning-text">Không gửi link chỉnh sửa hoặc owner link cho người không tin tưởng.</p>
      </div>
    </div>
  );
}

function ShareField({ label, value }: { label: string; value: string }) {
  return (
    <label>
      {label}
      <div className="copy-row">
        <input readOnly value={value} />
        <button onClick={() => copy(value)}>Copy</button>
      </div>
    </label>
  );
}
