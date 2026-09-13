// Sourced from the WHATWG HTML Living Standard's email state regex
// (used by browsers to validate <input type="email">). All quantifiers are
// bounded, so it cannot suffer catastrophic backtracking.
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const MAX_EMAIL_LENGTH = 254;
const MAX_LOCAL_PART_LENGTH = 64;

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function isValid(value: string): boolean {
  const email = normalize(value);

  if (email.length === 0 || email.length > MAX_EMAIL_LENGTH) {
    return false;
  }

  const [localPart] = email.split("@");

  if (!localPart || localPart.length > MAX_LOCAL_PART_LENGTH) {
    return false;
  }

  return EMAIL_REGEX.test(email);
}

// An email address has no punctuation mask to apply (unlike CPF/CNPJ/CEP/
// Phone), so the formatted form is the same canonical value as normalize().
function format(value: string): string {
  return normalize(value);
}

export const Email = {
  isValid,
  normalize,
  format,
};
