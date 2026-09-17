<?php

declare(strict_types=1);

namespace BrValidator;

/**
 * Validates, normalizes, and formats Brazilian CNPJ numbers, covering both
 * the traditional numeric format and the alphanumeric format introduced by
 * Receita Federal.
 */
final class Cnpj
{
    private const ALLOWED_CHARS = '/^[A-Za-z0-9.\-\/\s]+$/';
    private const FORMATTING_CHARS = '/[.\-\/\s]/';
    private const NORMALIZED_SHAPE = '/^[A-Z0-9]{12}\d{2}$/';

    private function __construct()
    {
    }

    /**
     * Strips formatting and uppercases $value. A digit-only strip would
     * destroy alphanumeric CNPJ values, so only separator characters are
     * removed.
     */
    public static function normalize(string $value): string
    {
        return strtoupper(preg_replace(self::FORMATTING_CHARS, '', $value) ?? '');
    }

    /**
     * Reports whether $value is a structurally and check-digit valid CNPJ,
     * numeric or alphanumeric. It accepts raw or formatted input but
     * rejects unexpected characters.
     */
    public static function isValid(string $value): bool
    {
        if (!preg_match(self::ALLOWED_CHARS, $value)) {
            return false;
        }

        $cnpj = self::normalize($value);

        if (!preg_match(self::NORMALIZED_SHAPE, $cnpj)) {
            return false;
        }

        $firstDigit = self::calculateCheckDigit(substr($cnpj, 0, 12));

        if ($firstDigit !== (int) $cnpj[12]) {
            return false;
        }

        $secondDigit = self::calculateCheckDigit(substr($cnpj, 0, 13));

        return $secondDigit === (int) $cnpj[13];
    }

    /**
     * Returns $value in its standard human-readable representation
     * (XX.XXX.XXX/XXXX-XX). If the normalized value has an invalid length,
     * $value is returned unchanged.
     */
    public static function format(string $value): string
    {
        $cnpj = self::normalize($value);

        if (strlen($cnpj) !== 14) {
            return $value;
        }

        return substr($cnpj, 0, 2) . '.' . substr($cnpj, 2, 3) . '.' . substr($cnpj, 5, 3)
            . '/' . substr($cnpj, 8, 4) . '-' . substr($cnpj, 12, 2);
    }

    private static function characterValue(string $char): int
    {
        return ord($char) - 48;
    }

    private static function calculateCheckDigit(string $value): int
    {
        $sum = 0;
        $weight = strlen($value) === 12 ? 5 : 6;

        for ($i = 0; $i < strlen($value); $i++) {
            $sum += self::characterValue($value[$i]) * $weight;
            $weight--;

            if ($weight === 1) {
                $weight = 9;
            }
        }

        $remainder = $sum % 11;

        if ($remainder === 0 || $remainder === 1) {
            return 0;
        }

        return 11 - $remainder;
    }
}
