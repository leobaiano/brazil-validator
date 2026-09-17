<?php

declare(strict_types=1);

namespace BrValidator\Ie;

use BrValidator\Shared\Digits;
use BrValidator\Shared\Mod11;

/**
 * Verified against the official SEFAZ-MS "Roteiro de Critica da Inscricao
 * Estadual" (sintegra.gov.br/Cad_Estados/cad_MS.html) for the algorithm
 * (which the page does not accompany with a worked numeric example), plus
 * an independently hand-computed regression vector (281234566). Format: 8
 * digits (always starting with "28" or "50") + 1 check digit.
 *
 * Not part of the public API - use BrValidator\Ie.
 */
final class Ms
{
    private const ALLOWED_CHARS = '/^[\d\s]+$/';
    private const WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2];

    private function __construct()
    {
    }

    public static function normalize(string $value): string
    {
        return Digits::removeNonDigits($value);
    }

    private static function hasValidPrefix(string $v): bool
    {
        $prefix = substr($v, 0, 2);

        return $prefix === '28' || $prefix === '50';
    }

    public static function isValid(string $value): bool
    {
        if (!preg_match(self::ALLOWED_CHARS, $value)) {
            return false;
        }

        $v = self::normalize($value);

        if (strlen($v) !== 9 || !self::hasValidPrefix($v)) {
            return false;
        }

        return Mod11::checkDigit(Mod11::weightedSum($v, self::WEIGHTS)) === (int) $v[8];
    }

    public static function format(string $value): string
    {
        return self::normalize($value);
    }
}
