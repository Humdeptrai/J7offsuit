import type { Game } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ?? `${window.location.protocol}//${window.location.hostname}:8080/api`;

type CreateGamePayload = {
  name?: string;
  chipUnit?: number;
  moneyPerUnit?: number;
};

type UpdateGamePayload = Partial<CreateGamePayload>;

type PlayerPayload = {
  name: string;
  buyInChip: number;
  cashOutChip: number;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    try {
      const body = await response.json();
      message = body.message ?? message;
    } catch {
      // ignore parse error
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  createGame(payload: CreateGamePayload) {
    return request<Game>('/games', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getGame(gameId: string, token: string) {
    return request<Game>(`/games/${gameId}?token=${encodeURIComponent(token)}`);
  },

  updateGame(gameId: string, token: string, payload: UpdateGamePayload) {
    return request<Game>(`/games/${gameId}?token=${encodeURIComponent(token)}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  deleteGame(gameId: string, token: string) {
    return request<void>(`/games/${gameId}?token=${encodeURIComponent(token)}`, {
      method: 'DELETE',
    });
  },

  addPlayer(gameId: string, token: string, payload: PlayerPayload) {
    return request<Game>(`/games/${gameId}/players?token=${encodeURIComponent(token)}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updatePlayer(gameId: string, playerId: string, token: string, payload: PlayerPayload) {
    return request<Game>(`/games/${gameId}/players/${playerId}?token=${encodeURIComponent(token)}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  deletePlayer(gameId: string, playerId: string, token: string) {
    return request<Game>(`/games/${gameId}/players/${playerId}?token=${encodeURIComponent(token)}`, {
      method: 'DELETE',
    });
  },

  getSharedGame(token: string) {
    return request<Game>(`/shared/${encodeURIComponent(token)}`);
  },

  updateSharedGame(token: string, gameId: string, payload: UpdateGamePayload) {
    return request<Game>(`/shared/${encodeURIComponent(token)}/games/${gameId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  addSharedPlayer(token: string, gameId: string, payload: PlayerPayload) {
    return request<Game>(`/shared/${encodeURIComponent(token)}/games/${gameId}/players`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateSharedPlayer(token: string, gameId: string, playerId: string, payload: PlayerPayload) {
    return request<Game>(`/shared/${encodeURIComponent(token)}/games/${gameId}/players/${playerId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  deleteSharedPlayer(token: string, gameId: string, playerId: string) {
    return request<Game>(`/shared/${encodeURIComponent(token)}/games/${gameId}/players/${playerId}`, {
      method: 'DELETE',
    });
  },
};
