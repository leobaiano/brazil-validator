import { AC } from "./states/ac.js";
import { AL } from "./states/al.js";
import { AM } from "./states/am.js";
import { AP } from "./states/ap.js";
import { BA } from "./states/ba.js";
import { CE } from "./states/ce.js";
import { DF } from "./states/df.js";
import { ES } from "./states/es.js";
import { GO } from "./states/go.js";
import { MA } from "./states/ma.js";
import { MG } from "./states/mg.js";
import { MS } from "./states/ms.js";
import { MT } from "./states/mt.js";
import { PA } from "./states/pa.js";
import { PB } from "./states/pb.js";
import { PE } from "./states/pe.js";
import { PI } from "./states/pi.js";
import { PR } from "./states/pr.js";
import { RJ } from "./states/rj.js";
import { RN } from "./states/rn.js";
import { RO } from "./states/ro.js";
import { RR } from "./states/rr.js";
import { RS } from "./states/rs.js";
import { SC } from "./states/sc.js";
import { SE } from "./states/se.js";
import { SP } from "./states/sp.js";
import { TO } from "./states/to.js";

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
  AC,
  AL,
  AM,
  AP,
  BA,
  CE,
  DF,
  ES,
  GO,
  MA,
  MG,
  MS,
  MT,
  PA,
  PB,
  PE,
  PI,
  PR,
  RJ,
  RN,
  RO,
  RR,
  RS,
  SC,
  SE,
  SP,
  TO,
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
