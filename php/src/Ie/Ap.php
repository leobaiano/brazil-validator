<?php

declare(strict_types=1);

namespace BrValidator\Ie;

use BrValidator\Shared\Digits;

/**
 * Verified against the official SEFAZ-AP "Roteiro de Critica da Inscricao
 * Estadual" (sintegra.gov.br/Cad_Estados/cad_AP.html), including its
 * worked example (030123459). Format: "03" (fixed) + 6 sequence digits +
 * 1 check digit = 9 digits total. Unlike other states, the weighted sum
 * starts from a constant "p" that depends on the numeric range of the
 * registration, and a zero remainder maps to a range-dependent digit "d"
 * instead of always 0.
 *
 * Not part of the public API - use BrValidator\Ie.
 */
final class Ap
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

    /** @return array{0: int, 1: int} */
    private static function resolveConstants(int $base): array
    {
        if ($base <= 3017000) {
            return [5, 0];
        }

        if ($base <= 3019022) {
            return [9, 1];
        }

        return [0, 0];
    }

    private static function calculateCheckDigit(string $v): int
    {
        $base = substr($v, 0, 8);
        $baseNumber = (int) $base;
        [$p, $d] = self::resolveConstants($baseNumber);

        $sum = $p;
        foreach (self::WEIGHTS as $i => $weight) {
            $sum += (int) $base[$i] * $weight;
        }

        $remainder = $sum % 11;

        if ($remainder === 1) {
            return 0;
        }

        if ($remainder === 0) {
            return $d;
        }

        return 11 - $remainder;
    }

    public static function isValid(string $value): bool
    {
        if (!preg_match(self::ALLOWED_CHARS, $value)) {
            return false;
        }

        $v = self::normalize($value);

        if (strlen($v) !== 9 || substr($v, 0, 2) !== '03') {
            return false;
        }

        return self::calculateCheckDigit($v) === (int) $v[8];
    }

    public static function format(string $value): string
    {
        return self::normalize($value);
    }
}
