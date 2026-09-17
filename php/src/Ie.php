<?php

declare(strict_types=1);

namespace BrValidator;

use BrValidator\Ie\Ac;
use BrValidator\Ie\Al;
use BrValidator\Ie\Am;
use BrValidator\Ie\Ap;
use BrValidator\Ie\Ba;
use BrValidator\Ie\Ce;
use BrValidator\Ie\Df;
use BrValidator\Ie\Es;
use BrValidator\Ie\Go;
use BrValidator\Ie\Ma;
use BrValidator\Ie\Mg;
use BrValidator\Ie\Ms;
use BrValidator\Ie\Mt;
use BrValidator\Ie\Pa;
use BrValidator\Ie\Pb;
use BrValidator\Ie\Pe;
use BrValidator\Ie\Pi;
use BrValidator\Ie\Pr;
use BrValidator\Ie\Rj;
use BrValidator\Ie\Rn;
use BrValidator\Ie\Ro;
use BrValidator\Ie\Rr;
use BrValidator\Ie\Rs;
use BrValidator\Ie\Sc;
use BrValidator\Ie\Se;
use BrValidator\Ie\Sp;
use BrValidator\Ie\To;

/**
 * Validates, normalizes, and formats Brazilian Inscricao Estadual numbers.
 *
 * Inscricao Estadual has no single national rule: each state (SEFAZ)
 * defines its own digit count and check-digit algorithm, so every UF is
 * modeled as its own class under BrValidator\Ie and registered in the
 * STATES map below. A UF absent from that map is simply not supported
 * yet.
 */
final class Ie
{
    /** @var array<string, class-string> */
    private const STATES = [
        'AC' => Ac::class,
        'AL' => Al::class,
        'AM' => Am::class,
        'AP' => Ap::class,
        'BA' => Ba::class,
        'CE' => Ce::class,
        'DF' => Df::class,
        'ES' => Es::class,
        'GO' => Go::class,
        'MA' => Ma::class,
        'MG' => Mg::class,
        'MS' => Ms::class,
        'MT' => Mt::class,
        'PA' => Pa::class,
        'PB' => Pb::class,
        'PE' => Pe::class,
        'PI' => Pi::class,
        'PR' => Pr::class,
        'RJ' => Rj::class,
        'RN' => Rn::class,
        'RO' => Ro::class,
        'RR' => Rr::class,
        'RS' => Rs::class,
        'SC' => Sc::class,
        'SE' => Se::class,
        'SP' => Sp::class,
        'TO' => To::class,
    ];

    private function __construct()
    {
    }

    /** @return class-string|null */
    private static function resolveClass(string $uf): ?string
    {
        $key = strtoupper(trim($uf));

        return self::STATES[$key] ?? null;
    }

    /**
     * Reports whether $value is a valid Inscricao Estadual for $uf.
     */
    public static function isValid(string $value, string $uf): bool
    {
        $class = self::resolveClass($uf);

        if ($class === null) {
            return false;
        }

        return $class::isValid($value);
    }

    /**
     * Strips formatting and returns the canonical representation of
     * $value for $uf. If $uf is not supported, $value is returned
     * unchanged.
     */
    public static function normalize(string $value, string $uf): string
    {
        $class = self::resolveClass($uf);

        if ($class === null) {
            return $value;
        }

        return $class::normalize($value);
    }

    /**
     * Returns $value in $uf's standard human-readable representation. If
     * $uf is not supported or the normalized value has an invalid length,
     * $value is returned unchanged.
     */
    public static function format(string $value, string $uf): string
    {
        $class = self::resolveClass($uf);

        if ($class === null) {
            return $value;
        }

        return $class::format($value);
    }
}
