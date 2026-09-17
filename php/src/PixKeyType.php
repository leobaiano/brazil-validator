<?php

declare(strict_types=1);

namespace BrValidator;

/**
 * Identifies which kind of PIX key a value looks like.
 */
enum PixKeyType: string
{
    case Cpf = 'CPF';
    case Cnpj = 'CNPJ';
    case Email = 'EMAIL';
    case Phone = 'PHONE';
    case Evp = 'EVP';
}
