<?php

declare(strict_types=1);

namespace BrValidator;

use BrValidator\Shared\Ddd;
use BrValidator\Shared\Digits;

/**
 * Validates, normalizes, and formats PIX keys (CPF, CNPJ, e-mail, phone,
 * or random key).
 *
 * Formats verified against Bacen's official DICT schema
 * (github.com/bacen/pix-dict-api openapi.yaml) and the Manual de Padroes
 * para Iniciacao do Pix:
 *   - CPF/CNPJ keys are digits-only (^[0-9]{11}$ / ^[0-9]{14}$). The DICT
 *     schema does not yet accept alphanumeric CNPJ as a key.
 *   - The EVP (random key) is a canonical, case-insensitive UUID
 *     (8-4-4-4-12).
 *   - Phone keys use the international format "+55AANNNNNNNNN", where AA
 *     is the DDD and NNNNNNNNN is a 9-digit mobile number - Brazilian Pix
 *     only registers Brazilian mobile numbers, so the country code is
 *     fixed at 55.
 *   - Email keys are case-insensitive and capped at 77 characters.
 */
final class Pix
{
    private const EVP_REGEX = '/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i';
    private const CPF_SHAPE = '/^\d{11}$/';
    private const CNPJ_SHAPE = '/^\d{14}$/';
    private const PHONE_CHARS = '/^[\d\s()+-]+$/';
    private const PHONE_KEY_FORM = '/^\+55\d{11}$/';
    private const MAX_EMAIL_KEY_LENGTH = 77;

    private function __construct()
    {
    }

    /**
     * Detects which kind of PIX key $value looks like, or null if it
     * matches none of the known shapes.
     */
    public static function getKeyType(string $value): ?PixKeyType
    {
        $trimmed = trim($value);

        return match (true) {
            (bool) preg_match(self::EVP_REGEX, $trimmed) => PixKeyType::Evp,
            str_contains($trimmed, '@') => PixKeyType::Email,
            str_starts_with($trimmed, '+') => PixKeyType::Phone,
            (bool) preg_match(self::CPF_SHAPE, $trimmed) => PixKeyType::Cpf,
            (bool) preg_match(self::CNPJ_SHAPE, $trimmed) => PixKeyType::Cnpj,
            default => null,
        };
    }

    /**
     * Reports whether $value is a valid PIX key of any recognized type.
     */
    public static function isValid(string $value): bool
    {
        $keyType = self::getKeyType($value);

        if ($keyType === null) {
            return false;
        }

        $trimmed = trim($value);

        return match ($keyType) {
            PixKeyType::Cpf => Cpf::isValid($trimmed),
            PixKeyType::Cnpj => Cnpj::isValid($trimmed),
            PixKeyType::Email => strlen($trimmed) <= self::MAX_EMAIL_KEY_LENGTH && Email::isValid($trimmed),
            PixKeyType::Phone => self::isValidPhoneKey($trimmed),
            PixKeyType::Evp => true,
        };
    }

    /**
     * Dispatches to the canonical normalize rule of $value's detected key
     * type. If the type cannot be detected, $value is returned unchanged.
     */
    public static function normalize(string $value): string
    {
        $keyType = self::getKeyType($value);

        if ($keyType === null) {
            return $value;
        }

        $trimmed = trim($value);

        return match ($keyType) {
            PixKeyType::Cpf => Cpf::normalize($trimmed),
            PixKeyType::Cnpj => Cnpj::normalize($trimmed),
            PixKeyType::Email => Email::normalize($trimmed),
            PixKeyType::Phone => self::normalizePhoneKey($trimmed),
            PixKeyType::Evp => strtolower($trimmed),
        };
    }

    /**
     * Dispatches to the canonical format rule of $value's detected key
     * type. If the type cannot be detected, $value is returned unchanged.
     */
    public static function format(string $value): string
    {
        $keyType = self::getKeyType($value);

        if ($keyType === null) {
            return $value;
        }

        $trimmed = trim($value);

        return match ($keyType) {
            PixKeyType::Cpf => Cpf::format($trimmed),
            PixKeyType::Cnpj => Cnpj::format($trimmed),
            PixKeyType::Email => Email::format($trimmed),
            PixKeyType::Phone => self::formatPhoneKey($trimmed),
            PixKeyType::Evp => strtolower($trimmed),
        };
    }

    private static function normalizePhoneKey(string $value): string
    {
        return '+' . Digits::removeNonDigits($value);
    }

    private static function isValidPhoneKey(string $value): bool
    {
        if (!preg_match(self::PHONE_CHARS, $value)) {
            return false;
        }

        $p = self::normalizePhoneKey($value);

        if (!preg_match(self::PHONE_KEY_FORM, $p)) {
            return false;
        }

        $ddd = substr($p, 3, 2);
        $subscriberFirstDigit = $p[5];

        return Ddd::isValid($ddd) && $subscriberFirstDigit === '9';
    }

    private static function formatPhoneKey(string $value): string
    {
        $p = self::normalizePhoneKey($value);

        if (!preg_match(self::PHONE_KEY_FORM, $p)) {
            return $value;
        }

        return '+55 ' . Phone::format(substr($p, 3));
    }
}
