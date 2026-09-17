<?php

declare(strict_types=1);

namespace BrValidator\Tests;

use BrValidator\Pix;
use BrValidator\PixKeyType;
use PHPUnit\Framework\TestCase;

final class PixTest extends TestCase
{
    public function testDetectsCpfKeyType(): void
    {
        self::assertSame(PixKeyType::Cpf, Pix::getKeyType('52998224725'));
    }

    public function testDetectsCnpjKeyType(): void
    {
        self::assertSame(PixKeyType::Cnpj, Pix::getKeyType('11222333000181'));
    }

    public function testDetectsEmailKeyType(): void
    {
        self::assertSame(PixKeyType::Email, Pix::getKeyType('user@example.com'));
    }

    public function testDetectsPhoneKeyType(): void
    {
        self::assertSame(PixKeyType::Phone, Pix::getKeyType('+5511987654321'));
    }

    public function testDetectsEvpKeyType(): void
    {
        self::assertSame(PixKeyType::Evp, Pix::getKeyType('123e4567-e89b-12d3-a456-426614174000'));
    }

    public function testReturnsNullForUnrecognizedShape(): void
    {
        self::assertNull(Pix::getKeyType('not-a-pix-key'));
    }

    public function testDoesNotAcceptAlphanumericCnpjAsAKey(): void
    {
        // Matches Bacen's current DICT schema, which is digits-only for
        // CPF/CNPJ keys.
        self::assertFalse(Pix::isValid('12ABC34501DE35'));
    }

    public function testIsValidDelegatesToTheDetectedKeyType(): void
    {
        // PIX CPF/CNPJ keys are digits-only per the DICT schema - unlike
        // BrValidator\Cpf::isValid(), a formatted value is not a valid key.
        self::assertTrue(Pix::isValid('52998224725'));
        self::assertFalse(Pix::isValid('11111111111'));
    }

    public function testNormalizePhoneKey(): void
    {
        self::assertSame('+5511987654321', Pix::normalize('+55 (11) 98765-4321'));
    }

    public function testFormatPhoneKey(): void
    {
        self::assertSame('+55 (11) 98765-4321', Pix::format('+5511987654321'));
    }

    public function testReturnsOriginalValueWhenTypeCannotBeDetected(): void
    {
        self::assertSame('not-a-pix-key', Pix::normalize('not-a-pix-key'));
        self::assertSame('not-a-pix-key', Pix::format('not-a-pix-key'));
    }
}
