<?php

declare(strict_types=1);

namespace BrValidator\Tests;

use BrValidator\Ie;
use PHPUnit\Framework\TestCase;

final class IeTest extends TestCase
{
    /** @return array<int, array{0: string, 1: string}> */
    public static function officialExampleProvider(): array
    {
        return [
            ['AC', '01.004.823/001-12'],
            ['AL', '240000048'],
            ['AM', '99.999.999-0'],
            ['AP', '030123459'],
            ['BA', '123456-63'],
            ['BA', '612345-57'],
            ['BA', '1000003-06'],
            ['CE', '06000001-5'],
            ['DF', '07.300.001.001-09'],
            ['ES', '999999990'],
            ['GO', '10.987.654-7'],
            ['MA', '120000385'],
            ['MG', '062.307.904/0081'],
            ['MS', '281234566'],
            ['MT', '0013000001-9'],
            ['PA', '15999999-5'],
            ['PA', '75000002-3'],
            ['PB', '06000001-5'],
            ['PE', '0321418-40'],
            ['PI', '012345679'],
            ['PR', '123.45678-50'],
            ['RJ', '99.999.99-3'],
            ['RN', '20.040.040-1'],
            ['RN', '20.0.040.040-0'],
            ['RO', '0000000062521-3'],
            ['RR', '24006153-6'],
            ['RS', '224/3658792'],
            ['SC', '251.040.852'],
            ['SE', '27123456-3'],
            ['SP', '110.042.490.114'],
            ['SP', 'P-01100424.3/002'],
            ['TO', '29010227836'],
        ];
    }

    public function testAcceptsEveryStateOfficialWorkedExample(): void
    {
        foreach (self::officialExampleProvider() as [$uf, $value]) {
            self::assertTrue(Ie::isValid($value, $uf), "$uf: $value");
        }
    }

    public function testIsCaseInsensitiveOnUf(): void
    {
        self::assertTrue(Ie::isValid('110042490114', 'sp'));
    }

    public function testRejectsUnsupportedUf(): void
    {
        self::assertFalse(Ie::isValid('110042490114', 'ZZ'));
    }

    public function testRejectsWrongCheckDigit(): void
    {
        self::assertFalse(Ie::isValid('110.042.490.115', 'SP'));
    }

    public function testSpTransparentlyHandlesProdutorRuralFormat(): void
    {
        self::assertTrue(Ie::isValid('P-01100424.3/002', 'SP'));
        self::assertTrue(Ie::isValid('P011004243002', 'SP'));
    }

    public function testNormalizeReturnsOriginalValueForUnsupportedUf(): void
    {
        self::assertSame('110042490114', Ie::normalize('110042490114', 'ZZ'));
    }

    public function testFormatProducesTheStandardMask(): void
    {
        self::assertSame('110.042.490.114', Ie::format('110042490114', 'SP'));
    }
}
