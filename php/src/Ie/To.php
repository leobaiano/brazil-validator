<?php

declare(strict_types=1);

namespace BrValidator\Ie;

use BrValidator\Shared\Digits;
use BrValidator\Shared\Mod11;

/**
 * Verified against the official SEFAZ-TO "Roteiro de Critica da Inscricao
 * Estadual" (sintegra.gov.br/Cad_Estados/cad_TO.html), including its
 * worked example (29010227836). Format: 11 digits, where positions 3-4
 * hold a fixed "tipo" code (01 Produtor Rural, 02 Industria e Comercio,
 * 03 Empresas Rudimentares, 99 Cadastro Antigo) that is excluded from the
 * check-digit calculation, and position 11 is the check digit.
 *
 * Not part of the public API - use BrValidator\Ie.
 */
final class To
{
    private const ALLOWED_CHARS = '/^[\d\s]+$/';
    private const WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2];
    private const VALID_TYPE_CODES = ['01', '02', '03', '99'];

    /** 1-based positions used in the check-digit calculation (positions 3-4 are skipped). */
    private const DIGIT_POSITIONS = [1, 2, 5, 6, 7, 8, 9, 10];

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

        if (strlen($v) !== 11 || !in_array(substr($v, 2, 2), self::VALID_TYPE_CODES, true)) {
            return false;
        }

        $sum = 0;

        foreach (self::DIGIT_POSITIONS as $i => $pos) {
            $sum += (int) $v[$pos - 1] * self::WEIGHTS[$i];
        }

        return Mod11::checkDigit($sum) === (int) $v[10];
    }

    public static function format(string $value): string
    {
        return self::normalize($value);
    }
}
