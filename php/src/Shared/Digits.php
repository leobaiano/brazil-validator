<?php

declare(strict_types=1);

namespace BrValidator\Shared;

/**
 * Small helpers reused by more than one validator. Not part of the public
 * API of any validator class.
 */
final class Digits
{
    private function __construct()
    {
    }

    public static function removeNonDigits(string $value): string
    {
        return preg_replace('/\D/', '', $value) ?? '';
    }
}
