<?php

declare(strict_types=1);

namespace BrValidator\Tests;

use BrValidator\Phone;
use PHPUnit\Framework\TestCase;

final class PhoneTest extends TestCase
{
    public function testAcceptsValidMobileNumber(): void
    {
        foreach (['(11) 98765-4321', '11987654321'] as $value) {
            self::assertTrue(Phone::isValid($value), $value);
        }
    }

    public function testAcceptsValidLandlineNumber(): void
    {
        foreach (['(11) 3456-7890', '1134567890'] as $value) {
            self::assertTrue(Phone::isValid($value), $value);
        }
    }

    public function testRejectsInvalidDdd(): void
    {
        self::assertFalse(Phone::isValid('00987654321'));
    }

    public function testRejectsMobileNumberMissingTheNinthDigit(): void
    {
        self::assertFalse(Phone::isValid('1187654321'));
    }

    public function testRejectsInvalidPhone(): void
    {
        $cases = [
            'wrong length' => '119876543',
            'unexpected characters' => '(11) 98765-43AB',
            'empty string' => '',
        ];

        foreach ($cases as $value) {
            self::assertFalse(Phone::isValid($value), $value);
        }
    }

    public function testNormalizeStripsFormatting(): void
    {
        self::assertSame('11987654321', Phone::normalize('(11) 98765-4321'));
    }

    public function testFormatProducesTheStandardMaskForMobile(): void
    {
        self::assertSame('(11) 98765-4321', Phone::format('11987654321'));
    }

    public function testFormatProducesTheStandardMaskForLandline(): void
    {
        self::assertSame('(11) 3456-7890', Phone::format('1134567890'));
    }

    public function testFormatReturnsOriginalValueForInvalidLength(): void
    {
        self::assertSame('123', Phone::format('123'));
    }
}
