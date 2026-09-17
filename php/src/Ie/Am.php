<?php

declare(strict_types=1);

namespace BrValidator\Ie;

use BrValidator\Shared\Digits;
use BrValidator\Shared\Mod11;

/**
 * Verified against the official SEFAZ-AM "Roteiro de Critica da Inscricao
 * Estadual" (sintegra.gov.br/Cad_Estados/cad_AM.html). Format:
 * 99.999.999-9 (8 digits + 1 check digit). Unlike most other states, when
 * the weighted sum itself is below 11 the digit is 11 minus the sum
 * directly (skipping the modulo step).
 *
 * Not part of the public API - use BrValidator\Ie.
 */
final class Am
{
    private const ALLOWED_CHARS = '/^[\d.\-\s]+$/';
    private const WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2];

    private function __construct()
    {
    }

    public static function normalize(string $value): string
    {
        return Digits::removeNonDigits($value);
    }

    private static function calculateCheckDigit(string $v): int
    {
        $sum = Mod11::weightedSum($v, self::WEIGHTS);

        if ($sum < 11) {
            return 11 - $sum;
        }

        return Mod11::checkDigit($sum);
    }

    public static function isValid(string $value): bool
    {
        if (!preg_match(self::ALLOWED_CHARS, $value)) {
            return false;
        }

        $v = self::normalize($value);

        if (strlen($v) !== 9) {
            return false;
        }

        return self::calculateCheckDigit($v) === (int) $v[8];
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
