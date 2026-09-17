<?php

declare(strict_types=1);

namespace BrValidator\Ie;

use BrValidator\Shared\Digits;
use BrValidator\Shared\Mod11;

/**
 * Verified against the official SEFAZ-RN "Roteiro de Critica da Inscricao
 * Estadual" (sintegra.gov.br/Cad_Estados/cad_RN.html), including both of
 * its worked examples (20.040.040-1 and 20.0.040.040-0). Format: always
 * starts with "20", followed by either 7 or 8 more digits, plus 1 check
 * digit (9 or 10 digits total, both still valid today per the official
 * page).
 *
 * Not part of the public API - use BrValidator\Ie.
 */
final class Rn
{
    private const ALLOWED_CHARS = '/^[\d.\-\s]+$/';

    private function __construct()
    {
    }

    public static function normalize(string $value): string
    {
        return Digits::removeNonDigits($value);
    }

    /** @return array<int, int> */
    private static function weightsFor(int $baseLength): array
    {
        $weights = [];

        for ($i = 0; $i < $baseLength; $i++) {
            $weights[] = $baseLength + 1 - $i;
        }

        return $weights;
    }

    public static function isValid(string $value): bool
    {
        if (!preg_match(self::ALLOWED_CHARS, $value)) {
            return false;
        }

        $v = self::normalize($value);
        $length = strlen($v);

        if (($length !== 9 && $length !== 10) || substr($v, 0, 2) !== '20') {
            return false;
        }

        $base = substr($v, 0, $length - 1);
        $checkDigit = Mod11::mod11TimesTenCheckDigit(Mod11::weightedSum($base, self::weightsFor(strlen($base))));

        return $checkDigit === (int) $v[$length - 1];
    }

    public static function format(string $value): string
    {
        $v = self::normalize($value);

        return match (strlen($v)) {
            9 => substr($v, 0, 2) . '.' . substr($v, 2, 3) . '.' . substr($v, 5, 3) . '-' . substr($v, 8, 1),
            10 => substr($v, 0, 2) . '.' . substr($v, 2, 1) . '.' . substr($v, 3, 3) . '.' . substr($v, 6, 3) . '-' . substr($v, 9, 1),
            default => $value,
        };
    }
}
