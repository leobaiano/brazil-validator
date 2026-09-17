<?php

declare(strict_types=1);

namespace BrValidator\Ie;

use BrValidator\Shared\Digits;
use BrValidator\Shared\Mod11;

/**
 * Verified against the official SEFAZ-AL "Roteiro de Critica da Inscricao
 * Estadual" (sintegra.gov.br/Cad_Estados/cad_AL.html), including its
 * worked example (24000004 -> check digit 8, i.e. 240000048).
 * Format: "24" (fixed) + 1 "tipo de empresa" digit (0,3,5,7,8) + 5
 * sequence digits + 1 check digit = 9 digits total. No official
 * punctuation mask is published, so format() returns the plain digits.
 *
 * Not part of the public API - use BrValidator\Ie.
 */
final class Al
{
    private const ALLOWED_CHARS = '/^[\d\s]+$/';
    private const WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2];
    private const VALID_TYPE_DIGITS = ['0', '3', '5', '7', '8'];

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

        if (!in_array($v[2], self::VALID_TYPE_DIGITS, true)) {
            return false;
        }

        $checkDigit = Mod11::mod11TimesTenCheckDigit(Mod11::weightedSum($v, self::WEIGHTS));

        return $checkDigit === (int) $v[8];
    }

    public static function format(string $value): string
    {
        return self::normalize($value);
    }
}
