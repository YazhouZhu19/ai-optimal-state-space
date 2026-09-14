# Release Integrity

AI Optimal State Space separates three different provenance claims:

1. Git history identifies the committed source state.
2. agent/integrity.json lists SHA-256 checksums for public machine surfaces.
3. A cryptographically signed release is not claimed unless a human maintainer
   actually signs and publishes one.

Generate the checksum ledger from the repository root:

~~~bash
npm run integrity:json > agent/integrity.json
~~~

The integrity tool excludes its own output to avoid a hash cycle. It covers the
beacon, public entry, capability and seed data, capsules, Web-Coder contracts,
and MCP adapter source.

Consumers should compare a downloaded file with the matching checksum and bind
that ledger to a known Git commit. A checksum detects content mismatch; it does
not establish who published the commit.

## Strong release gate

Before changing signed_release from not-claimed:

- create a version tag from a reviewed commit;
- regenerate agent/integrity.json at that commit;
- sign the tag or release with a maintainer-controlled key;
- publish the verification method and key identity;
- retain the unsigned wording if any step is absent.

