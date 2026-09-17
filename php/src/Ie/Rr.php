<?php

declare(strict_types=1);

namespace BrValidator\Ie;

use BrValidator\Shared\Digits;

/**
 * Verified against the official SEFAZ-RR "Roteiro de Critica da Inscricao
 * Estadual" (sintegra.gov.br/Cad_Estados/cad_RR.html), including its
 * worked example (24006153-6) and the ten additional valid numbers it
 * lists. Format: "24" (fixed) + 6 sequence digits + 1 check digit = 9
 * digits total. Unlike every other state, the check digit uses modulo 9,
 * and the weights are the digit's own 1-based position (ascending, not
 * descending).
 *
 * Not part of the public API - use BrValidator\Ie.
 */
final class Rr
{
    private const ALLOWED_CHARS = '/^[\d\-\s]+$/';
    private const WEIGHTS = [1, 2, 3, 4, 5, 6, 7, 8];

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

        if (strlen($v) !== 9 || substr($v, 0, 2) !== '24') {
            return false;
        }

        $sum = 0;
        foreach (self::WEIGHTS as $i => $weight) {
            $sum += (int) $v[$i] * $weight;
        }

        $checkDigit = $sum % 9;

        return $checkDigit === (int) $v[8];
    }

    public static function format(string $value): string
    {
        $v = self::normalize($value);

        if (strlen($v) !== 9) {
            return $value;
        }

        return substr($v, 0, 8) . '-' . substr($v, 8, 1);
    }
}
