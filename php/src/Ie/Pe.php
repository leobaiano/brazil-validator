<?php

declare(strict_types=1);

namespace BrValidator\Ie;

use BrValidator\Shared\Digits;
use BrValidator\Shared\Mod11;

/**
 * Verified against the official SEFAZ-PE "Roteiro de Critica da Inscricao
 * Estadual" for the e-Fisco system (sintegra.gov.br/Cad_Estados/cad_PE.html),
 * including its fully worked example (0321418-40). Format: 7 digits + 2
 * check digits.
 *
 * Not part of the public API - use BrValidator\Ie.
 */
final class Pe
{
    private const ALLOWED_CHARS = '/^[\d\-\s]+$/';
    private const FIRST_DIGIT_WEIGHTS = [8, 7, 6, 5, 4, 3, 2];
    private const SECOND_DIGIT_WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2];

    private function __construct()
    {
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

        if (strlen($v) !== 9) {
            return false;
        }

        $base = substr($v, 0, 7);
        $firstDigit = Mod11::checkDigit(Mod11::weightedSum($base, self::FIRST_DIGIT_WEIGHTS));

        if ($firstDigit !== (int) $v[7]) {
            return false;
        }

        $secondDigit = Mod11::checkDigit(Mod11::weightedSum($base . (string) $firstDigit, self::SECOND_DIGIT_WEIGHTS));

        return $secondDigit === (int) $v[8];
    }

    public static function format(string $value): string
    {
        $v = self::normalize($value);

        if (strlen($v) !== 9) {
            return $value;
        }

        return substr($v, 0, 7) . '-' . substr($v, 7, 2);
    }
}
