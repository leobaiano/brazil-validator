<?php

declare(strict_types=1);

namespace BrValidator\Shared;

/**
 * Check-digit helpers shared by most Inscricao Estadual algorithms (SEFAZ
 * "Roteiro de Critica" documents). Not part of the public API.
 */
final class Mod11
{
    private function __construct()
    {
    }

    /**
     * Multiplies each digit of $value by the weight at the same index and
     * sums the products.
     *
     * @param array<int, int> $weights
     */
    public static function weightedSum(string $value, array $weights): int
    {
        $sum = 0;

        foreach ($weights as $i => $weight) {
            $sum += (int) $value[$i] * $weight;
        }

        return $sum;
    }

    /**
     * The most common check-digit rule across states: remainder 0 or 1
     * maps to digit 0, otherwise the digit is 11 minus the remainder.
     */
    public static function checkDigit(int $sum): int
    {
        $remainder = $sum % 11;

        if ($remainder <= 1) {
            return 0;
        }

        return 11 - $remainder;
    }

    /**
     * Used by Bahia's modulo-10 branch: remainder 0 maps to digit 0,
     * otherwise the digit is 10 minus the remainder.
     */
    public static function mod10CheckDigit(int $sum): int
    {
        $remainder = $sum % 10;

        if ($remainder === 0) {
            return 0;
        }

        return 10 - $remainder;
    }

    /**
     * Used by Alagoas and Rio Grande do Norte: the sum is multiplied by 10
     * before reducing modulo 11, and the remainder *is* the digit directly
     * (a remainder of 10 wraps to 0). Mirrors CPF's check-digit formula.
     */
    public static function mod11TimesTenCheckDigit(int $sum): int
    {
        $remainder = ($sum * 10) % 11;

        if ($remainder === 10) {
            return 0;
        }

        return $remainder;
    }
}
