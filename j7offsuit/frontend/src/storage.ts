import type { OwnedGameRef } from './types';

const KEY = 'j7offsuit.ownedGames';

export function getOwnedGames(): OwnedGameRef[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((game): game is OwnedGameRef => Boolean(game?.id && game?.name && game?.ownerToken && game?.updatedAt))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch {
    return [];
  }
}

export function saveOwnedGame(ref: OwnedGameRef) {
  const games = getOwnedGames();
  const next = [ref, ...games.filter((g) => g.id !== ref.id)];
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function removeOwnedGame(gameId: string) {
  const games = getOwnedGames().filter((g) => g.id !== gameId);
  localStorage.setItem(KEY, JSON.stringify(games));
}

export function findOwnedGame(gameId: string) {
  return getOwnedGames().find((game) => game.id === gameId);
}
