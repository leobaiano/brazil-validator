<?php

declare(strict_types=1);

namespace BrValidator\Ie;

use BrValidator\Shared\Digits;
use BrValidator\Shared\Mod11;

/**
 * Verified against the official SEFAZ-ES "Roteiro de Critica da Inscricao
 * Estadual" (sintegra.gov.br/Cad_Estados/cad_ES.html), including its
 * worked example (all-9s base -> sum 396). Format: 8 digits + 1 check
 * digit. No official punctuation mask is published, so format() returns
 * plain digits.
 *
 * Not part of the public API - use BrValidator\Ie.
 */
final class Es
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

    public static function isValid(string $value): bool
    {
        if (!preg_match(self::ALLOWED_CHARS, $value)) {
            return false;
        }

        $v = self::normalize($value);

        if (strlen($v) !== 9) {
            return false;
        }

        return Mod11::checkDigit(Mod11::weightedSum($v, self::WEIGHTS)) === (int) $v[8];
    }

    public static function format(string $value): string
    {
        return self::normalize($value);
    }
}
