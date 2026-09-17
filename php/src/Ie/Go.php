<?php

declare(strict_types=1);

namespace BrValidator\Ie;

use BrValidator\Shared\Digits;
use BrValidator\Shared\Mod11;

/**
 * Verified against the official SEFAZ-GO "Roteiro de Critica da Inscricao
 * Estadual" (sintegra.gov.br/Cad_Estados/cad_GO.html), including its
 * worked example (10.987.654-7). Format: AB.CDE.FGH-I, where AB must be
 * 10, 11, or 20-29.
 *
 * Not part of the public API - use BrValidator\Ie.
 */
final class Go
{
    private const ALLOWED_CHARS = '/^[\d.\-\s]+$/';
    private const WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2];

    private function __construct()
    {
    }

    private static function hasValidPrefix(string $v): bool
    {
        $prefix = (int) substr($v, 0, 2);

        return $prefix === 10 || $prefix === 11 || ($prefix >= 20 && $prefix <= 29);
    }

    public static function normalize(string $value): string
    {
        return Digits::removeNonDigits($value);
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
        $v = self::normalize($value);

        if (strlen($v) !== 9) {
            return $value;
        }

        return substr($v, 0, 2) . '.' . substr($v, 2, 3) . '.' . substr($v, 5, 3) . '-' . substr($v, 8, 1);
    }
}
