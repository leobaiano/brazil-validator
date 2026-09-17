<?php

declare(strict_types=1);

namespace BrValidator\Tests;

use BrValidator\Email;
use PHPUnit\Framework\TestCase;

final class EmailTest extends TestCase
{
    public function testAcceptsValidEmail(): void
    {
        foreach (['user@example.com', 'USER.name+tag@sub.example.com.br'] as $value) {
            self::assertTrue(Email::isValid($value), $value);
        }
    }

    public function testRejectsInvalidEmail(): void
    {
        $cases = [
            'missing @' => 'userexample.com',
            'missing domain' => 'user@',
            'missing local part' => '@example.com',
            'consecutive dots in domain' => 'user@example..com',
            'empty string' => '',
        ];

        foreach ($cases as $value) {
            self::assertFalse(Email::isValid($value), $value);
        }
    }

    public function testNormalizeLowercasesAndTrims(): void
    {
        self::assertSame('user@example.com', Email::normalize('  USER@Example.COM  '));
    }

    public function testFormatIsIdenticalToNormalize(): void
    {
        self::assertSame(Email::normalize('USER@Example.COM'), Email::format('USER@Example.COM'));
    }
}
