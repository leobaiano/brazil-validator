<?php

declare(strict_types=1);

namespace BrValidator\Tests;

use BrValidator\Cpf;
use PHPUnit\Framework\TestCase;

final class CpfTest extends TestCase
{
    /** @return array<string, array{0: string}> */
    public static function validProvider(): array
    {
        return [
            'formatted' => ['529.982.247-25'],
            'normalized' => ['52998224725'],
            'with spaces' => ['529 982 247 25'],
            'another valid number' => ['111.444.777-35'],
        ];
    }

    public function testAcceptsValidCpf(): void
    {
        foreach (self::validProvider() as [$value]) {
            self::assertTrue(Cpf::isValid($value), $value);
        }
    }

    /** @return array<string, array{0: string}> */
    public static function invalidProvider(): array
    {
        return [
            'wrong check digit' => ['529.982.247-26'],
            'all repeated digits' => ['111.111.111-11'],
            'wrong length' => ['123456789'],
            'unexpected characters mixed with digits' => ['529abc982xyz247-25'],
            'empty string' => [''],
            'only whitespace' => ['           '],
        ];
    }

    public function testRejectsInvalidCpf(): void
    {
        foreach (self::invalidProvider() as [$value]) {
            self::assertFalse(Cpf::isValid($value), $value);
        }
    }

    public function testDoesNotSilentlyDiscardUnexpectedCharacters(): void
    {
        // Removing all non-digits from this would produce a valid CPF,
        // but the unexpected characters must cause rejection instead.
        self::assertFalse(Cpf::isValid('529abc982xyz247-25'));
    }

    public function testNormalizeStripsFormatting(): void
    {
        self::assertSame('52998224725', Cpf::normalize('529.982.247-25'));
        self::assertSame('52998224725', Cpf::normalize('52998224725'));
        self::assertSame('52998224725', Cpf::normalize('529 982 247 25'));
    }

    public function testFormatProducesTheStandardMask(): void
    {
        self::assertSame('529.982.247-25', Cpf::format('52998224725'));
        self::assertSame('529.982.247-25', Cpf::format('529.982.247-25'));
    }

    public function testFormatReturnsOriginalValueForInvalidLength(): void
    {
        self::assertSame('123', Cpf::format('123'));
        self::assertSame('529982247', Cpf::format('529982247'));
    }
}
