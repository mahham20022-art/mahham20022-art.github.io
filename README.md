# Dr Najm — apps

- **MRCEM OSCE — The Clinical Exam Companion** → [`/mrcem/`](https://mahham20022-art.github.io/mrcem/)
  Installable offline PWA for MRCEM OSCE preparation: 289 items across 13 domains (SBA + Say-it cards), readiness score, daily mission paced to the exam date, spaced repetition, recall-first and timed Say-it modes, 16 station frameworks, 1 + 8 minute station clock.
  Independent study app — not affiliated with or endorsed by RCEM. Educational use only.

## Updating the MRCEM app
1. Edit question files in `mrcem/data/`.
2. Run `node scripts/validate-mrcem.mjs` (also runs automatically on every push).
3. Bump `VERSION` in `mrcem/sw.js` so installed copies refresh.
