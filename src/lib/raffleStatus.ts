import type { Raffle } from "./types";

export function isRaffleFinished(raffle: Raffle): boolean {
  return raffle.status === "finished";
}
