<?php

declare(strict_types=1);

namespace BrValidator\Tests;

use BrValidator\Cep;
use PHPUnit\Framework\TestCase;

final class CepTest extends TestCase
{
    public function testAcceptsValidCep(): void
    {
        foreach (['01310-100', '01310100'] as $value) {
            self::assertTrue(Cep::isValid($value), $value);
        }
    }

    public function testRejectsInvalidCep(): void
    {
        $cases = [
            'wrong length' => '0131010',
            'unexpected characters' => '01310-1AB',
            'empty string' => '',
        ];

        foreach ($cases as $value) {
            self::assertFalse(Cep::isValid($value), $value);
        }
    }

    public function testNormalizeStripsFormatting(): void
    {
        self::assertSame('01310100', Cep::normalize('01310-100'));
    }

    public function testFormatProducesTheStandardMask(): void
    {
        self::assertSame('01310-100', Cep::format('01310100'));
    }

    public function testFormatReturnsOriginalValueForInvalidLength(): void
    {
        self::assertSame('123', Cep::format('123'));
    }
}
