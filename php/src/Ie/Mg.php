<?php

declare(strict_types=1);

namespace BrValidator\Ie;

use BrValidator\Shared\Digits;
use BrValidator\Shared\Mod11;

/**
 * Verified against the official SEFAZ-MG "Roteiro de Critica da Inscricao
 * Estadual" (mirrored at sintegra.gov.br/Cad_Estados/cad_MG.html),
 * including its fully worked example (062.307.904/0081).
 *
 * Format: A1A2A3 B1B2B3B4B5B6 C1C2 D1D2 (13 digits), where A = municipio
 * code, B = registration number, C = establishment order, D = check
 * digits.
 *
 * Not part of the public API - use BrValidator\Ie.
 */
final class Mg
{
    private const ALLOWED_CHARS = '/^[\d.\/\s]+$/';
    private const FIRST_DIGIT_WEIGHTS = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
    private const SECOND_DIGIT_WEIGHTS = [3, 2, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2];

    private function __construct()
    {
    }

    public static function normalize(string $value): string
    {
        return Digits::removeNonDigits($value);
    }

    private static function sumOfDigits(int $value): int
    {
        $sum = 0;

        foreach (str_split((string) $value) as $char) {
            $sum += (int) $char;
        }

        return $sum;
    }

    /**
     * Equalizes the field widths by inserting a "0" right after the
     * municipio code, then sums the *digits* of each weighted product
     * (not the products themselves) before completing to the next
     * multiple of ten.
     */
    private static function calculateFirstDigit(string $base): int
    {
        $withInsertedZero = substr($base, 0, 3) . '0' . substr($base, 3);

        $digitSum = 0;

        foreach (self::FIRST_DIGIT_WEIGHTS as $i => $weight) {
            $digitSum += self::sumOfDigits((int) $withInsertedZero[$i] * $weight);
        }

        $remainder = $digitSum % 10;

        if ($remainder === 0) {
            return 0;
        }

        return 10 - $remainder;
    }

    /**
     * Uses the original (un-padded) base plus D1, and sums the weighted
     * products directly, following the general modulo 11 remainder rule.
     */
    private static function calculateSecondDigit(string $base, int $firstDigit): int
    {
        $withFirstDigit = $base . (string) $firstDigit;

        $sum = Mod11::weightedSum($withFirstDigit, self::SECOND_DIGIT_WEIGHTS);
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

        if (strlen($v) !== 13) {
            return false;
        }

        $base = substr($v, 0, 11);
        $firstDigit = self::calculateFirstDigit($base);

        if ($firstDigit !== (int) $v[11]) {
            return false;
        }

        $secondDigit = self::calculateSecondDigit($base, $firstDigit);

        return $secondDigit === (int) $v[12];
    }

    public static function format(string $value): string
    {
        $v = self::normalize($value);

        if (strlen($v) !== 13) {
            return $value;
        }

        return substr($v, 0, 3) . '.' . substr($v, 3, 3) . '.' . substr($v, 6, 3) . '/' . substr($v, 9, 4);
    }
}
