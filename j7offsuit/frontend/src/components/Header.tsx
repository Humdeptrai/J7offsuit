import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type HeaderProps = {
    title: string;
    subtitle?: string;
    actions?: ReactNode;
};

export default function Header({ title, subtitle, actions }: HeaderProps) {
    return (
        <header className="header">
            <Link className="brand" to="/" aria-label="Về trang chính">
                <span className="brand-back" aria-hidden="true">←</span>

                <span className="brand-emblem" aria-hidden="true">
          <span className="brand-card brand-card-left">J♠</span>
          <span className="brand-card brand-card-right">7♥</span>
        </span>

                <span className="brand-text">
          <strong>J7offsuit</strong>
          <small>Develop by HUM</small>
        </span>
            </Link>

            <div className="header-copy">
                <p className="eyebrow">CHUBI POKER GAME HOME</p>
                <h1>{title}</h1>

                {subtitle ? (
                    <p className="header-subtitle">{subtitle}</p>
                ) : null}
            </div>

            {actions ? <div className="header-actions">{actions}</div> : null}
        </header>
    );
}