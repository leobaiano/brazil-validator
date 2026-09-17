<?php

declare(strict_types=1);

namespace BrValidator\Ie;

use BrValidator\Shared\Digits;
use BrValidator\Shared\Mod11;

/**
 * Verified against the official SEFAZ-RJ "Roteiro de Critica da Inscricao
 * Estadual" (sintegra.gov.br/Cad_Estados/cad_RJ.html) for the check-digit
 * rule, and cross-checked against a worked example (99.999.99-3) for the
 * weights, which the Sintegra page itself does not enumerate.
 *
 * Not part of the public API - use BrValidator\Ie.
 */
final class Rj
{
    private const ALLOWED_CHARS = '/^[\d.\-\s]+$/';
    private const WEIGHTS = [2, 7, 6, 5, 4, 3, 2];

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
        $remainder = $sum % 11;

        if ($remainder <= 1) {
            return 0;
        }

        return 11 - $remainder;
    }

    public static function isValid(string $value): bool
    {
        if (!preg_match(self::ALLOWED_CHARS, $value)) {
            return false;
        }

        $v = self::normalize($value);

        if (strlen($v) !== 8) {
            return false;
        }

        return self::calculateCheckDigit($v) === (int) $v[7];
    }

    public static function format(string $value): string
    {
        $v = self::normalize($value);

        if (strlen($v) !== 8) {
            return $value;
        }

        return substr($v, 0, 2) . '.' . substr($v, 2, 3) . '.' . substr($v, 5, 2) . '-' . substr($v, 7, 1);
    }
}
