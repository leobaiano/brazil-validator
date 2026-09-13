# Security Policy

## Supported versions

`brazil-validator` is currently pre-1.0 (`0.x`). Only the latest published version of each language port is supported with security fixes.

## What counts as a security issue here

This is a data validation library with no network access, no file I/O, and no dynamic code execution — its attack surface is narrow. Still, please report privately (rather than as a public issue) anything like:

- A regular expression vulnerable to catastrophic backtracking (ReDoS) that could be triggered by attacker-controlled input.
- A validator that incorrectly reports a well-formed **invalid** value as `isValid() === true` (or the equivalent in another language) in a way that has real security implications — e.g. bypassing a downstream check that relies on this library.
- Any other unexpected code execution, crash, or memory-safety issue triggered by untrusted input.

A validator simply being *stricter or looser than intended* for a given Brazilian rule (with no security implication) is a regular bug — please [open a normal issue](https://github.com/matheuslm7/brazil-validator/issues) for that instead, following [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## Reporting a vulnerability

Please use GitHub's [private vulnerability reporting](https://github.com/matheuslm7/brazil-validator/security/advisories/new) for this repository instead of opening a public issue. Include:

- The language port(s) affected and version.
- A minimal input that reproduces the issue.
- What you'd expect to happen instead.

You should get an initial response within a few days. Since this is a small project maintained in spare time, please be patient with the timeline for a fix.
