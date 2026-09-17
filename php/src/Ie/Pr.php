<?php

declare(strict_types=1);

namespace BrValidator\Ie;

use BrValidator\Shared\Digits;
use BrValidator\Shared\Mod11;

/**
 * Verified against the official SEFAZ-PR "Roteiro de Critica da Inscricao
 * Estadual" (sintegra.gov.br/Cad_Estados/cad_PR.html), including its
 * fully worked example (123.45678-50), and cross-checked against the
 * reference Visual Basic routine published on the same page. Format: 8
 * digits + 2 check digits.
 *
 * Not part of the public API - use BrValidator\Ie.
 */
final class Pr
{
    private const ALLOWED_CHARS = '/^[\d.\-\s]+$/';
    private const FIRST_DIGIT_WEIGHTS = [3, 2, 7, 6, 5, 4, 3, 2];
    private const SECOND_DIGIT_WEIGHTS = [4, 3, 2, 7, 6, 5, 4, 3, 2];

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

        if (strlen($v) !== 10) {
            return false;
        }

        $base = substr($v, 0, 8);
        $firstDigit = Mod11::checkDigit(Mod11::weightedSum($base, self::FIRST_DIGIT_WEIGHTS));

        if ($firstDigit !== (int) $v[8]) {
            return false;
        }

        $secondDigit = Mod11::checkDigit(Mod11::weightedSum($base . (string) $firstDigit, self::SECOND_DIGIT_WEIGHTS));

        return $secondDigit === (int) $v[9];
    }

    public static function format(string $value): string
    {
        $v = self::normalize($value);

        if (strlen($v) !== 10) {
            return $value;
        }

        return substr($v, 0, 3) . '.' . substr($v, 3, 5) . '-' . substr($v, 8, 2);
    }
}
