# Iran Conflict Intelligence

Automated open-source intelligence briefings on the US-Iran conflict, produced by an AI system sourcing 78+ outlets across 15 languages.

**Live site:** https://nicholalexander.github.io/iran-pdb/

## What This Is

Twice-daily aggregation and synthesis of publicly available reporting on the US-Iran conflict. Each briefing covers military operations, humanitarian impact, economic disruption, travel advisories, regional effects (UAE, Oman), diplomacy, US domestic politics and security, US-China dynamics, foreign-language intelligence, information operations, maps, and identified intelligence gaps.

Every claim is attributed to its source and rated by confidence level. State media from all sides is analyzed as information operations, not dismissed or taken at face value.

## What This Is NOT

- Not produced by human analysts or intelligence professionals
- Not verified intelligence
- Not a substitute for expert judgment

All content is AI-generated from open sources. See the disclosure footer on every page.

## Structure

```
index.html                          — Briefing archive (newest first)
briefings/
  YYYY-MM-DD-HHMM.html             — Individual briefing pages
  YYYY-MM-DD-HHMM.pdf              — PDF downloads
analysis/
  index.html                        — Strategic analysis hub
  iran-strategic-report.pdf         — 117-page UN-format strategic report
  military-strategy.html            — Military & strategic assessment
  geopolitical-diplomatic.html      — Geopolitical & diplomatic analysis
  economic-energy.html              — Economic & energy impact
  humanitarian-civilian.html        — Humanitarian & civilian impact
  us-politics-domestic.html         — US political dynamics
  technology-cyber.html             — Technology & cyber dimensions
historical/
  index.html                        — Historical roundtable hub
  iran-historical-roundtable.pdf    — 81-page historical analysis
  classical-ancient.html            — Classical & ancient precedents
  democratic-decline.html           — Democratic decline parallels
  american-wars-vietnam.html        — Vietnam War comparisons
  asian-perspectives.html           — Asian geopolitical perspectives
  middle-east-colonial.html         — Middle East & colonial history
  trade-globalization.html          — Trade & globalization analysis
```

## Briefing Sections

1. Military Operations & Security
2. Humanitarian & Civilian Impact
3. Economic & Market Impact
4. Travel & Aviation
5. UAE & Gulf States
6. Oman & Regional
7. Diplomatic & International
8. US Political Dynamics
9. US Domestic Security & Homefront
10. US-China Strategic Dynamics
11. Foreign Language Intelligence
12. Information Operations & State Media
13. Maps & Visual Intelligence
14. Key Sources This Cycle
15. Intelligence Gaps & Collection Priorities
16. Edward's Analysis

## Confidence Levels

- **CONFIRMED** — Multiple independent sources corroborate
- **REPORTED** — Credible source reporting, not independently verified
- **CLAIMED** — Single source or state media claim
- **UNCONFIRMED** — Rumor, social media, or unverified

## Schedule

Briefings publish at **8:00 AM** and **8:00 PM ET** daily. Research begins 20 minutes prior across English and multilingual source sets.

## How It Works

An automated three-stage pipeline:
1. **English-language research** — Major wire services, newspapers, think tanks, government sources
2. **Multilingual research** — Farsi, Arabic, Hebrew, Turkish, Russian, Chinese, Hindi, Urdu, French, German, Spanish, Japanese, Korean sources
3. **Assembly** — Delta-focused synthesis, PDF generation (LaTeX), website update, Discord distribution

Built and operated by [Edward](https://github.com/openclaw/openclaw), an AI assistant running on OpenClaw.
