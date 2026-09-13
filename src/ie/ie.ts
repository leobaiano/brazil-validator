import { SP } from "./states/sp.js";
import { RJ } from "./states/rj.js";
import { MG } from "./states/mg.js";

interface StateIE {
  isValid(value: string): boolean;
  normalize(value: string): string;
  format(value: string): string;
}

// Inscrição Estadual has no single national rule: each state (SEFAZ) defines
// its own digit count and check-digit algorithm, so every UF is modeled as
// its own module under ./states and registered here explicitly. A UF absent
// from this map is simply not supported yet.
const STATES: Record<string, StateIE> = {
  SP,
  RJ,
  MG,
};

function resolveState(uf: string): StateIE | undefined {
  return STATES[uf.trim().toUpperCase()];
}

function isValid(value: string, uf: string): boolean {
  const state = resolveState(uf);

  if (!state) {
    return false;
  }

  return state.isValid(value);
}

function normalize(value: string, uf: string): string {
  const state = resolveState(uf);

  if (!state) {
    return value;
  }

  return state.normalize(value);
}

function format(value: string, uf: string): string {
  const state = resolveState(uf);

  if (!state) {
    return value;
  }

  return state.format(value);
}

export const IE = {
  isValid,
  normalize,
  format,
};
