<?php

declare(strict_types=1);

namespace BrValidator\Ie;

use BrValidator\Shared\Digits;
use BrValidator\Shared\Mod11;

/**
 * SEFAZ-DF's own Sintegra "Roteiro de Critica" page
 * (sintegra.gov.br/Cad_Estados/cad_DF.html) is empty, so this was instead
 * cross-verified against two independent secondary sources that agree with
 * each other (cadcobol.com.br's fully worked example, arithmetic
 * re-checked by hand, and mestredocalculo.com.br independently citing the
 * same valid example "07.300.001.001-09"). The algorithm is structurally
 * identical to AC's officially-confirmed one (same weight sequences),
 * differing only in the fixed "07" prefix - strong evidence both derive
 * from the same original SEFAZ documentation. Format: "07" (fixed) + 6
 * sequence digits + 3 "ordem do estabelecimento" digits (001 = matriz) + 2
 * check digits = 13 digits total.
 *
 * Not part of the public API - use BrValidator\Ie.
 */
final class Df
{
    private const ALLOWED_CHARS = '/^[\d.\/\-\s]+$/';
    private const FIRST_DIGIT_WEIGHTS = [4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    private const SECOND_DIGIT_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

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

        if (strlen($v) !== 13 || substr($v, 0, 2) !== '07') {
            return false;
        }

        $firstDigit = Mod11::checkDigit(Mod11::weightedSum($v, self::FIRST_DIGIT_WEIGHTS));

        if ($firstDigit !== (int) $v[11]) {
            return false;
        }

        $secondDigit = Mod11::checkDigit(Mod11::weightedSum($v, self::SECOND_DIGIT_WEIGHTS));

        return $secondDigit === (int) $v[12];
    }

    public static function format(string $value): string
    {
        $v = self::normalize($value);

        if (strlen($v) !== 13) {
            return $value;
        }

        return substr($v, 0, 2) . '.' . substr($v, 2, 3) . '.' . substr($v, 5, 3) . '.' . substr($v, 8, 3) . '-' . substr($v, 11, 2);
    }
}
