<?php

declare(strict_types=1);

namespace BrValidator\Ie;

use BrValidator\Shared\Digits;

/**
 * Verified against the official SEFAZ-RO "Roteiro de Critica da Inscricao
 * Estadual" (sintegra.gov.br/Cad_Estados/cad_RO.html), including its
 * worked example (0000000062521-3). Since 01/08/2000 the format is 13
 * digits + 1 check digit (the old "municipio + empresa" layout is
 * superseded, with old registrations re-expressed by zero-padding into
 * the new 13-digit field).
 *
 * The weights cycle 2-9 applied right to left over the 13 digits, i.e.
 * [6,5,4,3,2,9,8,7,6,5,4,3,2] read left to right. Unlike most other
 * states, a zero remainder maps to check digit 1, not 0 (the source
 * explicitly says "subtract 10" from the 11-or-10 result, rather than
 * mapping straight to 0).
 *
 * Not part of the public API - use BrValidator\Ie.
 */
final class Ro
{
    private const ALLOWED_CHARS = '/^[\d.\-\s]+$/';
    private const WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    private function __construct()
    {
    }

    public static function normalize(string $value): string
    {
        return Digits::removeNonDigits($value);
    }

    private static function calculateCheckDigit(string $base): int
    {
        $sum = 0;

        foreach (self::WEIGHTS as $i => $weight) {
            $sum += (int) $base[$i] * $weight;
        }

        $remainder = $sum % 11;
        $diff = 11 - $remainder;

        if ($diff > 9) {
            return $diff - 10;
        }

        return $diff;
    }

    public static function isValid(string $value): bool
    {
        if (!preg_match(self::ALLOWED_CHARS, $value)) {
            return false;
        }

        $v = self::normalize($value);

        if (strlen($v) !== 14) {
            return false;
        }

        return self::calculateCheckDigit(substr($v, 0, 13)) === (int) $v[13];
    }

    public static function format(string $value): string
    {
        $v = self::normalize($value);

        if (strlen($v) !== 14) {
            return $value;
        }

        return substr($v, 0, 13) . '-' . substr($v, 13, 1);
    }
}
