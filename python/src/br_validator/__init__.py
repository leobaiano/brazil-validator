"""br_validator: validation, normalization, and formatting for Brazilian data.

Each validator lives in its own module (cpf, cnpj, cep, phone, email, pix,
ie), imported directly, e.g.:

    from br_validator import cpf
    cpf.is_valid("529.982.247-25")
"""
