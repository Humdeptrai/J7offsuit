export type Player = {
  id: string;
  name: string;
  buyInChip: number;
  cashOutChip: number;
  profitLossChip: number;
  buyInMoney: number;
  cashOutMoney: number;
  profitLossMoney: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type Game = {
  id: string;
  name: string;
  chipUnit: number;
  moneyPerUnit: number;
  totalBuyInChip: number;
  totalCashOutChip: number;
  differenceChip: number;
  totalBuyInMoney: number;
  totalCashOutMoney: number;
  differenceMoney: number;
  canEdit: boolean;
  canDelete: boolean;
  ownerToken?: string | null;
  viewToken?: string | null;
  editToken?: string | null;
  players: Player[];
  createdAt: string;
  updatedAt: string;
};

export type OwnedGameRef = {
  id: string;
  name: string;
  ownerToken: string;
  updatedAt: string;
};
