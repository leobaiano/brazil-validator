<?php

declare(strict_types=1);

namespace BrValidator\Ie;

use BrValidator\Shared\Digits;
use BrValidator\Shared\Mod11;

/**
 * Verified against the official SEFAZ-PA "Roteiro de Critica da Inscricao
 * Estadual" (sintegra.gov.br/Cad_Estados/cad_PA.html), including its two
 * worked examples (15999999-5, 75000002-3). Format: 8 digits (always
 * starting with 15, 75, 76, 77, 78 or 79) + 1 check digit.
 *
 * Not part of the public API - use BrValidator\Ie.
 */
final class Pa
{
    private const ALLOWED_CHARS = '/^[\d\-\s]+$/';
    private const WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2];
    private const VALID_PREFIXES = ['15', '75', '76', '77', '78', '79'];

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

        if (strlen($v) !== 9 || !in_array(substr($v, 0, 2), self::VALID_PREFIXES, true)) {
            return false;
        }

        return Mod11::checkDigit(Mod11::weightedSum($v, self::WEIGHTS)) === (int) $v[8];
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
