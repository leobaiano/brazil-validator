<?php

declare(strict_types=1);

namespace BrValidator;

use BrValidator\Shared\Digits;

/**
 * Validates, normalizes, and formats Brazilian CPF numbers.
 */
final class Cpf
{
    private const ALLOWED_CHARS = '/^[\d.\-\s]+$/';

    private function __construct()
    {
    }

    /**
     * Strips formatting and returns the canonical (digits-only)
     * representation of $value.
     */
    public static function normalize(string $value): string
    {
        return Digits::removeNonDigits($value);
    }

    /**
     * Reports whether $value is a structurally and check-digit valid CPF.
     * It accepts raw or formatted input but rejects unexpected characters.
     */
    public static function isValid(string $value): bool
    {
        if (!preg_match(self::ALLOWED_CHARS, $value)) {
            return false;
        }

        $cpf = self::normalize($value);

        if (strlen($cpf) !== 11) {
            return false;
        }

        if (self::isAllSameDigit($cpf)) {
            return false;
        }

        $firstDigit = self::calculateCheckDigit(substr($cpf, 0, 9), 10);

        if ($firstDigit !== (int) $cpf[9]) {
            return false;
        }

        $secondDigit = self::calculateCheckDigit(substr($cpf, 0, 10), 11);

        return $secondDigit === (int) $cpf[10];
    }

    /**
     * Returns $value in its standard human-readable representation
     * (XXX.XXX.XXX-XX). If the normalized value has an invalid length,
     * $value is returned unchanged.
     */
    public static function format(string $value): string
    {
        $cpf = self::normalize($value);

        if (strlen($cpf) !== 11) {
            return $value;
        }

        return substr($cpf, 0, 3) . '.' . substr($cpf, 3, 3) . '.' . substr($cpf, 6, 3) . '-' . substr($cpf, 9, 2);
    }

    private static function isAllSameDigit(string $value): bool
    {
        for ($i = 1; $i < strlen($value); $i++) {
            if ($value[$i] !== $value[0]) {
                return false;
            }
        }

        return true;
    }

    private static function calculateCheckDigit(string $cpf, int $weight): int
    {
        $sum = 0;

        for ($i = 0; $i < strlen($cpf); $i++) {
            $sum += (int) $cpf[$i] * ($weight - $i);
        }

        $remainder = ($sum * 10) % 11;

        if ($remainder === 10) {
            $remainder = 0;
        }

        return $remainder;
    }
}
