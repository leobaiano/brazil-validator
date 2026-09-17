<?php

declare(strict_types=1);

namespace BrValidator;

use BrValidator\Shared\Ddd;
use BrValidator\Shared\Digits;

/**
 * Validates, normalizes, and formats Brazilian national phone numbers
 * (mobile and landline, no +55 country code).
 */
final class Phone
{
    private const ALLOWED_CHARS = '/^[\d\s()-]+$/';

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
     * Reports whether $value is a structurally valid Brazilian phone
     * number. It enforces Anatel's numbering plan: the DDD must be one of
     * the 67 codes actually assigned, mobile numbers (11 digits) must
     * carry the "ninth digit" 9 (Resolucao no 553/2010), and landline
     * numbers (10 digits) must start with 2-5.
     */
    public static function isValid(string $value): bool
    {
        if (!preg_match(self::ALLOWED_CHARS, $value)) {
            return false;
        }

        $phone = self::normalize($value);

        if (strlen($phone) !== 10 && strlen($phone) !== 11) {
            return false;
        }

        $ddd = substr($phone, 0, 2);

        if (!Ddd::isValid($ddd)) {
            return false;
        }

        $subscriberFirstDigit = $phone[2];

        if (strlen($phone) === 11) {
            return $subscriberFirstDigit === '9';
        }

        return str_contains('2345', $subscriberFirstDigit);
    }

    /**
     * Returns $value in its standard human-readable representation
     * (XX) XXXXX-XXXX for mobile or (XX) XXXX-XXXX for landline. If the
     * normalized value has an invalid length, $value is returned
     * unchanged.
     */
    public static function format(string $value): string
    {
        $phone = self::normalize($value);

        return match (strlen($phone)) {
            11 => '(' . substr($phone, 0, 2) . ') ' . substr($phone, 2, 5) . '-' . substr($phone, 7, 4),
            10 => '(' . substr($phone, 0, 2) . ') ' . substr($phone, 2, 4) . '-' . substr($phone, 6, 4),
            default => $value,
        };
    }
}
