<?php

declare(strict_types=1);

namespace BrValidator\Ie;

use BrValidator\Shared\Digits;
use BrValidator\Shared\Mod11;

/**
 * Verified against the official SEFAZ-MT "Roteiro de Critica da Inscricao
 * Estadual" (sintegra.gov.br/Cad_Estados/cad_MT.html), including its
 * worked example (0013000001-9). Format: 10 digits + 1 check digit.
 *
 * Not part of the public API - use BrValidator\Ie.
 */
final class Mt
{
    private const ALLOWED_CHARS = '/^[\d\-\s]+$/';
    private const WEIGHTS = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

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

        if (strlen($v) !== 11) {
            return false;
        }

        return Mod11::checkDigit(Mod11::weightedSum($v, self::WEIGHTS)) === (int) $v[10];
    }

    public static function format(string $value): string
    {
        $v = self::normalize($value);

        if (strlen($v) !== 11) {
            return $value;
        }

        return substr($v, 0, 10) . '-' . substr($v, 10, 1);
    }
}
