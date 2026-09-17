<?php

declare(strict_types=1);

namespace BrValidator;

use BrValidator\Shared\Digits;

/**
 * Validates, normalizes, and formats Brazilian CEP (postal) codes.
 */
final class Cep
{
    private const ALLOWED_CHARS = '/^[\d-]+$/';

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
     * Reports whether $value is a structurally valid CEP. A CEP has no
     * check digit - it is an 8-digit postal routing code (region,
     * sub-region, sector, subsector and distribution suffix) defined by
     * Correios - so validity here means structural correctness (8 digits),
     * not whether the code exists in Correios' address database.
     */
    public static function isValid(string $value): bool
    {
        if (!preg_match(self::ALLOWED_CHARS, $value)) {
            return false;
        }

        return strlen(self::normalize($value)) === 8;
    }

    /**
     * Returns $value in its standard human-readable representation
     * (XXXXX-XXX). If the normalized value has an invalid length, $value
     * is returned unchanged.
     */
    public static function format(string $value): string
    {
        $cep = self::normalize($value);

        if (strlen($cep) !== 8) {
            return $value;
        }

        return substr($cep, 0, 5) . '-' . substr($cep, 5, 3);
    }
}
