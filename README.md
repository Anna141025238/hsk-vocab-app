# Handoff: เว็บไซต์ฝึกคำศัพท์ HSK (HSK Vocabulary Web App)

## Overview
A Thai-language web app for studying Mandarin (HSK) vocabulary with **flashcards** and **quizzes**, plus a built-in **word-management (admin) panel** and a **membership / paywall** flow. The current prototype is fully functional as a study tool; the main remaining production work is a **real backend** for accounts, membership, and payments (everything auth/payment-related is currently simulated in the browser).

- UI language: **Thai-first** (with an EN string table already present in the code).
- Aesthetic: "study-desk / paper" theme — textured paper sheets, washi-tape accents, serif type. Warm neutral palette.
- All current persistence is **`localStorage` on the user's device** (no server).

## About the Design Files
The files in this bundle are a **design reference + working prototype, authored as a single self-contained HTML Design Component** (`HSK คำศัพท์.dc.html`) plus a bundled standalone build (`HSK-vocab-app.html`). They show the intended look, copy, and behavior.

The task is **not** to ship the prototype HTML as-is for the paid features. The task is to **recreate this app in a proper production stack** (e.g. Next.js/React + a backend + a database) using that stack's established patterns, while **reusing the exact visual design, copy, and vocabulary data** from these files. If you prefer, the front-end can stay close to the prototype, but the **account, membership, and payment logic MUST move server-side.**

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, copy, and interactions are all present and should be reproduced faithfully. Exact values are listed in **Design Tokens** below; when in doubt, read them off the prototype.

## The Vocabulary Data (most important asset)
- The full word list lives in the `VOCAB` object inside `HSK คำศัพท์.dc.html` (search for `VOCAB = {`).
- Structure: `VOCAB[levelId]` → array of `{ h, p, th }` where `h` = Chinese (hanzi), `p` = pinyin, `th` = Thai meaning.
- Levels (`LEVELS` array): `hsk1`(300), `hsk2`(200), `hsk3`(500), `hsk4`(1000), `hsk5`(~1600), `hsk6`(~1600), and **HSK 7-9 split by pinyin first letter**: `hsk79ah` (A–H, 1834), `hsk79js` (J–S, 2091), `hsk79tz` (T–Z, 1675). Total ≈ 10,800+ words.
- **Recommendation:** extract `VOCAB` into a database table or JSON files / API rather than hardcoding it. A script can parse it straight out of the `.dc.html`.

## Screens / Views
The app is a single page with a sticky top bar and these views (state field `view`): `home`, `flashcard`, `quiz`, `admin`, plus a `paywall` modal overlay.

### Top Bar (sticky)
- Left: back button (shown when not on home) + brand "猫咪汉语 / Maomi Hanyu".
- Right (in order): **Login** button (`เข้าสู่ระบบ`) OR account chip (when logged in) — shown only for non-members; **Upgrade** button (`อัปเกรด`, gold) for non-members OR **member pill** (`สมาชิก · เหลือ N วัน`, green) for members; **Admin** button (`จัดการคำศัพท์`, gear icon); **Pinyin** toggle.

### Home
- Hero: big title `คลังคำศัพท์ HSK`, subtitle, hand-drawn underline SVG, and a small "Color Palette" card (the washi-tape color theme switcher — 5 swatches; first is unchangeable, others are 2-tone tape themes).
- Level grid: responsive cards (`grid-template-columns: repeat(auto-fill, minmax(248px, 1fr))`). Each card shows level number, label, word count, a "mastered" progress bar, and two buttons (**Flashcards** / **Quiz**).
- **Locked levels** (HSK 3-9 for non-members): show a `เฉพาะสมาชิก` (Members only) lock chip and a single **Unlock** (`ปลดล็อก`) button instead of the two study buttons. Clicking it opens the paywall.
- Below grid: "Words to review" section (words the user marked "Not yet"), with listen/remove actions and a "Review now" button.

### Flashcard
- Card flips (CSS `rotateY`) between hanzi (+ optional pinyin) and meaning. Mark **known** / **not yet**; progress + order toggle (sequential/shuffle); end-of-deck summary.

### Quiz
- Multiple-choice (4 options). Two directions: 中→TH and TH→中. Score + results screen.

### Admin (word management)
- Reached via the gear button. Per-level tabs; search; add / edit / delete words; **Export JSON** and **Import JSON**; **Reset level** to defaults.
- Edits are layered over the built-in data and stored in `localStorage` (key `hskvocab_custom_v1`). In production this should be an authenticated admin API + DB writes.

### Paywall / Membership modal (steps via `payStep`)
- `plan` → shows price **99 บาท / เดือน**, feature checklist, CTA. CTA = **สมัครสมาชิก** (sign up) if not logged in, or **ดำเนินการชำระเงิน** (continue to payment) if logged in.
- `signup` → form: name / email / password (validated). On submit, creates account and proceeds to payment.
- `login` → form: email / password (validated against stored account).
- `qr` → **PromptPay QR** payment screen (the QR is a procedurally-generated FAKE pattern), amount 99.00 บาท, "ฉันชำระเงินแล้ว" (I have paid) button.
- `success` → confirmation + membership expiry date, "เริ่มเรียน HSK 3-9".
- `manage` → account info, membership status + expiry, **Renew +30 days**, **Cancel membership**, **Log out**.

## Interactions & Behavior
- Membership unlocks levels in `FREE = ['hsk1','hsk2']` plus everything when active. `isLocked(id)` gates `openFlash`/`openQuiz`.
- Membership is simulated with a **30-day expiry** timestamp; renew adds 30 days, cancel clears it.
- Text-to-speech uses the browser `SpeechSynthesis` API (`zh-CN`) for the "listen" buttons.
- Pinyin visibility, quiz direction, flashcard order, and tape theme persist in settings.
- Transitions: card flip ~0.5s; modal `popIn`/`floatIn` ~0.25–0.45s ease.

## State Management (current → production)
Current `state` fields of interest: `view, level, lang, showPinyin, progress, reviewList, customVocab, membership{active,expiry}, account, loggedIn, payStep, tapeTheme`.

localStorage keys (all client-side today):
- `hskvocab_progress_v1` — per-level known/not-yet map
- `hskvocab_settings_v1` — UI settings
- `hskvocab_custom_v1` — admin word edits
- `hskvocab_member_v1` — `{active, expiry}` membership
- `hskvocab_account_v1` — `{name, email, password, loggedIn}` ⚠ password stored in plaintext — **prototype only**

## ⚠ Production Backend Work (the real reason for this handoff)
The free study features can ship client-side, but these MUST become server-authoritative:

1. **Accounts / Auth** — real signup + login with hashed passwords (or an auth provider: Clerk, Auth0, Supabase Auth, Firebase Auth). Never trust a client `loggedIn` flag.
2. **Membership entitlement** — store subscription/expiry in a DB, checked on the server. Locked content (HSK 3-9 words) should be served only to entitled users via an authenticated API, so users can't unlock by editing localStorage.
3. **Real payments** — replace the fake PromptPay QR with a real provider that supports PromptPay in Thailand, e.g. **Omise/Opn**, **GB Prime Pay**, **2C2P**, or **Stripe** (PromptPay). Implement: create charge → display real QR → verify payment via **webhook** → grant membership server-side. Handle the monthly 99 THB recurring billing / renewal + cancellation.
4. **Vocabulary storage** — move `VOCAB` into a DB/CMS; gate HSK 3-9 behind entitlement on the API.
5. **Admin panel** — make it an authenticated admin-only route writing to the DB (currently anyone can edit). Keep import/export.
6. **Progress sync** — optionally move per-user progress to the server so it follows the account across devices.

## Design Tokens
**Colors**
- Ink / primary text: `#2E2E2E`
- Paper surfaces: `#FBFAF5`, `#FBFAF5`/`#fbf9f3`; desk bg `#cdc6b6`; topbar `#f1ece1`
- Muted text: `#5f5b51`, `#7a766c`, `#8a8678`, `#a8a496`
- Accent blue: `#AAB6C4`; pinyin/italic brown: `#97744e`
- Success (mastered/member): bg `#dbe6d3`/`#e3ecd6`, border `#a9c096`/`#6f8a55`, text `#4f6b41`/`#46603a`
- Gold (upgrade/locked): bg `#f3ead4`/`#efe7d6`, border `#b6924e`, text `#7a5e22`/`#8a7a52`
- Danger (delete/cancel): text `#8a4a3b`, hover bg `#ecd8d3`
- Tape themes (`THEMES`, c1/c2 two-tone): greige `#8E8B85`/`#8C6A45`, blue `#6E93B5`/`#2E2E2E`, kraft `#8C6A45`/`#6E93B5`, ink `#2E2E2E`/`#8C6A45`

**Typography** (Google Fonts)
- Chinese / display numerals: **Noto Serif SC** (weights 400–900)
- Latin / pinyin (italic): **Noto Serif**
- Thai body: **Noto Serif Thai**
- Decorative headings: **Chonburi**
- Handwritten accents: **Caveat**

**Shape / spacing**
- Border radius: cards/buttons mostly `2–5px`; pills `20–24px`; circles for icon buttons.
- Min hit target: buttons `min-height: 42–54px`.
- Shadows: soft layered, e.g. `0 16px 30px -18px rgba(40,40,40,.5)`; paper torn edge via SVG `feTurbulence` filters (`#tornEdge`).
- Slide/section bg uses inline SVG noise textures (`feTurbulence` + `feColorMatrix saturate 0`).

## Assets
- No binary image assets — all textures/QR/icons are inline SVG (procedural). Fonts are from Google Fonts.
- The PromptPay QR is a **placeholder pattern**, not a scannable code — replace with a real one from the payment provider.

## Files
- `HSK คำศัพท์.dc.html` — the source design/prototype (single Design Component: markup + logic + data). Primary reference; `VOCAB`, `LEVELS`, `STR` (i18n), `THEMES`, and all view logic live here.
- `HSK-vocab-app.html` — bundled standalone build (self-contained, opens in any browser). Good for quickly seeing/running the intended behavior.

> Note: `.dc.html` is a self-contained HTML format; you do not need its runtime to understand the design — read the markup/logic directly. Recreate it in your target framework rather than depending on that runtime.
