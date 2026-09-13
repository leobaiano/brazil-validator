"""Validates, normalizes, and formats Brazilian Inscrição Estadual numbers.

Inscrição Estadual has no single national rule: each state (SEFAZ) defines
its own digit count and check-digit algorithm, so every UF is modeled as
its own private module in this package and registered in the _STATES map
below. A UF absent from that map is simply not supported yet.
"""

from typing import NamedTuple

from . import (
    _ac,
    _al,
    _am,
    _ap,
    _ba,
    _ce,
    _df,
    _es,
    _go,
    _ma,
    _mg,
    _ms,
    _mt,
    _pa,
    _pb,
    _pe,
    _pi,
    _pr,
    _rj,
    _rn,
    _ro,
    _rr,
    _rs,
    _sc,
    _se,
    _sp,
    _to,
)


class _StateValidator(NamedTuple):
    is_valid: callable
    normalize: callable
    format: callable


_STATES = {
    "AC": _StateValidator(_ac.is_valid, _ac.normalize, _ac.format),
    "AL": _StateValidator(_al.is_valid, _al.normalize, _al.format),
    "AM": _StateValidator(_am.is_valid, _am.normalize, _am.format),
    "AP": _StateValidator(_ap.is_valid, _ap.normalize, _ap.format),
    "BA": _StateValidator(_ba.is_valid, _ba.normalize, _ba.format),
    "CE": _StateValidator(_ce.is_valid, _ce.normalize, _ce.format),
    "DF": _StateValidator(_df.is_valid, _df.normalize, _df.format),
    "ES": _StateValidator(_es.is_valid, _es.normalize, _es.format),
    "GO": _StateValidator(_go.is_valid, _go.normalize, _go.format),
    "MA": _StateValidator(_ma.is_valid, _ma.normalize, _ma.format),
    "MG": _StateValidator(_mg.is_valid, _mg.normalize, _mg.format),
    "MS": _StateValidator(_ms.is_valid, _ms.normalize, _ms.format),
    "MT": _StateValidator(_mt.is_valid, _mt.normalize, _mt.format),
    "PA": _StateValidator(_pa.is_valid, _pa.normalize, _pa.format),
    "PB": _StateValidator(_pb.is_valid, _pb.normalize, _pb.format),
    "PE": _StateValidator(_pe.is_valid, _pe.normalize, _pe.format),
    "PI": _StateValidator(_pi.is_valid, _pi.normalize, _pi.format),
    "PR": _StateValidator(_pr.is_valid, _pr.normalize, _pr.format),
    "RJ": _StateValidator(_rj.is_valid, _rj.normalize, _rj.format),
    "RN": _StateValidator(_rn.is_valid, _rn.normalize, _rn.format),
    "RO": _StateValidator(_ro.is_valid, _ro.normalize, _ro.format),
    "RR": _StateValidator(_rr.is_valid, _rr.normalize, _rr.format),
    "RS": _StateValidator(_rs.is_valid, _rs.normalize, _rs.format),
    "SC": _StateValidator(_sc.is_valid, _sc.normalize, _sc.format),
    "SE": _StateValidator(_se.is_valid, _se.normalize, _se.format),
    "SP": _StateValidator(_sp.is_valid, _sp.normalize, _sp.format),
    "TO": _StateValidator(_to.is_valid, _to.normalize, _to.format),
}


def _resolve_state(uf: str):
    return _STATES.get(uf.strip().upper())


def is_valid(value: str, uf: str) -> bool:
    """Return True if value is a valid Inscrição Estadual for uf."""
    state = _resolve_state(uf)

    if state is None:
        return False

    return state.is_valid(value)


def normalize(value: str, uf: str) -> str:
    """Strip formatting and return the canonical representation of value for uf.

    If uf is not supported, value is returned unchanged.
    """
    state = _resolve_state(uf)

    if state is None:
        return value

    return state.normalize(value)


def format(value: str, uf: str) -> str:
    """Return value in uf's standard human-readable representation.

    If uf is not supported or the normalized value has an invalid length,
    value is returned unchanged.
    """
    state = _resolve_state(uf)

    if state is None:
        return value

    return state.format(value)
