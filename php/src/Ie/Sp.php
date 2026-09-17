<?php

declare(strict_types=1);

namespace BrValidator\Ie;

use BrValidator\Shared\Digits;
use BrValidator\Shared\Mod11;

/**
 * Verified against the official SEFAZ-SP "Roteiro de Critica da Inscricao
 * Estadual" (sintegra.gov.br/Cad_Estados/cad_SP.html), including both of
 * its worked examples: the standard industrial/commercial format
 * (110.042.490.114) and the "Produtor Rural" format (P-01100424.3/002).
 *
 * Note: the source restates the Produtor Rural example at the very end as
 * "P-011000424.3/002" (14 characters) - this contradicts both the
 * document's own "13 caracteres" rule and its worked calculation (which
 * sums exactly 8 digits to 91, matching the 13-character form). Treated
 * as a typo in the source; the 13-character form is what this class
 * expects.
 *
 * Not part of the public API - use BrValidator\Ie.
 */
final class Sp
{
    private const STANDARD_ALLOWED_CHARS = '/^[\d.\s]+$/';
    private const PRODUTOR_RURAL_ALLOWED = '/^[Pp\d.\-\/\s]+$/';
    private const FORMATTING_CHARS = '/[.\-\/\s]/';
    private const STANDARD_FIRST_DIGIT_WEIGHTS = [1, 3, 4, 5, 6, 7, 8, 10];
    private const STANDARD_SECOND_DIGIT_WEIGHTS = [3, 2, 10, 9, 8, 7, 6, 5, 4, 3, 2];
    private const PRODUTOR_RURAL_WEIGHTS = [1, 3, 4, 5, 6, 7, 8, 10];
    private const PRODUTOR_RURAL_PREFIX = '/^\s*[Pp]/';

    private function __construct()
    {
    }

    private static function calculateCheckDigit(string $digits, array $weights): int
    {
        $sum = Mod11::weightedSum($digits, $weights);

        if ($sum % 11 === 10) {
            return 0;
        }

        return $sum % 11;
    }

    private static function isProdutorRural(string $value): bool
    {
        return (bool) preg_match(self::PRODUTOR_RURAL_PREFIX, $value);
    }

    private static function normalizeStandard(string $value): string
    {
        return Digits::removeNonDigits($value);
    }

    private static function isValidStandard(string $value): bool
    {
        if (!preg_match(self::STANDARD_ALLOWED_CHARS, $value)) {
            return false;
        }

        $v = self::normalizeStandard($value);

        if (strlen($v) !== 12) {
            return false;
        }

        $firstDigit = self::calculateCheckDigit($v, self::STANDARD_FIRST_DIGIT_WEIGHTS);

        if ($firstDigit !== (int) $v[8]) {
            return false;
        }

        $secondDigit = self::calculateCheckDigit($v, self::STANDARD_SECOND_DIGIT_WEIGHTS);

        return $secondDigit === (int) $v[11];
    }

    private static function formatStandard(string $value): string
    {
        $v = self::normalizeStandard($value);

        if (strlen($v) !== 12) {
            return $value;
        }

        return substr($v, 0, 3) . '.' . substr($v, 3, 3) . '.' . substr($v, 6, 3) . '.' . substr($v, 9, 3);
    }

    /**
     * Format: P0MMMSSSSD000 (13 characters) - "P" (fixed) + "0" (fixed) +
     * 3 municipio digits + 4 sequence digits + 1 check digit + 3 unused
     * digits.
     */
    private static function normalizeProdutorRural(string $value): string
    {
        return strtoupper(preg_replace(self::FORMATTING_CHARS, '', $value) ?? '');
    }

    private static function isValidProdutorRural(string $value): bool
    {
        if (!preg_match(self::PRODUTOR_RURAL_ALLOWED, $value)) {
            return false;
        }

        $v = self::normalizeProdutorRural($value);

        if (strlen($v) !== 13 || $v[0] !== 'P' || $v[1] !== '0') {
            return false;
        }

        $base = substr($v, 1, 8);
        $checkDigit = self::calculateCheckDigit($base, self::PRODUTOR_RURAL_WEIGHTS);

        return $checkDigit === (int) $v[9];
    }

    private static function formatProdutorRural(string $value): string
    {
        $v = self::normalizeProdutorRural($value);

        if (strlen($v) !== 13) {
            return $value;
        }

        return 'P-' . substr($v, 1, 8) . '.' . substr($v, 9, 1) . '/' . substr($v, 10, 3);
    }

    public static function isValid(string $value): bool
    {
        if (self::isProdutorRural($value)) {
            return self::isValidProdutorRural($value);
        }

        return self::isValidStandard($value);
    }

    public static function normalize(string $value): string
    {
        if (self::isProdutorRural($value)) {
            return self::normalizeProdutorRural($value);
        }

        return self::normalizeStandard($value);
    }

    public static function format(string $value): string
    {
        if (self::isProdutorRural($value)) {
            return self::formatProdutorRural($value);
        }

        return self::formatStandard($value);
    }
}
