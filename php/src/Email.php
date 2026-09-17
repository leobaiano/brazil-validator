<?php

declare(strict_types=1);

namespace BrValidator;

/**
 * Validates, normalizes, and formats e-mail addresses.
 */
final class Email
{
    private const MAX_EMAIL_LENGTH = 254;
    private const MAX_LOCAL_PART_LENGTH = 64;

    /**
     * Sourced from the WHATWG HTML Living Standard's email state regex
     * (used by browsers to validate <input type="email">). All
     * quantifiers are bounded, so it cannot suffer catastrophic
     * backtracking.
     */
    private const EMAIL_REGEX = '/^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/';

    private function __construct()
    {
    }

    /**
     * Trims whitespace and lowercases $value.
     */
    public static function normalize(string $value): string
    {
        return strtolower(trim($value));
    }

    /**
     * Reports whether $value is a structurally valid e-mail address, per
     * the WHATWG regular expression plus RFC 5321 length limits.
     */
    public static function isValid(string $value): bool
    {
        $email = self::normalize($value);

        if ($email === '' || strlen($email) > self::MAX_EMAIL_LENGTH) {
            return false;
        }

        $atPosition = strpos($email, '@');
        $localPart = $atPosition === false ? $email : substr($email, 0, $atPosition);

        if ($localPart === '' || strlen($localPart) > self::MAX_LOCAL_PART_LENGTH) {
            return false;
        }

        return (bool) preg_match(self::EMAIL_REGEX, $email);
    }

    /**
     * Returns the same canonical value as normalize(). Unlike CPF/CNPJ/
     * CEP/Phone, an e-mail address has no visual mask to apply.
     */
    public static function format(string $value): string
    {
        return self::normalize($value);
    }
}
