<?php

declare(strict_types=1);

namespace BrValidator\Tests;

use BrValidator\Cep;
use BrValidator\Cnpj;
use BrValidator\Cpf;
use BrValidator\Email;
use BrValidator\Ie;
use BrValidator\Phone;
use BrValidator\Pix;
use BrValidator\PixKeyType;
use PHPUnit\Framework\TestCase;

/**
 * Checks this PHP implementation against specification/*.json, the
 * language-independent test vectors generated from the TypeScript
 * implementation. If this passes, the PHP port behaves identically to
 * TypeScript (and to the Go, Python, Java, Ruby, and C# ports) for every
 * vector on file.
 */
final class ConformanceTest extends TestCase
{
    private const SPEC_DIR = __DIR__ . '/../../specification';

    /** @return array<int, array<string, mixed>> */
    private static function loadVectors(string $name): array
    {
        $json = file_get_contents(self::SPEC_DIR . '/' . $name . '/vectors.json');

        return json_decode($json, true, flags: JSON_THROW_ON_ERROR);
    }

    public function testCpf(): void
    {
        foreach (self::loadVectors('cpf') as $v) {
            $input = $v['input'];
            self::assertSame($v['valid'], Cpf::isValid($input), $input);
            self::assertSame($v['normalized'], Cpf::normalize($input), $input);
            self::assertSame($v['formatted'], Cpf::format($input), $input);
        }
    }

    public function testCnpj(): void
    {
        foreach (self::loadVectors('cnpj') as $v) {
            $input = $v['input'];
            self::assertSame($v['valid'], Cnpj::isValid($input), $input);
            self::assertSame($v['normalized'], Cnpj::normalize($input), $input);
            self::assertSame($v['formatted'], Cnpj::format($input), $input);
        }
    }

    public function testCep(): void
    {
        foreach (self::loadVectors('cep') as $v) {
            $input = $v['input'];
            self::assertSame($v['valid'], Cep::isValid($input), $input);
            self::assertSame($v['normalized'], Cep::normalize($input), $input);
            self::assertSame($v['formatted'], Cep::format($input), $input);
        }
    }

    public function testPhone(): void
    {
        foreach (self::loadVectors('phone') as $v) {
            $input = $v['input'];
            self::assertSame($v['valid'], Phone::isValid($input), $input);
            self::assertSame($v['normalized'], Phone::normalize($input), $input);
            self::assertSame($v['formatted'], Phone::format($input), $input);
        }
    }

    public function testEmail(): void
    {
        foreach (self::loadVectors('email') as $v) {
            $input = $v['input'];
            self::assertSame($v['valid'], Email::isValid($input), $input);
            self::assertSame($v['normalized'], Email::normalize($input), $input);
            self::assertSame($v['formatted'], Email::format($input), $input);
        }
    }

    public function testPix(): void
    {
        foreach (self::loadVectors('pix') as $v) {
            $input = $v['input'];
            $wantKeyType = $v['keyType'] === null ? null : PixKeyType::from($v['keyType']);

            self::assertSame($wantKeyType, Pix::getKeyType($input), $input);
            self::assertSame($v['valid'], Pix::isValid($input), $input);
            self::assertSame($v['normalized'], Pix::normalize($input), $input);
            self::assertSame($v['formatted'], Pix::format($input), $input);
        }
    }

    public function testIe(): void
    {
        foreach (self::loadVectors('ie') as $v) {
            $input = $v['input'];
            $uf = $v['uf'];
            self::assertSame($v['valid'], Ie::isValid($input, $uf), "$uf: $input");
            self::assertSame($v['normalized'], Ie::normalize($input, $uf), "$uf: $input");
            self::assertSame($v['formatted'], Ie::format($input, $uf), "$uf: $input");
        }
    }
}
