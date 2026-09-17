<?php

declare(strict_types=1);

namespace BrValidator\Ie;

use BrValidator\Shared\Digits;
use BrValidator\Shared\Mod11;

/**
 * Verified against the official SEFAZ-BA "Roteiro de Critica da Inscricao
 * Estadual" (sintegra.gov.br/Cad_Estados/cad_BA.html), including its four
 * worked examples (123456-63, 612345-57, 1000003-06 mod-10/mod-11 x
 * 8/9-digit variants).
 *
 * Bahia has two lengths (8 or 9 digits) and, within each, two moduli:
 * modulo 10 when the discriminating digit (the 1st digit for 8-digit IEs,
 * the 2nd for 9-digit IEs) is one of 0,1,2,3,4,5,8, and modulo 11 when it
 * is 6, 7 or 9. The last check digit is calculated first (from the base
 * digits alone), then the first check digit is calculated from the base
 * plus that digit.
 *
 * Not part of the public API - use BrValidator\Ie.
 */
final class Ba
{
    private const ALLOWED_CHARS = '/^[\d\-\s]+$/';
    private const MOD10_DIGITS = ['0', '1', '2', '3', '4', '5', '8'];
    private const MOD11_DIGITS = ['6', '7', '9'];

    private function __construct()
    {
    }

    public static function normalize(string $value): string
    {
        return Digits::removeNonDigits($value);
    }

    private static function checkDigitFor(int $sum, bool $useMod11): int
    {
        return $useMod11 ? Mod11::checkDigit($sum) : Mod11::mod10CheckDigit($sum);
    }

    /** @return array<int, int> */
    private static function descendingWeights(int $length): array
    {
        $weights = [];

        for ($i = 0; $i < $length; $i++) {
            $weights[] = $length + 1 - $i;
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

        if ($length !== 8 && $length !== 9) {
            return false;
        }

        $discriminant = $length === 8 ? $v[0] : $v[1];
        $useMod11 = in_array($discriminant, self::MOD11_DIGITS, true);

        if (!$useMod11 && !in_array($discriminant, self::MOD10_DIGITS, true)) {
            return false;
        }

        $baseLength = $length - 2;
        $base = substr($v, 0, $baseLength);
        $lastDigit = self::checkDigitFor(Mod11::weightedSum($base, self::descendingWeights($baseLength)), $useMod11);

        if ($lastDigit !== (int) $v[$length - 1]) {
            return false;
        }

        $baseWithLastDigit = $base . (string) $lastDigit;
        $firstDigit = self::checkDigitFor(Mod11::weightedSum($baseWithLastDigit, self::descendingWeights($baseLength + 1)), $useMod11);

        return $firstDigit === (int) $v[$length - 2];
    }

    public static function format(string $value): string
    {
        $v = self::normalize($value);
        $length = strlen($v);

        if ($length !== 8 && $length !== 9) {
            return $value;
        }

        return substr($v, 0, $length - 2) . '-' . substr($v, $length - 2, 2);
    }
}
