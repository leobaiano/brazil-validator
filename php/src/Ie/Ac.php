<?php

declare(strict_types=1);

namespace BrValidator\Ie;

use BrValidator\Shared\Digits;
use BrValidator\Shared\Mod11;

/**
 * Verified against the official SEFAZ-AC "Roteiro de Critica da Inscricao
 * Estadual" (sintegra.gov.br/Cad_Estados/cad_AC.html), including its
 * worked example (01.004.823/001-12). Format: 11 digits (always starting
 * with "01") + 2 check digits.
 *
 * Not part of the public API - use BrValidator\Ie.
 */
final class Ac
{
    private const ALLOWED_CHARS = '/^[\d.\/\-\s]+$/';
    private const FIRST_DIGIT_WEIGHTS = [4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    private const SECOND_DIGIT_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

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

        if (strlen($v) !== 13 || substr($v, 0, 2) !== '01') {
            return false;
        }

        $firstDigit = Mod11::checkDigit(Mod11::weightedSum($v, self::FIRST_DIGIT_WEIGHTS));

        if ($firstDigit !== (int) $v[11]) {
            return false;
        }

        $secondDigit = Mod11::checkDigit(Mod11::weightedSum($v, self::SECOND_DIGIT_WEIGHTS));

        return $secondDigit === (int) $v[12];
    }

    public static function format(string $value): string
    {
        $v = self::normalize($value);

        if (strlen($v) !== 13) {
            return $value;
        }

        return substr($v, 0, 2) . '.' . substr($v, 2, 3) . '.' . substr($v, 5, 3) . '/' . substr($v, 8, 3) . '-' . substr($v, 11, 2);
    }
}
