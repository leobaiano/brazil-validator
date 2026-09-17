<?php

declare(strict_types=1);

namespace BrValidator\Tests;

use BrValidator\Cnpj;
use PHPUnit\Framework\TestCase;

final class CnpjTest extends TestCase
{
    public function testAcceptsValidNumericCnpj(): void
    {
        foreach (['11.222.333/0001-81', '11222333000181'] as $value) {
            self::assertTrue(Cnpj::isValid($value), $value);
        }
    }

    public function testAcceptsValidAlphanumericCnpj(): void
    {
        foreach (['12.ABC.345/01DE-35', '12ABC34501DE35'] as $value) {
            self::assertTrue(Cnpj::isValid($value), $value);
        }
    }

    public function testRejectsInvalidCnpj(): void
    {
        $cases = [
            'wrong check digit' => '11.222.333/0001-80',
            'wrong length' => '1122233300018',
            'unexpected characters' => '11.222.333/000X-81!',
            'empty string' => '',
        ];

        foreach ($cases as $value) {
            self::assertFalse(Cnpj::isValid($value), $value);
        }
    }

    public function testNormalizeUppercasesAndStripsFormattingWithoutRemovingLetters(): void
    {
        self::assertSame('11222333000181', Cnpj::normalize('11.222.333/0001-81'));
        self::assertSame('12ABC34501DE35', Cnpj::normalize('12.ABC.345/01DE-35'));
        self::assertSame('12ABC34501DE35', Cnpj::normalize('12abc34501de35'));
    }

    public function testFormatProducesTheStandardMask(): void
    {
        self::assertSame('11.222.333/0001-81', Cnpj::format('11222333000181'));
        self::assertSame('12.ABC.345/01DE-35', Cnpj::format('12ABC34501DE35'));
    }

    public function testFormatReturnsOriginalValueForInvalidLength(): void
    {
        self::assertSame('123', Cnpj::format('123'));
    }
}
