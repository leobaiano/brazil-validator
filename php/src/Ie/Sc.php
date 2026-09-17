<?php

declare(strict_types=1);

namespace BrValidator\Ie;

use BrValidator\Shared\Digits;
use BrValidator\Shared\Mod11;

/**
 * Verified against the official SEFAZ-SC "Roteiro de Critica da Inscricao
 * Estadual" (sintegra.gov.br/Cad_Estados/cad_SC.html), including its
 * worked example (251.040.852). Format: 8 digits + 1 check digit.
 *
 * Not part of the public API - use BrValidator\Ie.
 */
final class Sc
{
    private const ALLOWED_CHARS = '/^[\d.\s]+$/';
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
        $v = self::normalize($value);

        if (strlen($v) !== 9) {
            return $value;
        }

        return substr($v, 0, 3) . '.' . substr($v, 3, 3) . '.' . substr($v, 6, 3);
    }
}
