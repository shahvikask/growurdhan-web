# GrowUrDhan — Native Android Foundation Implementation Plan

Design and build the native Kotlin and Jetpack Compose foundation for **GrowUrDhan — Your Private Family Wealth Intelligence Platform** (`in.growurdhan.app`), establishing a Heritage Modern Wealth design system, adaptive five-destination shell, exact scaled financial domain layer, and interactive nested workflows ready for local Android Studio export and native SQLCipher/Chaquopy integration.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following product and design choices were confirmed during clarification and govern this first deliverable.

- **First-Launch Flow (Confirmed)**: Launch into an interactive **Onboarding & Consent** flow featuring a **Sample Mode toggle**, letting the user either explore a clearly badged synthetic household dataset or enter a truthful empty private book, alongside a working **Vault Lock / Unlock** flow.
- **Default Appearance (Confirmed)**: **Follow device theme (Light and Dark)** by default using GrowUrDhan's curated Heritage Modern Wealth palette (disabling Android 12+ wallpaper dynamic color override so navy, warm ivory, gold, and teal brand identity stays intact), with manual Light / Dark / System override in Settings.
- **Typography Pairing (Confirmed)**: **Plus Jakarta Sans** (headings, labels, body) paired with **JetBrains Mono** (`tnum` tabular numerals for INR amounts, quantities, ISINs, folios, and dates), bundled locally as static `.ttf` resources.
- **Interactive Scope (Confirmed)**: Full interactive coverage across all **five primary destinations**, **all nested routes** (Holding Detail, Accounts, Documents, Tax, Goals, Settings, Privacy & Diagnostics, Licence Status), **multi-step Holding Wizard** (all 8 categories and specialist fields), and **Ledger Event Recorder** (all 10 user-facing event types plus `CORRECTION` supersession).
- **D57 & External Integration Boundary**: Per Master Guide D57, **no financial vault backup, export, or restore** UI is exposed (`android:allowBackup="false"`), and permanent-data-loss warnings are displayed during onboarding and in Security Settings. On-device Chaquopy CAS PDF parsing is active (`arm64-v8a`), while Google Play Billing remains behind a clean boundary until Play Console SKUs go live.
- **Monthly Subscription Licensing & Terms v2.0 — Confirmed Decisions**:
  - **3-Tier Structure**: Replaces the previous Annual (`₹499/yr`) and 3-Year Founder's Pass (`₹999`) with three clear tiers: **90-Day Free Trial** (`₹0`, all features), **Free Forever** (`₹0`, 3 manual PDF parses/FY, no Gmail Sync), and **Pro Monthly Subscription** (`₹20/month`, inclusive of applicable taxes, auto-renewing mandate until user cancels, unlimited PDF parsing + Gmail Sync).
  - **Trial & Mandate Start (Confirmed)**: **90-day Free Trial starts automatically with zero payment details or mandate required upfront**; the ₹20/month auto-renewing Google Play / UPI AutoPay mandate is set up only when the user explicitly subscribes.
  - **Anti-Abuse FY PDF Quota Rule (Confirmed)**: **Count only paid-subscription and Free Forever parses** toward the 3-PDF Indian Financial Year (`Apr 1 – Mar 31`) counter. PDFs parsed during the 90-day Free Trial do not consume Free Forever quota, whereas PDFs parsed during a ₹20/month subscription DO count — so if a user parses `>= 3` PDFs while subscribed and cancels, Free Forever blocks further PDF parsing until April 1 reset.
  - **Price Disclosure (Confirmed)**: Displayed transparently as **₹20/month (inclusive of applicable taxes)** across the paywall, reminder banners, and Terms & Conditions.
  - **Terms & Conditions Rollout (Confirmed)**: Bump policy version to **`v2.0-MONTHLY-CASPARSER`** with complete subscription/mandate/cancellation clauses, FY quota carry-over rules, and **`casparser` (MIT) & on-device PDF parsing disclosures**; **prompt existing users to review and re-accept `v2.0`** upon unlocking the vault while requiring acceptance during new sign-ups.
- **Gmail Statement Sync — Confirmed Architecture Choices**:
  - **Multi-Gmail Linking**: **Family-wide inbox pool with per-member sync toggles** — connect multiple Gmail accounts into a shared household pool and toggle Gmail Sync per Family Member, naturally supporting both *one member receiving eCAS/NPS across multiple Gmail accounts* and *multiple family members sharing one Gmail inbox*.
  - **First-Time Lookback Limit**: **Last 3 months by default** (configurable in Settings: 3 months, 6 months, 12 months, or Current FY from April 1), preventing inception-to-date inbox floods.
  - **Latest-Only & Incremental Progression**: Import only the **latest statement month** per `(member, issuer)` stream (preferring `_TXN` over `_HLD` within the same month), then only strictly newer months on subsequent syncs — never re-importing older months.
  - **Commit Policy**: **Auto-commit verified matches, review only conflicts** — 100% owner-verified and clean reconciliation batches commit directly into the member's portfolio and history; any owner ambiguity, PAN/PRAN/CAS-ID mismatch, password failure, or reconciliation conflict routes cleanly to the Review Queue.
  - **Sync Trigger**: **Automatic sync whenever the vault is unlocked** (with smart per-session throttle + manual **Sync Now** button in Statements and Settings → Gmail Sync).
- **Cross-Source Deduplication & Back-Dated Statement Protection — Confirmed Decisions**:
  - **Back-Dated Statements (Confirmed)**: **Skip older holdings; import only newer items** — any holding in a manual or Gmail-synced statement older than that holding's latest recorded statement date is automatically marked **`Skipped (Older)`** (never appended again or rolled back), while genuinely missing or newer holdings in the same file still import cleanly.
  - **Same-Month Multi-Source Overlap (Confirmed)**: **Keep latest date; fill missing cost basis** — when both a depository CAS (`CDSL` / `NSDL`) and an RTA CAS (`CAMS` / `KFintech`) report the same Mutual Fund folio, preserve the latest valuation date and units without duplicating entries, and automatically backfill missing (`Unknown`) cost basis when the other source prints it.
  - **Same ISIN Across Multiple Folios or Demat + SOA (Confirmed)**: **Separate per folio or demat; deduplicate same folio** — track positions by `(owner, ISIN, custody scope: normalized SOA Folio vs. Demat DP/Client ID)` so two distinct folios or a Demat + SOA pair of the same ISIN stay separate while the exact same folio across CAMS/KFintech and CDSL/NSDL deduplicates into one holding.
  - **Multi-Provider Gmail Sync (Confirmed)**: **Sync all sources; auto-deduplicate and keep latest** — scan all 5 official senders (`CAMS`, `KFintech`, `NSDL`, `CDSL`, `Protean NPS`), order downloads newest-first across sources, and let the holding-level deduplication & freshness engine skip redundant or back-dated cross-source entries automatically.
- **Subcategory-Aware Holding Form Optimization — Confirmed Decisions**:
  - **Direct Valuation for Single-Value Instruments (Confirmed)**: **Hide `Units = 1`; ask Balance or Value directly** for single-value holdings (Savings/Current/Other Cash accounts, Bank FD, PPF, EPF, NPS, SSY, SCSS, NSC, KVP, POMIS, Post Office RD, Physical Real Estate, PMS, AIF, and Loans), while retaining **Weight (grams) × Rate/gram** for Gold & SGB and **Units × Price/NAV** for Equity, Mutual Funds, REIT/InvIT, Bonds/GOI, Unlisted Equity, ESOP, and Liquid/Overnight Funds.
  - **Subcategory Taxonomy Preservation (Confirmed)**: **Keep existing subcategories; optimize their fields only** across all 6 target categories (**Gold & SGB**, **Fixed Income**, **Real Estate**, **Specialised**, **Cash & Bank**, and **Liabilities**), keeping vault data and filters completely stable.
  - **Liabilities Enhancements (Confirmed)**: **Add Linked Property picker and EMI Due Day (1–31)** — let Home Loans link directly to an existing Real Estate holding (powering Net Property Equity) and wire the EMI schedule engine to use each loan's recorded EMI due day instead of a hardcoded 5th of the month.
  - **Full Wizard + Edit Metadata Parity (Confirmed)**: **Sync both Add Wizard and Edit Metadata sheet** from one shared declarative subcategory schema, and scrub non-applicable defaults so saving never leaks unrelated metadata (such as `ownershipPercent = 100`, `sgbCouponRate = "2.50"`, or `aifCategory = "Category III"`).

---

## 1. Overview & Core Concept

- **What It Does**: Provides a calm, offline-first Indian household financial record book where families track holdings across eight asset categories, custody accounts, legal vs. beneficial ownership, nominees, goals, and an append-only event ledger with explicit uncertainty (`UNKNOWN` cost basis, stale-price flags, and source/date provenance).
- **Target Audience / Persona**: Multi-generational Indian households (Primary Owner, Spouse, Minor with Guardian, HUF) managing equities, mutual funds, SGBs/gold, PPF/EPF/NPS/FDs, real estate, PMS/AIF/ESOPs, bank accounts, and loans across multiple folios, brokers, and depositories.
- **Key Value**: Establishes an auditable, privacy-respecting native Compose foundation with real ViewModel state, deterministic fixed-scale domain math, and clean package boundaries so exporting to Android Studio requires zero UI rewrite when wiring SQLCipher, Keystore, and Chaquopy CASParser.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Sign Up & Onboarding → Vault Admission → Home**:
   - **Step 1 (Primary Account Sign Up & Vault Passcode)**: User enters First Name, Last Name, Email Address, Password / Create Vault Passcode, PAN Card (auto-capitalized by default), Date of Birth (typed or Material 3 DatePicker), and Relationship (`Self` by default), alongside the **D57 Permanent-Data-Loss Notice** (`allowBackup="false"`). Tapping Continue validates all fields and opens the **Terms & Conditions & Local-Only Privacy Notice** sheet; accepting records the agreement date & timestamp inside the encrypted local vault database (`growurdhan_vault.enc` + `growurdhan_auth.enc`).
   - **Step 2 (Vault Offline Recovery Code & PDF Download)**: Dedicated exclusively to the generated Offline Recovery Code (`XXXX-XXXX-XXXX`), allowing the user to download an A4 Recovery Code PDF directly to their local device via zero-permission Android SAF (`CreateDocument("application/pdf")`) or print/save via system Print, and confirm safekeeping.
   - **Step 3 (Sample Mode & Enter Vault)**: **Sample Mode Toggle** ("Explore with Synthetic Family Sample" vs. "Create Private Vault") -> enters Home and automatically creates the signed-up user under **Family & Ownership** as the protected `Self` Primary Account Owner (cannot be deleted even by the primary user).
2. **Vault Lock / Unlock, Privacy Hide Mode & Settings**:
   - Top-bar **Lock Now** and **Hide Mode (`₹ •••••`)** toggles immediately obscure sensitive amounts, PANs, and PRANs across all screens or transition to the Locked Vault screen requiring passcode verification (plus Device Credential/Biometric hook point).
   - **Settings → Security & Auto-Lock**: Places **Auto-lock timeout (`1 min`, `5 min`, `15 min`)** directly beneath the `Security & Auto-Lock` heading, uses clean non-technical copy (**Hide INR Balances (Privacy Mode)** and **Block Screenshots & Recents** without raw `FLAG_SECURE` or `Android Keystore` diagnostics strings), and keeps technical engine diagnostics tucked cleanly inside **Settings → Services**.
   - **Settings → Services (Service Monitor)**: Hidden unless tapped from Settings; opens a dedicated Service Monitor showing live status (`Running` / `Stopped` / `Error`) for every subsystem (Python CASParser Engine, Encrypted Local Vault, Keystore & Vault Auth, Auto-Lock Monitor, Offline PDF Renderer, Gmail Sync Adapter, Market Feed Adapter) along with the **Check Python Engine** action.
3. **Portfolio → Holding Wizard → Holding Detail → Ledger Event**:
   - Filter by Family Owner Lens (Household All / Individual / HUF / Minor) and **color-coded Asset Categories** (matching GrowUrDhan's category palette: Equity `#38BDF8`, Mutual Funds `#818CF8`, Gold & SGB `#F5C14A`, Fixed Income `#34D399`, Real Estate `#C084FC`, Cash & Bank `#22D3EE`, Specialised `#F472B6`, Liabilities `#FB7185`). Populated categories are ordered first and highlighted with their category color & holding count, while empty categories are grayed out so users immediately see which categories hold data.
   - Launch the multi-step **Holding Wizard**: Category (8) → Subcategory → Identity & Ownership/Custody (with subcategory-aware labels, Indian placeholder examples, and conditional ISIN visibility only for securities that actually carry an ISIN) → **Subcategory-Aware Specialist Fields** (showing strictly relevant fields per `(Category, Subcategory)` with Material 3 quick-select chips for finite options like Purity, Compounding, NPS Tier/CRA, AIF Category, and Fixed/Floating Rate Type) → **Mode-Matched Valuation & Cost** (Direct Current Balance / Property Value / Outstanding Principal for single-value instruments, Weight in grams × Rate/g for Gold & SGB, or Units × Price/NAV for listed/unitized securities) → Review & Atomic Commit.
   - Open any Holding Detail (`Overview`, `History`, `Income & Tax`, `Details`) to view human-readable specialist metadata (including Linked Property equity context on Home Loans), edit metadata through the **synced subcategory-aware Edit Metadata sheet**, and record any user-facing ledger event (`BUY`, `SELL`, `OPENING_BALANCE`, `BONUS`, `SPLIT`, `DIVIDEND`, `INTEREST`, `VALUATION_UPDATE`, `REPAYMENT`, `CORRECTION`) with live impact preview and validation against negative quantities or cross-owner writes.
4. **Statements & Reconciliation, Family Profiles & Nested Workflows**:
   - **On-Device CAS PDF & JSON Import**: Clean intake UI (technical `casparser` / `pypdfium2` / `aarch64` engine details hidden from Statements and moved to **Settings → Services**), with a compact folder-icon-only button beside the **Statements & Reconciliation** heading to prevent vertical label wrapping. Selecting a family member automatically populates the PDF password from that profile (**PAN Card in CAPITALS** for CAS statements, or **first 4 lowercase letters of first name + `DDMM`** for NPS statements, e.g. `rahu1508` for Rahul born August 15) and tries household PAN/NPS candidates for multi-member & future Gmail Sync eCAS imports. Staging verifies printed **PAN** and **PRAN** against the selected owner and offers 1-tap owner switching when a statement belongs to another family member.
   - **Compact Import History (Statements & Documents)**: Both **Statements & Reconciliation** and the **Documents** tab render only the **latest 1 imported record** by default, with an explicit expand/collapse control to reveal or hide older imports on demand so long histories do not bloat page rendering. Inside **Documents**, the parsed history table displays the **import date (`YYYY-MM-DD`) in the first column** alongside reduced, compact aligned typography (`Date`, `Document`, `Format`, `Status`, `SHA`) so every row aligns cleanly.
   - **Family & Ownership Profiles**: Store **PAN Card** (auto-capitalized), **Date of Birth** (with DatePicker + text input for NPS statement unlocking), and **PRAN (NPS Account Number)** inside the encrypted vault under each member's profile. The primary `Self` owner created at signup is permanently protected from deletion.
   - Navigate seamlessly to **Accounts & Custody**, **Documents**, **Tax & Capital Gains (FIFO / STCG / LTCG)**, **Goals**, **Settings**, **Services**, **Privacy & Diagnostics**, and **Play Licence Status**.

### Visual Identity & Theme

- **Aesthetic Direction**: **Heritage Modern Wealth** — authoritative, calm, uncluttered, and financially honest. Balances crisp editorial spacing and generous hairline borders with high-contrast tabular numbers and explicit provenance badges (`Known Cost`, `Cost Unknown`, `Dated NAV`, `Sample Data`).
- **Color Palette & Mood**:
  - **Dark Theme (Heritage Navy)**: Background `#07131F`, Chrome/Top-Bottom Bars `#0C1C2C`, Elevated Card `#102536`, Hairline Border `#1C374F`, Primary Text `#F4F7FB`, Muted Text `#9BB3C7`, Primary Accent Gold `#F5C14A`, Secondary Accent Teal `#2DD4BF`.
  - **Light Theme (Warm Ivory)**: Background `#F6EFE3`, Surface `#FFFFFF`, Elevated Surface `#FBF8F2`, Hairline Border `#E3D9C8`, Primary Text `#1C1917`, Muted Text `#6B5E52`, Primary Accent Deep Navy `#0C2338` with Warm Gold `#B87D0B` / `#F5C14A` badges, Secondary Accent Deep Teal `#0F766E` for WCAG AA contrast (`>= 4.5:1`).
  - **Semantic Status Tokens**: Gain/Verified Teal, Caution/Unknown Cost Amber-Gold, Loss/Liability/Error Crimson (`#E05252` dark / `#B91C1C` light) — always paired with an icon and text label (never color-only status).
- **Typography & Hierarchy**:
  - Display & UI: **Plus Jakarta Sans** (SemiBold/Bold headings, Medium labels, Regular body).
  - Financial & Identifiers: **JetBrains Mono** with `fontFeatureSettings = "tnum"` for INR figures (`₹ 1,42,85,000.00` Indian numbering formatter), quantities, ISINs, DP/Client IDs, and ISO/display dates.
- **Component Styling & Adaptive Layout**:
  - Material 3 `Scaffold` with `enableEdgeToEdge()`, proper `WindowInsets` (`safeDrawing`, `navigationBars`), `48.dp` minimum touch targets (`minimumInteractiveComponentSize()`), and `200%` font-scale wrapping resilience (`FlowRow` / responsive columns so INR values never clip).
  - Adaptive navigation: `NavigationBar` on Compact (`< 600.dp`) and `NavigationRail` + two-pane List-Detail / multi-column dashboard grid on Medium/Expanded (`>= 600.dp`) screens.
  - Persistent **Sample Data Banner** whenever Sample Mode is enabled, with a one-tap switch to clear back to the truthful empty book.

---

## 3. Key Product Decisions & Trade-Offs

- **Single-Module AI Studio Layout with Strict Internal Package Boundaries**
  - *Chosen Approach*: Keep a single `:app` Gradle module compatible with AI Studio's builder, organized into crisp internal packages (`designsystem`, `security`, `database`, `parserapi`, `domain`, `data`, `feature`) mirroring the target multi-module split.
  - *Why*: Avoids breaking AI Studio builds with multi-module Gradle configuration while keeping domain engines completely free of Compose/Android dependencies for trivial module extraction after ZIP export.
  - *Alternatives Considered*: Fake multi-module folders inside one build script, which creates brittle path coupling.
- **Repository Interfaces Backed by Reactive In-Memory Ledger + Security/Database Contracts**
  - *Chosen Approach*: Implement real `StateFlow`-backed repositories and deterministic Kotlin domain calculators (exact `10,000` money scale, `100,000,000` quantity scale, append-only event validation, Indian INR formatting, FIFO lots, concentration, family ownership guards) behind `VaultDatabaseBoundary` and `KeystoreSessionManager` interfaces.
  - *Why*: Delivers truthful interactive persistence within the session, zero fake external integrations, and clean drop-in points for SQLCipher, Android Keystore, and Chaquopy CASParser in local Android Studio.
  - *Alternatives Considered*: Adding Room without SQLCipher now (which would risk unencrypted schema mismatch against SQLCipher migrations later).
- **Strict Honesty for Blocked Native Integrations (CASParser, Play Billing, Gmail)**
  - *Chosen Approach*: Expose real UI states, review workflows, and boundary contracts clearly labeled as awaiting Android Studio native dependency wiring (`Chaquopy / casparser`, `Google Play Billing`, `Gmail OAuth`).
  - *Why*: Honors the binding rule against fake CAS parsing, fake billing, or fake Gmail data.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER (Jetpack Compose + M3)            │
│  ┌──────────────┐  ┌─────────────────────────┐  ┌────────────────────┐  │
│  │  Onboarding  │  │  5-Destination Shell    │  │  Nested Workflows  │  │
│  │  & VaultLock │  │  Home · Portfolio ·     │  │  HoldingWizard     │  │
│  │              │  │  Statements · Insights  │  │  HoldingDetail     │  │
│  │  (Sample /   │  │  · Family (NavBar/Rail) │  │  Accounts · Docs   │  │
│  │   Empty)     │  └────────────┬────────────┘  │  Tax · Goals ·     │  │
│  └──────┬───────┘               │               │  Settings/Privacy  │  │
│         └───────────────────────┼───────────────┴──────────┬─────────┘  │
└─────────────────────────────────┼──────────────────────────┼────────────┘
                                  ▼                          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   STATE & VIEWMODEL LAYER (StateFlow)                   │
│  AppSessionViewModel · PortfolioViewModel · StatementsViewModel ·       │
│  InsightsViewModel · FamilyViewModel · SettingsViewModel                │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                 PURE KOTLIN FINANCIAL DOMAIN & RULES                    │
│  MoneyQuantityScale (10^4 / 10^8) · IndianCurrencyFormatter ·           │
│  AppendOnlyLedgerEngine (11 EventTypes) · OwnershipAuthorizationGuard · │
│  FifoLotCalculator · PortfolioAggregator · HoldingValidationRules       │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│               DATA ADAPTERS & BOUNDARY CONTRACTS                        │
│  WealthRepository (InMemory / Synthetic Sample Seed) ·                  │
│  VaultSecurityBoundary (Lock/Passcode/D57 Rules; Keystore hook) ·       │
│  CasParserBoundary (CAMS/KFintech/NSDL/CDSL/NPS contract) ·             │
│  MarketPriceBoundary · GmailIntakeBoundary · PlayBillingBoundary        │
└─────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State

- **Exact Fixed-Scale Primitives**:
  - `MoneyAmount(val scaled: Long)` where `1 INR = 10_000L` (`4` decimal places, overflow-checked `BigDecimal` conversion at input/display boundaries; never `Double`).
  - `QuantityAmount(val scaled: Long)` where `1 unit = 100_000_000L` (`8` decimal places).
  - `CostBasisState`: sealed interface (`Known(amount: MoneyAmount)`, `Unknown(reason: String)`).
- **Core Entities (Encrypted Local Vault `growurdhan_vault.enc`, `schemaVersion = 13`)**:
  - `FamilyMember` (id, displayName, relationship, entityType: `INDIVIDUAL`/`HUF`/`MINOR`, guardianId, panMasked [normalized uppercase PAN], email, dateOfBirth [ISO `YYYY-MM-DD`, used for NPS password derivation `first4Lower + DDMM`], pran [12-digit NPS PRAN], `casId` [unique CDSL/eCAS identifier e.g. `AA07970379`], `casIdSource` [`PROFILE`/`IMPORT`], `pranSource` [`PROFILE`/`IMPORT`], `gmailSyncEnabled`, `casSyncAfter` [latest synced ISO period], `pranSyncAfter` [latest synced NPS ISO period], isPrimaryOwner, isAccountOwner [protected against deletion]).
  - `GmailConnectedAccount` (email, connectedAtIso, lookbackMonths, lastHistoryId, lastSyncedAtIso, lastSyncSummary, status [`CONNECTED`/`NEEDS_REAUTH`/`ERROR`]) and `GmailSeenAttachment` (`messageId`, `attachmentId`, `filename`, `sha256Prefix`, `ownerId`, `statementMonth`, `disposition`).
  - `TermsConsentRecord` (agreed, acceptedAtIso, acceptedAtEpochMillis, termsVersion, signerFullName, signerEmail, d57Acknowledged) — recorded in both encrypted vault and auth store on Step 1 Terms acceptance.
  - `CustodyAccount` (id, ownerId, accountType, institution, maskedNumber, depository, dpId, clientId, boId, pran, cra, pfm, ifsc, nomineeIds).
  - `Holding` (id, name, symbolOrFolio, isin, assetCategory [8], subcategory, legalOwnerId, beneficialOwnerId, custodyAccountId, guardianId, nomineeIds, quantity, costBasis, currentPrice, priceSource, priceAsOfDate, isStalePrice, reviewStatus, goalTags, specialistDetails covering all legacy `HoldingDetails` fields plus backward-compatible nullable `interestRatePercent` [Fixed Income / Savings], `storageLocation` [Physical Gold], `latestStatementDate`, and `latestStatementSource` for cross-source freshness protection).
  - `LedgerEvent` (id, holdingId, ownerId, accountId, eventDate, createdAtMillis, type [all 11 types], quantity, unitPrice, amount, charges, source, importFingerprint, notes, supersedesEventId).
  - `Goal`, `StatementDocument` (including persisted `importedDate` ISO `YYYY-MM-DD`), `DiagnosticEntry`, `AppSessionState` (onboarded, locked, privacyMasked, sampleModeEnabled, themePreference, ownerLensId, consentTimestamp).

### Interactive Component & State Mapping

- **Global App Shell**: Top bar hosts **GrowUrDhan Brand Mark**, **Owner Lens Selector** (All Household / Member chip), **Hide Mode Toggle**, and **Lock Vault** action; persistent **Sample Mode Banner** appears whenever synthetic demo data is active.
- **Sign Up, Terms, Recovery PDF & Lock Flows**: Step 1 collects profile details + Vault Passcode and validates fields before presenting the Terms & Local-Only Privacy sheet (persisting consent timestamp). Step 2 is dedicated exclusively to the Offline Recovery Code and zero-permission A4 PDF download (`CreateDocument`) / Print. Step 3 selects Sample Mode vs. Private Vault and auto-creates the protected `Self` owner under Family & Ownership. Lock screen clears sensitive view state from display until unlocked.
- **Settings & Services Monitor**: Security & Auto-Lock surfaces Auto-lock timeout (`1 min`, `5 min`, `15 min`) directly below the heading, uses clean user-facing Hide Mode and screenshot-block labels, and routes to **Services** (`GrowUrDhanRoutes.SERVICES`) for on-demand service health monitoring (`Running` / `Stopped` / `Error`) and **Check Python Engine**.
- **Statements & Documents History**: Folder-icon-only button (`statements_open_documents_button`) beside **Statements & Reconciliation** opens **Documents**. Target owner selector auto-populates uppercase PAN (or NPS 4-letter lowercase + `DDMM`), passes household PAN/NPS password candidates to Chaquopy (`com.chaquo.python` 17.0.0 + `casparser` + `pypdfium2` `arm64-v8a`), and verifies extracted investor PAN and PRAN against the target member with 1-tap owner switching when mismatched. Both Statements and Documents collapse import history to the most recent 1 record by default with expand/collapse controls (`statements_history_toggle_button`, `documents_history_toggle_button`), and Documents renders a compact aligned 5-column table starting with import `Date`.
- **Portfolio, Holding Wizard & Edit Metadata**: Category filter chips display per-category colors and counts (populated categories highlighted first; empty categories grayed out), and `HoldingRowCard` shows each holding's category accent dot. Both the **Holding Wizard** and **Edit Holding Metadata sheet** are driven by a single declarative **Subcategory Form Schema** that controls ISIN visibility, specialist field visibility, Material 3 quick-select chips, Step 4 valuation mode (Direct Balance / Value / Outstanding Principal vs. Weight in grams vs. Units × Price), Linked Property selection for Home Loans, and zero-leakage persistence (only saving fields applicable to the chosen subcategory). Fixed Income interest rates feed directly into the interest-accrual engine, and Liability EMI due days drive the upcoming EMI calendar engine.
- **Ledger Event Sheet**: Modal bottom sheet validates event type rules (disallowing negative resulting quantity on `SELL` and restricting `SNAPSHOT_ADJUSTMENT` to source-reconciliation provenance), previews position/cost impact, and appends a new immutable event (or `CORRECTION` referencing `supersedesEventId`).

### Verification Plan

- **Compilation & Static Checks**: Verify Android Gradle build (`compile_applet`) with Chaquopy 17.0.0 (`arm64-v8a`) and project metadata sync (`in.growurdhan.app`, `minSdk = 26`, `targetSdk = 36`, `allowBackup = false`, custom adaptive launcher icon).
- **JVM & Robolectric Test Suite** (`gradle :app:testDebugUnitTest`):
  - Exact money (`10,000`) & quantity (`100,000,000`) scaling, Indian INR formatting, and `CostBasisState.Unknown` preservation tests.
  - Append-only ledger & ownership authorization tests (all 11 event types, negative-quantity rejection, cross-owner write denial, `CORRECTION` supersession).
  - Sign-Up Step 1–3 validation, Terms agreement timestamp persistence across cold restart, Recovery Code A4 PDF generation, and protected primary `Self` owner deletion prevention.
  - Settings & Services Monitor tests (Auto-lock placement, Hide Mode rename, clean screenshot toggle copy, hidden technical diagnostics, on-demand Services screen & Check Python Engine).
  - Family DOB & PRAN persistence (`schemaVersion = 11`), NPS password derivation (`rahu1508`), Statements auto-PAN/NPS password fill & PAN/PRAN owner verification, Portfolio category colors & active/empty highlighting, and Holding Wizard subcategory-aware forms & Edit Metadata parity.
  - Subcategory-aware form schema validation across all 6 non-equity/MF categories (verifying irrelevant fields are excluded, zero default-value leakage on save, direct balance/principal valuation mapping, Fixed Income recorded interest-rate accrual, Liability EMI due day scheduling, Home Loan property linking, and encrypted vault round-trip for new nullable fields).
  - 90-day trial window, Indian FY (April 1) PDF parse quota reset & Free Forever 3-parse carry-over enforcement (excluding 90-day trial parses, counting Pro Monthly parses), Pro Monthly `₹20/month` (inclusive of taxes) subscription model, `v2.0-MONTHLY-CASPARSER` Terms & `casparser` MIT notice re-acceptance, and automated trial-expiry reminder milestones (Days 75 / 83 / 87 / 90+).
  - Compose UI & Accessibility tests via Robolectric: onboarding + sample toggle, lock/unlock state, 5-destination navigation, nested route traversal (Accounts, Documents, Tax, Goals, Settings, Services, Paywall/Licensing), Holding Wizard specialist submission, empty-state vs. sample-mode separation, and `48.dp` touch-target / semantics verification.

---

## 5. Monthly Subscription Licensing, FY PDF Quota Carry-Over & Detailed Terms & Conditions (`v2.0`)

Design and implement GrowUrDhan's simplified **3-tier Indian-market licensing model** centered around an affordable **₹20/month auto-renewing subscription**, paired with an anti-abuse **Financial Year PDF parse carry-over guard** and comprehensive **Terms & Conditions (`v2.0-MONTHLY-CASPARSER`)** covering subscription mandates, cancellation, and open-source `casparser` PDF parsing disclosures.

### 5.1 Three-Tier Structure (Replacing Annual & 3-Year Passes)

| Tier | Pricing & Billing | Key Features & Limits |
| :--- | :--- | :--- |
| **90-Day Free Trial** | **₹0** (First 90 days · Zero payment/mandate upfront) | All Pro features unlocked from Day 1 · Unlimited manual CAS/NPS PDF parsing (does **not** consume Free Forever FY quota) · Full automated Gmail Statement Sync · Clean automatic transition to Free Forever on Day 91 with zero surprise charge |
| **Free Forever** | **₹0** (No ads · All existing data stays intact) | Core portfolio dashboard, family ownership & custody tracking · Manual ledger events & broker CSV/TXT import · Up to **3 manual PDF parses per Indian Financial Year (April 1 – March 31)**, shared with any PDFs parsed during a paid subscription in the same FY · **No Gmail Sync** |
| **Pro Monthly Subscription** | **₹20 / month** (Inclusive of applicable taxes · Auto-renewing Google Play mandate) | Unlimited CAS/NPS PDF statement parsing · Full automated Gmail Statement Sync (multi-inbox pool + per-member attribution) · All advanced analytics & multi-AY FIFO tax summaries · Renews automatically every month via Google Play / UPI AutoPay mandate **until cancelled by the user** in Google Play Subscriptions |

### 5.2 Google Play Console Subscription SKU & Mandate Disclosure

- **Single Active Subscription SKU**: `gud_pro_monthly_20` — Auto-renewing monthly subscription (`₹20/month`, inclusive of applicable taxes; billing period `P1M`), replacing the retired `gud_pro_annual_pass` and `gud_founders_pass_3yr` SKUs.
- **Mandate & Self-Service Cancellation Transparency**:
  - The 90-day Free Trial never asks for payment details or an auto-debit mandate upfront.
  - When the user chooses to subscribe to **Pro Monthly (`₹20/month`)**, Google Play Billing authorizes a recurring monthly mandate (UPI AutoPay, debit/credit card, or Google Play payment method) that renews automatically every month until the user cancels themselves via **Google Play → Payments & Subscriptions → Subscriptions** (direct **Manage Subscription in Google Play** deep-link provided on the Licensing screen).
  - Cancellation takes effect at the end of the current paid billing cycle; all previously imported holdings, ledger events, goals, and tax records remain 100% intact on **Free Forever**.

### 5.3 Anti-Abuse Financial Year PDF Quota Carry-Over Architecture

To prevent subscribe-for-one-month-then-cancel abuse while keeping the initial 90-day evaluation genuinely generous:

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                     PDF PARSE EVENT (Manual or Gmail Sync)                   │
└───────────────────────────────────────┬──────────────────────────────────────┘
                                        ▼
                      ┌───────────────────────────────────┐
                      │   Determine Active License Tier   │
                      └─────────────────┬─────────────────┘
          ┌─────────────────────────────┼─────────────────────────────┐
          ▼                             ▼                             ▼
┌───────────────────┐       ┌───────────────────────┐       ┌──────────────────┐
│ 90-DAY FREE TRIAL │       │ PRO MONTHLY (₹20/mo)  │       │   FREE FOREVER   │
│ • Unlimited PDFs  │       │ • Unlimited PDFs      │       │ • Check FY count │
│ • Gmail Sync: ON  │       │ • Gmail Sync: ON      │       │   against 3/FY   │
│ • FY Counter:     │       │ • FY Counter:         │       │ • Gmail Sync:OFF │
│   NOT incremented │       │   INCREMENTED (+1)    │       │ • If count >= 3: │
│   (trial parses   │       │   for every manual &  │       │   BLOCK until    │
│    kept separate) │       │   Gmail PDF parsed    │       │   next Apr 1     │
└───────────────────┘       └───────────┬───────────┘       └────────▲─────────┘
                                        │ User cancels mandate       │
                                        └────────────────────────────┘
                             FY counter carries over on downgrade:
                             If >= 3 PDFs parsed during Pro Monthly in current FY,
                             Free Forever shows 0/3 left until April 1 FY reset.
```

- **Indian Financial Year Window (`Apr 1 – Mar 31`)**: Counter is keyed by `fyStartYear` (`month >= 4 ? year : year - 1`) and automatically resets to `0` on **April 1** each year.
- **Counting Rules**:
  - **90-Day Free Trial**: Parses succeed without incrementing `pdfParsesUsedInCurrentFy`, so users who finish the trial and move to Free Forever start with `0 / 3` used (`3` parses remaining for that FY).
  - **Pro Monthly (`₹20/month`)**: Unlimited parsing is always allowed while the subscription is active, **and** every successful PDF parse (both manual CAS/NPS PDF parses and Gmail Sync auto-committed PDF parses) increments `pdfParsesUsedInCurrentFy`.
  - **Free Forever (Post-Trial or Post-Cancellation)**: Allows manual PDF parsing only while `pdfParsesUsedInCurrentFy < 3` and increments the counter on each successful parse. If the user already parsed `>= 3` PDFs while subscribed earlier in the same Financial Year and then cancels, remaining Free Forever allowance is **`0 / 3`** until April 1 (with a clear explanation banner and one-tap **Subscribe for ₹20/month** CTA).

### 5.4 Automated Trial-Expiry & Downgrade Reminder Cadence

- **Days 1–74 (`NONE`)**: Quiet full-access trial — zero upgrade popups while users import statements and experience Gmail Sync.
- **Day 75 — 15 Days Left (`DAY_75_HEADS_UP`)**: Dismissible Home card introducing **Pro Monthly (`₹20/month`, inclusive of taxes, cancel anytime)** to keep automated Gmail Sync and unlimited PDF parsing.
- **Day 83 — 7 Days Left (`DAY_83_ONE_WEEK`)**: 1-week reminder highlighting Gmail Sync & tax-season unlimited PDF benefits while confirming existing records stay safe on Free Forever.
- **Day 87 — Final 3 Days (`DAY_87_FINAL_DAYS`)**: Final countdown reassuring users that no payment mandate is active during the trial (zero auto-charge on Day 91) and summarizing Free Forever (3 manual PDF parses/FY, resetting April 1).
- **Day 90+ / Post-Cancellation (`EXPIRED_FREE_FOREVER`)**: Calm Free Forever status card showing exact remaining FY PDF parses (`X/3`, or `0/3 — resets April 1` if `>= 3` PDFs were already parsed during a cancelled monthly subscription in the current FY) plus upgrade CTA to **Pro Monthly (`₹20/month`)**.

### 5.5 Detailed Terms & Conditions (`v2.0-MONTHLY-CASPARSER`) & Existing-User Re-Acceptance

1. **Structured Terms & Conditions Content (Displayed in Onboarding, Update Prompt, and Privacy & Licensing Settings)**:
   - **Clause 1 — Local-First Encrypted Household Vault**: All portfolio holdings, family profiles, PAN/PRAN/CAS IDs, ledger entries, and statement provenance reside exclusively in AES-256-GCM encrypted local device storage; GrowUrDhan operates no cloud household database and shows zero ads.
   - **Clause 2 — D57 Permanent Data-Loss Policy**: Cloud vault backup/restore is disabled (`allowBackup = false`). Uninstalling the app or losing both the Vault Passcode and Offline Recovery Code permanently deletes local household records.
   - **Clause 3 — On-Device CAS/NPS Parsing & `casparser` Open-Source Conditions**:
     - CAMS, KFintech, NSDL, CDSL, and Protean NPS PDF statements are unlocked and parsed strictly on-device inside an embedded local Python runtime; raw PDFs and PDF passwords (PAN / DOB-derived NPS password) are never uploaded to GrowUrDhan servers.
     - **Open-Source Attribution & License Notice**: Statement PDF extraction incorporates the open-source **`casparser`** library (**MIT License**, Copyright © Sandeep Somasekharan / `codereverser/casparser`) and **`pypdfium2`** (**Apache License 2.0 / BSD-3-Clause**). Both libraries and the parsed output are provided **"AS IS"**, without warranty of any kind, express or implied, including merchantability, fitness for a particular purpose, or uninterrupted compatibility with changing Indian RTA/depository statement formats.
     - **User Verification & Non-Advisory Disclaimer**: Registrar PDF formats can change without notice. Users must inspect and confirm printed vs. parsed totals, owner PAN/PRAN/CAS ID attribution, and individual holding deltas in **Review & Commit** before committing to the ledger. GrowUrDhan is a personal record-keeping tool — not a SEBI-registered investment adviser, broker, RTA, depository, or Chartered Accountant/tax filing service.
   - **Clause 4 — Optional Gmail Statement Sync (Read-Only)**: Requests strictly `gmail.readonly` access via Android Google Identity Services, scans only the 5 official Indian statement sender addresses (`donotreply@camsonline.com`, `samfS@kfintech.com`, `NSDL-CAS@nsdl.co.in`, `eCAS@cdslstatement.com`, `nps-statements@mailer.proteantech.in`), holds OAuth access tokens solely in volatile RAM, and wipes tokens immediately when the vault locks.
   - **Clause 5 — 90-Day Trial, ₹20/Month Auto-Renewing Subscription Mandate & Cancellation**:
     - New accounts receive a **90-day Free Trial** with all features unlocked and zero payment details or auto-debit mandate required upfront; after 90 days, the account cleanly transitions to **Free Forever** unless the user subscribes.
     - **Pro Monthly Subscription** costs **₹20/month (inclusive of applicable taxes)** and is billed via **Google Play Billing** using an auto-renewing payment mandate (e.g., UPI AutoPay, card, or supported Play payment method). The mandate renews automatically each month until the user cancels directly in **Google Play → Payments & Subscriptions → Subscriptions**. Cancellation stops future renewals and keeps Pro access active through the end of the paid billing cycle; refunds follow Google Play's refund policy.
   - **Clause 6 — Free Forever Plan & Financial Year PDF Quota Carry-Over Policy**:
     - Free Forever provides ad-free tracking, manual ledger/CSV entries, no Gmail Sync, and up to **3 manual PDF parses per Indian Financial Year (April 1 – March 31)**.
     - PDFs parsed while subscribed to Pro Monthly count toward the current Financial Year's parse tally; if a user cancels Pro Monthly after parsing 3 or more PDFs in the current Financial Year, no additional Free Forever PDF parses are allowed until the counter resets to `0` on **April 1** of the next Financial Year (PDFs parsed during the initial 90-day Free Trial are excluded from this cap).
   - **Clause 7 — Truthful Cost Basis & Primary Owner Protection**: Unknown acquisition costs remain explicitly marked `UNKNOWN` and are never fabricated as zero; the primary `Self` owner created during sign-up is protected from deletion.
2. **Existing-User Re-Acceptance Workflow**:
   - On vault unlock, if an already-onboarded user's stored consent record has `termsVersion != "v2.0-MONTHLY-CASPARSER"` (such as `v1.0-D57-LOCAL`), a blocking **Updated Terms & Conditions (`v2.0`)** modal sheet automatically opens highlighting what changed (₹20/month auto-renewing subscription, FY PDF quota carry-over rule, and `casparser` open-source/accuracy terms).
   - The user reviews the full scrollable Terms, checks the consent box, and taps **Accept Updated Terms**, updating the encrypted consent timestamp and `termsVersion = "v2.0-MONTHLY-CASPARSER"` in both the vault book and auth store.
   - Users can also view the full `v2.0` Terms & Conditions and `casparser` MIT license notice anytime from **Settings → Privacy & Diagnostics** and **Settings → Licence & Subscription**.

### 5.6 Verification Status for Monthly Subscription & Terms v2.0 (Implemented & Verified)

- **Unit Tests (`Phase6AnalyticsTaxTrialUnitTest`, `MonthlySubscriptionAndTermsV2Test`) — Passed**:
  - Verified 3-tier `LicenseTier` model (`TRIAL_90_DAY`, `FREE_FOREVER`, `PRO_MONTHLY`) and single `gud_pro_monthly_20` SKU (`₹20/month`, inclusive of applicable taxes, auto-renewing Google Play mandate until self-cancelled).
  - Verified **anti-abuse FY PDF quota carry-over**:
    - Parsing 4 PDFs during **90-day Free Trial** leaves `usedInCurrentFy = 0` (`3/3` remaining when landing on Free Forever).
    - Parsing 4 PDFs while on **Pro Monthly** succeeds (unlimited) and increments `usedInCurrentFy` to `4`; after cancelling to **Free Forever** in the same FY, `isLimitReached == true` (`0/3` remaining) and manual PDF parsing returns `FREE_FY_PDF_LIMIT_REACHED`.
    - Crossing **April 1** into the next Indian Financial Year resets `usedInCurrentFy` back to `0` (`3/3` remaining on Free Forever).
  - Verified Day 75 / 83 / 87 / 90+ reminder copy references Pro Monthly (`₹20/month`, inclusive of taxes) and zero trial auto-charge.
- **Robolectric Compose UI & Persistence Tests (`Phase9PlayReadinessAndDossierSafTest`, `MonthlySubscriptionAndTermsV2Test`, `GmailSyncIntegrationTest`) — Passed (21/21)**:
  - Verified Sign-Up and Settings Terms viewers display all 7 clauses of `v2.0-MONTHLY-CASPARSER` (including `₹20/month` auto-renewing mandate, FY PDF quota carry-over, and `casparser` MIT / `pypdfium2` Apache-2.0 & BSD-3-Clause notice).
  - Verified existing users with `v1.0-D57-LOCAL` consent see the blocking **Updated Terms & Conditions (`v2.0`)** modal upon unlock, cannot dismiss without checking consent, and persist `v2.0-MONTHLY-CASPARSER` to both the encrypted vault and auth store upon acceptance.
  - Verified Licensing screen renders `gud_pro_monthly_20`, the Auto-Renewing Mandate & Self-Cancellation card with Google Play Subscriptions management deep-link, the FY PDF Quota Carry-Over disclosure, all 3 tiers, and the full Terms viewer trigger.
- **Build Check**: Verified clean Android build (`compile_applet`) and passing Gradle unit/Robolectric test suites (`gradle :app:testDebugUnitTest`).

---

## 6. Pre-Production Checklist (Pending Work)

> [!NOTE]
> Track and verify these pending items before public Google Play Store production rollout and post-launch scaling.

### Before Public Production Launch (Pending)
- [ ] **Crash-Safe Atomic Vault Writes**: Write encrypted vault updates to a temporary file (`growurdhan_vault.enc.tmp`), call `fsync`, and atomically replace `growurdhan_vault.enc` while maintaining a rolling encrypted fallback copy (`growurdhan_vault.enc.prev`) to prevent corruption on mid-write battery loss or app crash.
- [ ] **Passcode Brute-Force Lockout**: Persist progressive cooldown counters inside `growurdhan_auth.enc` (e.g., 5 failed attempts → 30s, 8 → 5m, 10 → 30m) and support stronger passcode rules (e.g., 6+ characters).
- [ ] **Passcode-Wrapped Data Encryption Key (DEK)**: Wrap a random 256-bit DEK with both the user's passcode (PBKDF2-SHA256 + Android Keystore StrongBox/TEE) and the offline recovery code so the vault cannot be decrypted without user authentication, holding the DEK in volatile memory only while unlocked and zeroizing it on lock.
- [ ] **Hardware-Backed `BiometricPrompt` (`CryptoObject`)**: Bind biometric unlock to a `BIOMETRIC_STRONG` Android Keystore key via `androidx.biometric:biometric` `CryptoObject` instead of a boolean gate.
- [ ] **Release-Default `FLAG_SECURE`**: Enable `WindowManager.LayoutParams.FLAG_SECURE` by default on fresh release installs (`!BuildConfig.DEBUG`) to block screenshots, screen recordings, and Recents thumbnails, while keeping debug/preview builds unobstructed.

### Post-Launch (v1.1 / v2 — Pending)
- [ ] **Migrate Encrypted Storage Adapter to Room + SQLCipher**: Swap the file-backed adapter behind `VaultBookPersistence` to Room + SQLCipher (`net.zetetic:sqlcipher-android`) with zero-loss automatic migration from `growurdhan_vault.enc` as Gmail Sync and multi-year household transaction volumes grow, while preserving exact `Long` scaled arithmetic, `CostBasisState.Unknown`, and D57 (`android:allowBackup="false"`).

---

## 7. Gmail Statement Sync — Architecture & Integration Plan

Design and implement on-device, multi-account **Gmail Statement Sync** that scans a family-wide pool of connected Gmail accounts over `gmail.readonly`, identifies and routes CDSL, NSDL, CAMS, KFintech, and NPS PDF attachments to the right household member using **CAS ID**, **PRAN**, and **PAN**, bounds first-time scanning to a configurable lookback window (default **Last 3 months**), imports only the **latest statement per `(member, issuer)`** incrementally month over month, auto-commits verified matches, and stages conflicts for review.

### 7.1 Overview & Core Concept

- **What It Does**: Connects 1 to N Gmail accounts to the household vault via native Android Google Identity OAuth (`gmail.readonly`), automatically triggers a throttled sync whenever the user unlocks the vault (plus an on-demand **Sync Now** button), discovers only legitimate Indian statement senders, filters down to the newest unseen statement per family member and issuer, decrypts and parses PDFs 100% on-device through the embedded Chaquopy `casparser` engine, and updates each member's portfolio without ever uploading PDFs or financial data to any server.
- **Multi-Mailbox & Shared-Mailbox Support**: Because Gmail accounts live in a **Family-Wide Inbox Pool** while each **Family Member** carries their own `gmailSyncEnabled` toggle, `casId`, `pran`, `pan`, and `dateOfBirth`, both household topologies work seamlessly out of the box:
  - *1 Member → Multiple Gmail Accounts*: e.g., Rahul's personal Gmail receives CDSL eCAS while his secondary Gmail receives Protean NPS & KFintech statements — both accounts are scanned and attributed to Rahul.
  - *1 Shared Gmail Account → Multiple Family Members*: e.g., a joint family Gmail receives eCAS and NPS PDFs for Self, Spouse, and Parents — each attachment is separated and routed strictly to the matching member.

### 7.2 End-to-End Architecture & Data Flow

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                 HOUSEHOLD GMAIL INBOX POOL (1..N Accounts)                   │
│  [Account 1: personal@gmail.com]  [Account 2: family.invest@gmail.com] ...   │
│  Auth: Android Google Identity AuthorizationClient (scope: gmail.readonly)   │
└────────────────────────────────────┬─────────────────────────────────────────┘
                                     ▼ HTTPS (TLS-only, on-device OkHttp/Ktor)
┌──────────────────────────────────────────────────────────────────────────────┐
│              STAGE 1: BOUNDED INBOX DISCOVERY & PRE-FILTER                   │
│  • Query allowlisted senders (CDSL, NSDL, CAMS, KFintech, Protean NPS)       │
│  • First sync: bounded by `after:YYYY/MM/DD` (Default: Last 3 months)        │
│  • Subsequent syncs: bounded by `after:<lastSyncedDate>` / `historyId`       │
│  • Deduplicate via persisted `seen(messageId, attachmentId)` + SHA-256       │
│  • Skip non-holdings noise (FATCA, invoices, capital gain, receipts)         │
└────────────────────────────────────┬─────────────────────────────────────────┘
                                     ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│       STAGE 2: FILENAME ATTRIBUTION & LATEST-ONLY RANKING (Pre-Download)     │
│  • Parse CDSL filename `MMMYYYY_<CAS_ID>_(TXN|HLD).pdf` -> extract CAS ID    │
│  • Parse NPS filename `<PRAN10or12>_MMMYYYY.pdf`       -> extract PRAN       │
│  • Group per `(member, issuer)` stream & compare against `casSyncAfter` /    │
│    `pranSyncAfter` / `CasImportMeta.periodTo`                                │
│  • Keep ONLY the single latest month (> last imported month); prefer `_TXN`  │
│    over `_HLD` in the same month; mark older historical months as seen/skip  │
└────────────────────────────────────┬─────────────────────────────────────────┘
                                     ▼ Download ONLY winning newest PDF bytes
┌──────────────────────────────────────────────────────────────────────────────┐
│         STAGE 3: ON-DEVICE DECRYPTION, PARSE & OWNER VERIFICATION            │
│  • Password candidate order: hinted member's uppercase PAN -> NPS 4-ltr+DDMM │
│    -> other Gmail-enabled household members' PAN & NPS passwords             │
│  • Chaquopy Python `casparser` + `pypdfium2` extracts canonical JSON locally │
│  • Verify owner strictly:                                                    │
│      NPS  -> Printed PRAN -> Filename PRAN -> Printed PAN                    │
│      CDSL -> Filename CAS ID (verified by Printed PAN when present)          │
│      NSDL / CAMS / KFintech -> Printed PAN inside PDF                        │
│  • Auto-capture `casId` (from CDSL filename) & `pran` onto member profile    │
└────────────────────────────────────┬─────────────────────────────────────────┘
                                     ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│      STAGE 4: AUTO-COMMIT vs. CONFLICT REVIEW & WATERMARK ADVANCEMENT        │
│  ┌───────────────────────────────────┐  ┌──────────────────────────────────┐ │
│  │ VERIFIED MATCH & CLEAN RECONCILE  │  │ CONFLICT / AMBIGUITY / BAD PWD   │ │
│  │ • Owner confirmed (PAN/PRAN/CAS)  │  │ • Unmatched PAN/PRAN/CAS ID      │ │
│  │ • Month > previously synced month │  │ • Reconciliation CONFLICT rows   │ │
│  │ • Zero CONFLICT rows              │  │ • Custom password needed (KFin)  │ │
│  │ ──► AUTO-COMMIT to Member Book    │  │ ──► STAGE into Review Queue      │ │
│  │ ──► Advance `casSyncAfter` /      │  │     (`CasConfirmPanel`) for      │ │
│  │     `pranSyncAfter` & History     │  │     1-tap owner switch / fix     │ │
│  └───────────────────────────────────┘  └──────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 7.3 Member Attribution Matrix (Exact Sender Email Addresses, Filename, & Profile Learning)

| Issuer | Exact Sender Email Address | Filename Pattern | Pre-Download Match | Post-Parse Verification & First-Time Profile Learning |
| :--- | :--- | :--- | :--- | :--- |
| **CAMS CAS** | `donotreply@camsonline.com` | PDF attachment (non-noise) | Downloads latest non-noise PDFs within lookback window | Unlocks with household uppercase PANs; strictly matches printed PAN; auto-saves missing `PAN` on first mapping/import |
| **KFintech CAS** | `samfS@kfintech.com` | PDF attachment (non-noise) | Downloads latest non-noise PDFs within lookback window | Tries household PANs; if custom KFintech password fails, routes to Review Queue with prompt for custom password; auto-saves missing `PAN` on first mapping/import |
| **NSDL eCAS** | `NSDL-CAS@nsdl.co.in` | PDF attachment (non-noise) | Downloads latest non-noise PDFs within lookback window | Unlocks with household uppercase PANs; strictly matches printed PAN; auto-saves missing `PAN` on first mapping/import |
| **CDSL eCAS** | `eCAS@cdslstatement.com` | `AUG2026_AA07970379_TXN.pdf` or `_HLD.pdf` | Matches `FamilyMember.casId` (or downloads for first-time learning if any enabled member has blank `casId`); ranks newest `YYYY-MM`, preferring `_TXN` over `_HLD` | Confirms printed PAN matches member (or queues for first-time member mapping); auto-saves missing `casId` & `PAN` onto member profile |
| **NPS / Protean CRA** | `nps-statements@mailer.proteantech.in` | `1120330238_Aug2026.pdf` (10- or 12-digit PRAN suffix) | Matches `FamilyMember.pran` (or downloads for first-time learning if any enabled member has blank `pran`); ranks newest `YYYY-MM` | Confirms printed 12-digit PRAN (or PAN fallback); auto-saves missing `pran` & `PAN` onto member profile |

> [!NOTE]
> **First-Time Auto-Learning (`CAS ID`, `PAN`, `PRAN`)**: On first Gmail Sync or first-time manual mapping in the Review Queue, if `CAS ID`, `PAN`, or `PRAN` is not yet stored on the member's profile, GrowUrDhan automatically saves those verified unique identifiers onto the member's profile so every subsequent monthly sync identifies and routes their statements automatically.

### 7.4 Incremental Latest-Only Policy & Lookback Window Rules

1. **First-Time Lookback Limit (Default: Last 3 Months)**:
   - On a newly connected Gmail account, the Gmail search query enforces `after:YYYY/MM/DD` computed from `today - lookbackMonths` (default `3` months, selectable in **Settings → Gmail Sync**: `3 months`, `6 months`, `12 months`, or `Current FY from April 1`).
   - Hard per-sync safety caps (max **4 search pages** and max **12 PDF downloads** per sync run) keep unlock-time syncing fast, battery-friendly, and quota-safe.
2. **Latest-Only & Month-Over-Month Progression**:
   - Every `(memberId, issuer)` stream tracks its latest imported statement month (`casSyncAfter` / `pranSyncAfter` and `CasImportMeta.periodTo`).
   - Within a discovered batch, older months for the same `(memberId, issuer)` are marked seen and skipped before downloading — **only the single latest month** is downloaded and imported.
   - If Month `M` is already imported, re-running sync ignores Month `M` and older; when Month `M+1` arrives next month, only Month `M+1` is imported and advances the watermark to `M+1`.
   - If a CDSL or NPS statement is waiting because no member has recorded a `CAS ID` or `PRAN` yet, or whenever conflicts are queued for review, the account's sync cursor is **held** (not advanced past it).
   - **Dismissed Statement Re-Sync Eligibility**: Dismissing a statement during Review & Commit or from the Gmail Conflict Queue never permanently hides it in the seen-attachment ledger; tapping manual **Sync Now** scans the full configured lookback window (while still skipping already-committed statements via watermarks and `COMMITTED` / `AUTO_COMMITTED` entries) so dismissed statements can always be re-fetched and resolved cleanly.

### 7.5 User Experience & Interactive Flows

1. **Family & Ownership Profile Updates**:
   - Add **CAS ID (eCAS)** field (auto-uppercased, e.g., `AA07970379`) and **Enable Gmail Sync** switch directly inside each member's Add/Edit profile sheet, alongside existing PAN, DOB, and PRAN.
   - Show compact badges on each Family Member card indicating `CAS ID`, `PRAN`, and `Gmail Sync: On/Off` (respecting Hide Mode).
2. **Settings → Gmail Sync & Statements Sync Card**:
   - **Connected Gmail Accounts Pool**: Lists all linked Gmail addresses with status badge (`Connected`, `Syncing`, `Needs Re-auth`), last synced timestamp, per-account **Disconnect**, and **Add Another Gmail Account** button (launching Android's account picker so a household can link multiple Gmail accounts effortlessly).
   - **First-Sync Lookback Selector**: `3 months (Default)`, `6 months`, `12 months`, `Current FY`.
   - **Auto-Sync on Vault Unlock**: Enabled by default whenever >= 1 Gmail account is connected and >= 1 family member has Gmail Sync toggled ON (throttled per unlock session with a non-blocking progress banner on Home/Statements and a manual **Sync Now** button).
   - **Auto-Commit vs. Conflict Queue & Review & Commit Profile Selector**:
     - Clean verified imports auto-commit silently, display a concise summary banner, and appear immediately in both **Statements & Reconciliation** and **Documents Index** with status **`Committed`**.
     - Conflicting or unverified statements (unknown PAN/PRAN, custom password needed, or reconciliation `CONFLICT` rows) appear in a **Needs Review** queue on **Statements** opening `CasConfirmPanel`.
     - **Always-Visible Family Member Selector in Review & Commit**: `CasConfirmPanel` renders an **Assign Statement to Family Member** selector chip row for every household member (never locked to the primary profile), displays a live preview of which `CAS ID`, `PAN`, or `PRAN` identifiers will be saved to the selected member's profile on commit, and automatically updates that member's profile upon commit.
     - **Explicit `Committed` & `Dismissed` History Tracking**: Both **Statements & Reconciliation** and **Documents Index** record every Gmail and manual statement outcome with an explicit **`Committed`** or **`Dismissed`** status chip/column (`ReconciliationBucket.HISTORY` → `"Committed"`, `ReconciliationBucket.DISMISSED` → `"Dismissed"`), persisted in the encrypted vault.
3. **Settings → Services Monitor Integration**:
   - Upgrades the **Gmail Statement Sync Adapter** row in **Settings → Services** to report live status (`Running` when connected, `Stopped` when no accounts linked, `Error` if OAuth re-auth or network error occurs) alongside connected account count and last sync timestamp.

### 7.6 Security, Privacy & Google Play Compliance

- **Least-Privilege Permissions & Read-Only Scope**: Uses only `android.permission.INTERNET` (install-time normal permission; zero dangerous runtime permissions) and OAuth scope `https://www.googleapis.com/auth/gmail.readonly`. GrowUrDhan never requests send, modify, or delete permissions on Gmail.
- **Android OAuth Client & Volatile Token Handling**: Uses Google Play Services Identity (`AuthorizationClient`) bound to `in.growurdhan.app` + signing SHA-1 (no hardcoded client secrets; optional OAuth config read cleanly via `BuildConfig` / Play Services). Access tokens are requested on demand and held strictly in memory—never persisted in plaintext or logged.
- **Encrypted Local State & Zero Cross-Owner Leakage**: All connected email metadata, sync cursors, seen attachment digests, `casId`, `pran`, `pan`, and `dateOfBirth` stay encrypted inside `growurdhan_vault.enc` (`allowBackup="false"`). A PDF is never auto-committed to a member unless its extracted `PAN`, `PRAN`, or `CAS ID` strictly matches a Gmail-enabled member.
- **Entitlement & Offline Honesty**: Respects the existing 4-tier licensing gate (unlocked during 3-Month Free Trial, Pro Annual Pass, and Founder's Pass; clearly paused with data intact on Free Forever). When offline or when Google Play Services OAuth is not yet authorized on the device, sync fails gracefully with an actionable status message and zero fake/simulated emails.

### 7.7 Verification Plan for Gmail Integration

- **Pure Kotlin Unit Tests**:
  - Filename classifier (`AUG2026_AA07970379_TXN.pdf`, `_HLD.pdf`, `1120330238_Aug2026.pdf`), sender allowlist & noise filter (FATCA/receipt/capital-gain skip), and `_TXN` over `_HLD` same-month ranking.
  - Multi-member / multi-account routing: 1 member across 2 Gmail accounts (CDSL + NPS), 2 members inside 1 shared Gmail inbox, and strict refusal to misassign an unknown PAN/CAS ID even when only 1 member is enabled.
  - First-time 3-month lookback query generation (`after:YYYY/MM/DD`), latest-only selection from multi-year inbox fixtures, and month-over-month incremental skipping when previous month is already imported.
  - Auto-commit decision engine (verified clean match → auto-commit + advance `casSyncAfter`/`pranSyncAfter` + learn `casId`; conflict/mismatch/bad-password → stage into Review Queue without advancing watermark).
- **Encrypted Persistence & Robolectric UI Tests**:
  - Cold-restart round-trip of `FamilyMember.casId`, `gmailSyncEnabled`, `casSyncAfter`, `pranSyncAfter`, `GmailConnectedAccount`, and `GmailSeenAttachment` in `growurdhan_vault.enc`.
  - Dismissed Gmail statement re-sync verification (both Review & Commit discard and Conflict Queue dismiss log `Dismissed` status and remain re-fetchable on manual Sync Now without advancing the account cursor prematurely).
  - Compose UI tests for Family Member `CAS ID` + `Gmail Sync` toggle, Settings Gmail Inbox Pool + Lookback selector, Review & Commit family member profile selection & automatic `CAS ID` / `PAN` / `PRAN` profile updates, explicit `Committed` and `Dismissed` status visibility in both Statements & Reconciliation and Documents Index, and Services Monitor live Gmail adapter state.
- **Build Verification**: Confirm clean compilation via `compile_applet` and passing JVM + Robolectric test suite (`gradle :app:testDebugUnitTest`).
- **Status**: **Implemented & Verified** — Android build succeeds cleanly and Gmail Sync integration tests pass (including exact 5 sender email addresses, multi-account 1-member sync, shared-inbox multi-member latest-only & next-month incremental sync, conflict review queue, dismissed-statement re-sync, always-visible Review & Commit member selector, first-time `CAS ID` / `PAN` / `PRAN` auto-learning, `Committed` & `Dismissed` Documents/Statements history tracking, encrypted `schemaVersion = 12` cold-restart persistence, volatile token wipe on lock, and full UI flows).

---

## 8. Cross-Source Statement Deduplication & Latest-Only Reconciliation Engine

Prevent duplicate holdings and cumulative portfolio inflation when a household imports statements from overlapping Indian custodians (**CAMS**, **KFintech**, **NSDL**, **CDSL**, and **Protean NPS**) — whether imported manually in any order or fetched asynchronously via multi-provider **Gmail Sync** (including back-dated files from a second source).

### 8.1 Root Causes Addressed

1. **Back-Dated Statement Double-Counting (`OPENING_BALANCE` Append Bug)**:
   - Previously, `CasReconciliationEngine` checked only `holdingEvents.filter { it.eventDate <= statementDate }`. If a user already imported **CDSL `2026-09-30`** (`100` units) and later imported an older **CAMS `2026-08-31`** statement for the same folio, `asOfEvents` was empty, causing the engine to emit a **second `OPENING_BALANCE` (+100 units)** on `2026-08-31` — doubling the FIFO unit balance to `200` units (2× portfolio value).
   - Likewise, same-issuer `CLOSED` detection did not guard against `statementDate < previousMeta.periodTo`, risking false closures when staging an older file.
2. **Missing Custody Scope Disambiguation (SOA Folio vs. Demat DP/Client)**:
   - Indian depository statements (**CDSL eCAS** and **NSDL CAS**) include *both* Demat holdings (`dpId`/`clientId`) **and** SOA Mutual Fund folios serviced by **CAMS** and **KFintech**.
   - Previously, `findMatchingHolding` matched on `ISIN` alone (ignoring folio/demat boundaries) and `buildCasHoldingDetails` labeled every CDSL/NSDL mutual fund as `"Demat"` even when it was an SOA folio (`kind == "mf"` with a folio number and no `dpId`/`clientId`).
3. **Cross-Source Gmail Sync Ordering & Watermark Starvation**:
   - Previously, `GmailSyncOrchestrator` derived `knownAsOfMonth` from the single shared `member.casSyncAfter` field across all non-NPS issuers. Importing CDSL `2026-09` could block a legitimately distinct NSDL `2026-09` demat statement or a CAMS `2026-09` statement carrying missing MF cost basis, while back-dated cross-source files that slipped through lacked holding-level staleness guards.

### 8.2 Canonical Custody-Aware Position Identity

Every parsed statement line and every existing `Holding` resolves to a deterministic **Custody Identity Key** within the member's book (`ownerId`):

| Holding Scope | Detection Rule | Canonical Custody Key | Cross-Source Behavior |
| :--- | :--- | :--- | :--- |
| **SOA Mutual Fund Folio** | `kind == "mf"` (no `dpId`/`clientId`) across **CAMS**, **KFintech**, **CDSL eCAS**, or **NSDL CAS** | `FOLIO:<normalizedFolioPrefix>` (strips `/checkDigit`, spaces, hyphens, and leading zeros so `01234567 / 89` in CAMS equals `1234567/89` in CDSL) | Same `(ISIN, FOLIO)` across CAMS/KFintech/CDSL/NSDL **deduplicates into 1 Holding**. Different folios of the same ISIN stay **2 separate Holdings**. |
| **Demat Holding** (Equity, Demat MF, ETF, SGB, REIT, InvIT, AIF) | `kind == "demat_mf"` or `dpId`/`clientId`/`boId` present or non-MF depository asset | `DEMAT:<normalizedDpClientOrBoId>` (fallback `DEMAT:<depository>`) | Same `(ISIN, DEMAT)` across updates **deduplicates into 1 Holding**. Same MF ISIN held in both CAMS SOA and CDSL Demat stays **2 separate Holdings**. |
| **NPS Account** | `kind == "nps"` or `fileType == "NPS"` | `NPS:<normalizedPranOrScheme>` | Scoped strictly to Protean NPS; never collides with CAS MF/Equity rows. |

- **Accurate `mfHeldAs` Tagging**: Fix `buildCasHoldingDetails` so `mfHeldAs = "Demat"` ONLY when `item.kind == "demat_mf"` or `dpId`/`clientId` is present; SOA MF folios inside CDSL/NSDL eCAS are accurately tagged `mfHeldAs = "SOA folio"` with `depository = null` (so they align cleanly with CAMS/KFintech SOA records).
- **Backward-Compatible Matching**: When an existing manual holding has matching `ISIN` and no distinguishing folio/demat key (e.g., blank or `"MF_FOLIO"`/`"CAS"`), match it only if it is the sole compatible holding in that custody mode; otherwise create a distinct holding per folio/demat account.

### 8.3 Per-Holding Latest Freshness & Cross-Source Reconciliation Rules

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│     INCOMING STATEMENT ROW (source = CAMS / KFintech / NSDL / CDSL / NPS)    │
│                     Resolved by (ownerId, ISIN, CustodyKey)                  │
└───────────────────────────────────────┬──────────────────────────────────────┘
                                        ▼
               Does a matching Holding already exist in owner's book?
                       ┌────────────────┴────────────────┐
                       ▼ NO                              ▼ YES
         ┌───────────────────────────┐     Compare statementDate vs. holding's
         │ NEW_POSITION              │     latestRecordedDate (max of persisted
         │ (Creates 1 new holding    │     latestStatementDate & CAS ledger)
         │  with Opening Balance)    │                   │
         └───────────────────────────┘   ┌───────────────┼───────────────┐
                                         ▼               ▼               ▼
                           statementDate < latest   statementDate ==   statementDate > latest
                           (BACK-DATED FILE)        latest (SAME DAY)  (NEWER STATEMENT)
                                   │                       │                     │
                     ┌─────────────┴─────────────┐         │                     │
                     ▼                           ▼         ▼                     ▼
             Existing cost is             Otherwise:   Units match?         Units match?
             UNKNOWN + units              STALE_       • YES + missing      • YES -> MATCH
             match + incoming             SKIPPED        cost -> COST_        (refresh NAV,
             has cost + no SELL           (unchecked,    UPDATE (fill         keep Known cost,
             -> COST_UPDATE               never          cost basis)          advance latestDate)
             (backfill cost only;         commits)     • YES + cost ok      • YES + cost changed
              preserve newer                             -> MATCH             -> COST_UPDATE
              date & NAV)                              • NO (cross-src      • NO -> ADJUST_UP /
                                                         diff on exact        ADJUST_DOWN / CLOSED
                                                         same date)           (delta-only event;
                                                         -> CONFLICT           advance latestDate)
```

- **Per-Holding Freshness Metadata (`schemaVersion = 13`)**:
  - Add nullable `latestStatementDate: String? = null` (ISO `YYYY-MM-DD`) and `latestStatementSource: String? = null` (`"CDSL"`, `"NSDL"`, `"CAMS"`, `"KFINTECH"`, `"NPS"`) to `HoldingDetails` and `VaultBookPersistence` (zero-migration backward compatibility for existing `schemaVersion = 12` vaults by also deriving the latest date from existing `REGISTRAR_CAS_*` ledger events).
- **New Reconciliation Action — `CasReconcileAction.STALE_SKIPPED("Skipped (Older)")`**:
  - Unchecked by default (`selectedForCommit = false`), non-toggleable (`canToggleSelection = false`), never writes any `LedgerEvent` and never modifies quantity or valuation.
  - Explanation states exact provenance: e.g. *"Skipped — already up to date as of 2026-09-30 (from CDSL). This 2026-08-31 CAMS entry is older and will not overwrite or duplicate your ledger."*
- **Safe Cost-Basis Enrichment Without Date/Unit Regression**:
  - When CDSL/NSDL (`2026-09-30`) was imported with `CostBasisState.Unknown`, and CAMS/KFintech (`2026-09-30`, or an older same-unit snapshot with zero intervening `SELL` events) prints the exact acquisition cost, classify as **`COST_UPDATE`** — rebasing the cost basis via append-only `CORRECTION` + `OPENING_BALANCE` while **retaining the holding's newest `latestStatementDate` and `priceObservation`** so NAV/freshness never regresses!
  - Conversely, when CAMS (`2026-09-28`) already recorded a `Known` cost basis and a newer CDSL (`2026-09-30`) arrives with `cost = null` and matching units, classify as **`MATCH`** — advancing `latestStatementDate` and NAV to `2026-09-30` while preserving CAMS's `Known` cost basis intact.
- **Same-Issuer `CLOSED` & Watermark Regression Guards**:
  - Same-issuer exit detection (`Step 3`) runs ONLY when `previousMeta.periodTo == null || statementDate > previousMeta.periodTo` — preventing a back-dated statement from closing holdings added in a newer month.
  - On commit, `casImportMetas[metaKey]` never regresses `periodTo` backward if an older partial file was committed for missing holdings.

### 8.4 Multi-Provider Gmail Sync Orchestration (All Sources, Auto-Deduplicated)

1. **Per-Issuer Discovery Watermark (No Cross-Issuer Starvation)**:
   - `GmailSyncOrchestrator.knownAsOfMonth(ownerId, issuerCode)` checks `casImportMetas` for that exact `(ownerId, issuerCode)` plus the current run's `runtimeKnownMonthByStream["$ownerId::$issuerCode"]` (using `member.casSyncAfter` only as a bootstrap fallback when no `casImportMetas` exist yet).
   - Result: Importing **CDSL `2026-09`** advances CDSL's watermark to `2026-09` without blocking **NSDL `2026-09`** (separate depository) or **CAMS/KFintech `2026-09`** (which can enrich missing cost basis or unique folios).
2. **Newest-First Cross-Source Processing Order**:
   - `GmailStatementMatcher.selectLatestFilesForMembers` sorts all candidates across `CDSL`, `NSDL`, `CAMS`, `KFINTECH`, and `NPS` **newest-first** (by statement month / email timestamp), preferring depository supersets (`CDSL`/`NSDL`) on exact same-month ties followed by RTA (`CAMS`/`KFINTECH`) so missing MF cost basis is automatically enriched right after the depository snapshot.
3. **Graceful Back-Dated Cross-Source Handling in Gmail Sync**:
   - If Gmail Sync fetches a back-dated file from another provider (e.g., CAMS `2026-08` after CDSL `2026-09` is already in the portfolio):
     - If **all** staged rows are `STALE_SKIPPED` (zero new/newer positions and zero `COST_UPDATE` rows), `GmailSyncOrchestrator` cleanly records the attachment as `SKIPPED_STALE_CROSS_SOURCE` without queuing a spurious conflict or writing to the ledger.
     - If the file contains **a mix** of `STALE_SKIPPED` rows and genuinely new/newer holdings (or `COST_UPDATE` rows) with zero conflicts, `GmailSyncOrchestrator` auto-commits **only** the selected newer/new/cost-enriched rows while leaving every `STALE_SKIPPED` holding completely untouched.
     - If a same-date cross-source unit discrepancy produces a `CONFLICT` row, it routes cleanly to the **Gmail Conflict Review Queue**.

### 8.5 Review & Commit UI (`CasConfirmPanel`) Enhancements

- Render **`CasReconcileAction.STALE_SKIPPED`** rows with a distinct **`Skipped (Older)`** neutral status chip, disabled unchecked checkbox, and clear per-row provenance explanation.
- Display a prominent **Cross-Source Deduplication & Freshness Banner** whenever a staged statement has `STALE_SKIPPED` rows or cross-source `COST_UPDATE` enrichment rows (e.g., *"3 older holding(s) skipped to prevent duplication · 2 newer/new holding(s) ready to commit"*).
- When 100% of rows in a manually uploaded back-dated statement are `STALE_SKIPPED`, show an informative **Already Up to Date** notice explaining that newer statement records already exist and keep **Confirm & Commit Snapshot** disabled so duplicate commits are impossible.

### 8.6 Verification Plan for Cross-Source Deduplication

- **Pure Kotlin Domain & Repository Tests (`CrossSourceDeduplicationTest`)**:
  1. **CAMS + CDSL Same-Month Overlap (Exact Same Folio)**: Import CAMS (`2026-09-30`, Folio `123456/78`, 100 u, cost `₹4,200`) then CDSL (`2026-09-30`, SOA Folio `123456/78`, 100 u, cost `null`) -> portfolio holds **1 holding, 100 units (NOT 200)**, retains `Known` cost `₹4,200`, and adds zero duplicate ledger events.
  2. **Reverse Order Cost-Basis Enrichment (CDSL then CAMS)**: Import CDSL (`2026-09-30`, cost `Unknown`) then CAMS (`2026-09-30`, cost `₹4,200`) -> `COST_UPDATE` fills `₹4,200`, units stay exact `100`, portfolio value never doubles.
  3. **Back-Dated Cross-Source Protection (CDSL `2026-09-30` then CAMS `2026-08-31`)**: Overlapping holding classified `STALE_SKIPPED`, units stay at `2026-09-30` value (zero `OPENING_BALANCE` append!), while a **missing** folio present only in CAMS `2026-08-31` still imports cleanly as `NEW_POSITION`.
  4. **Four-Source Portfolio (`CAMS` + `KFintech` + `NSDL` + `CDSL`)**: Overlapping SOA MF folios across CAMS/KFintech/CDSL/NSDL deduplicate cleanly; distinct NSDL Demat equities + CDSL Demat equities + CAMS SOA MF + KFintech SOA MF all coexist with exact non-duplicated household net worth.
  5. **Same ISIN in Two Distinct Folios & Demat + SOA**: Member holds `INF209K01YM2` in Folio `123456/78` (SOA), Folio `998877/11` (SOA), and CDSL Demat `DP 12081600 / Client 11223344` -> tracked as **3 separate holdings**; re-importing CAMS + CDSL updates only the matching folio/demat without merging or duplicating.
  6. **Same-Date Cross-Source Unit Discrepancy**: CDSL (`2026-09-30`, 100 u) then CAMS (`2026-09-30`, 110 u) -> flags `CONFLICT` instead of silently mutating units.
  7. **Multi-Provider Gmail Sync Out-of-Order & Back-Dated Protection**: Shared inbox containing CDSL `2026-09`, back-dated CAMS `2026-08`, KFintech `2026-09`, and NSDL `2026-09` -> syncs all sources newest-first, auto-skips 100% stale back-dated CAMS `2026-08`, imports unique KFintech/NSDL holdings without starvation, enriches missing cost basis, and yields exact single-counted portfolio value.
  8. **Encrypted Vault Cold-Restart (`schemaVersion = 13`)**: Persists and restores `latestStatementDate` & `latestStatementSource` cleanly across restart, and remains backward-compatible with legacy `schemaVersion = 12` books.
- **Build & Regression Verification**: Run `compile_applet` and full `gradle :app:testDebugUnitTest` (ensuring all existing Gmail Sync, Subscription/Terms v2.0, and Phase 1–9 tests stay green).
- **Status**: **Implemented & Verified** — Android build succeeds cleanly (`compile_applet`) and all 25/25 unit & Robolectric tests pass across `CrossSourceDeduplicationTest`, `FinancialEnginesBatch5Test`, `GmailSyncIntegrationTest`, and `MonthlySubscriptionAndTermsV2Test` (verifying CAMS/KFintech/NSDL/CDSL 4-source deduplication, SOA folio vs. Demat DP/Client separation, back-dated `STALE_SKIPPED` protection, safe cost-basis enrichment without doubling units or regressing dates, same-date cross-source conflict flagging, multi-provider Gmail Sync newest-first ordering & per-issuer watermarks, encrypted `schemaVersion = 13` cold-restart round-trip, and `CasConfirmPanel` UI banners).

---

## 9. Enterprise Golden-Record Prevention, Canonical Scheme Naming & 3-Layer Idempotent CAMS Gmail Sync

Eliminate cross-source CDSL/CAMS mutual fund duplication **at import time** before records enter the ledger, strip noisy RTA scheme prefixes (`MCAG -`, `101G -`) and custody suffixes (`(Non Demat)`) into structured holding metadata, and enforce 3-layer idempotent Gmail Sync so already-committed CAMS statements are never re-queued into Review & Commit.

> [!IMPORTANT]
> **Confirmed Product Decisions (Phase 1 Alignment)**
> - **Prevent Before Import (No Retroactive Vault Rewriting)**: Do not auto-merge or mutate already-saved duplicate holdings in the vault. Focus strictly on preventing duplicates **during import staging and commit**, including accurately matching incoming CAMS/CDSL SOA rows against previously saved CDSL SOA holdings that lacked DP/Client IDs.
> - **Canonical Scheme Titles with Preserved RTA Codes**: Strip leading 2–8 character registrar/AMC scheme codes (e.g., `MCAG -`, `101G -`) and trailing custody tags (`(Non Demat)`, `(Demat)`, `(Physical)`) from holding titles, and save the extracted RTA scheme code in structured **Holding Details** metadata.
> - **Latest-Date Cost Survivorship + Quantity-Verified Fallback**: Always keep acquisition cost from the **latest statement date** when both sources report non-zero cost. When one source omits cost (or reports zero) and `(ISIN, Normalized Folio, Quantity)` match, preserve or backfill the known purchase cost without doubling units or regressing the latest valuation date.
> - **Silent Auto-Skip for Committed / Older CAMS Gmail Statements**: Auto-skip byte-identical (SHA-256) or already-superseded CAMS PDFs silently during Gmail Sync instead of routing them back into the Review & Commit queue.

### 9.1 Why the Real-World Issues Occurred & Enterprise Optimization Strategy

1. **Preventing CDSL SOA vs. CAMS SOA Duplication Before Import**:
   - *Root Cause*: CDSL eCAS includes a `"Mutual Fund Folios"` section for non-demat SOA folios (such as `499278997181/0`) where `DP ID` and `Client ID` are empty. Earlier CDSL imports saved those holdings with `mfHeldAs = "Demat"`, causing custody-scope matching to classify the existing record as `DEMAT` while incoming CAMS classified the exact same folio as `SOA_FOLIO` — bypassing deduplication and creating a second holding.
   - *Enterprise Fix*:
     - **Authoritative Account-Type Custody Classification**: Classify incoming rows from explicit depository section headers (`"Mutual Fund Folios"` => `SOA_FOLIO`; `"CDSL Demat Account"` / `"NSDL Demat Account"` or non-empty `DP ID` / `Client ID` / `BO ID` => `DEMAT`).
     - **Import-Time Legacy Custody Recognition**: During incoming reconciliation, if an existing Mutual Fund holding has **empty `DP ID`, `Client ID`, and `BO ID`** alongside a valid SOA folio number (like `499278997181/0`), treat its effective custody identity as `SOA_FOLIO` even if a legacy import stamped `mfHeldAs = "Demat"`. When matched on a newer or enriched import, also correct its custody tag to `"SOA folio"` cleanly going forward without touching unrelated saved records.
     - **In-Batch Cross-Row Deduplication Guard**: If a single PDF or merged staging payload emits two rows with the same `(ISIN, CustodyKey)` (e.g., whitespace variants like `499278997181 / 0` vs `499278997181/0`), coalesce them before staging so a single import can never double-add one folio.

2. **Securities Master Canonical Scheme Naming & `RTA Scheme Code` Metadata**:
   - *Root Cause*: CDSL prepends registrar scheme codes (`MCAG - NIPPON INDIA MNC FUND - DIRECT GROWTH`, `101G - WhiteOak Capital - Mid Cap Fund - Regular Plan Growth`), while CAMS appends `(Non Demat)`.
   - *Enterprise Fix*:
     - Run a deterministic **Scheme Name Canonicalizer** in both the on-device CAS parser and the reconciliation engine:
       - Extract leading registrar code patterns (`^[A-Z0-9]{2,8}\s*[-–—:]\s+`, e.g., `MCAG`, `101G`, `B92G` — while guarding against stripping legitimate scheme words like `ICICI -`, `SBI -`, `HDFC -`, `AXIS -`, `UTI -`, `KOTAK -`, `DSP -`, `PGIM -`, `HSBC -`, `PPFAS -`, `TATA -`, `LIC -`, `JM -`, `ITI -`, `NJ -`, `360 -` where the token is an AMC brand name rather than a scheme code!).
       - Strip trailing custody mode tags (`(Non Demat)`, `(Non-Demat)`, `(Demat)`, `(Physical)`), collapsing extra whitespace and redundant hyphens.
       - Store the extracted scheme code in `HoldingDetails.rtaSchemeCode` (persisted cleanly in the encrypted vault) and surface it in the **Holding Details** sheet under a read-only **RTA Scheme Code** row when present.
     - Update scheme-name preference rules during reconciliation so clean canonical names always beat raw prefixed or `(Non Demat)` strings on every update.

3. **Golden-Record Field-Level Survivorship (Latest Date Wins + Quantity-Verified Cost Preservation)**:

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│          INCOMING ROW MATCHED ON (Owner, ISIN, CustodyMode, Folio)           │
│          Example: CAMS (2026-09-16)  <--->  CDSL (2026-10-31)                │
└───────────────────────────────────────┬──────────────────────────────────────┘
                                        ▼
               Compare incoming statementDate vs. existing latestDate
          ┌─────────────────────────────┼─────────────────────────────┐
          ▼                             ▼                             ▼
   incoming < existing           incoming == existing          incoming > existing
    (OLDER STATEMENT)                (SAME DATE)               (NEWER STATEMENT)
          │                             │                             │
          ▼                             ▼                             ▼
  Does (ISIN, Folio, Qty)       Units match (1e-6)?           • Update Units, NAV,
  match AND existing cost       • NO  -> CONFLICT               Market Value, and
  is Unknown/Zero AND           • YES -> Keep known             latestStatementDate
  incoming has Cost > 0?                 non-zero Cost        • Cost Survivorship:
    • YES -> COST_UPDATE                 (or fill if            - Incoming Cost > 0
      (Backfill Cost ONLY;                existing is             -> Latest Date Cost
       keep newer Date,                   Unknown)                WINS (rebase if
       Units & NAV intact)                                        different)
    • NO  -> STALE_SKIPPED                                      - Incoming Cost is
      (Never duplicate or                                         null/0 AND (ISIN,
       overwrite newer data)                                      Folio, Qty) match
                                                                  -> PRESERVE existing
                                                                     Known Cost!
```

   - *Why*: Ensures portfolio value reflects only the latest market date (`2026-10-31`), prevents any older statement from overriding a newer statement's non-zero cost, and still guarantees that if a newer CDSL/NSDL snapshot omits purchase cost while an earlier CAMS/KFintech snapshot printed it for the exact same `(ISIN, Folio, Quantity)`, the known cost basis is preserved/enriched seamlessly.

### 9.2 3-Layer Idempotent Gmail Sync Pipeline (Eliminating CAMS Re-Fetch Loops)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│  GMAIL SYNC CANDIDATE ATTACHMENT (CAMS / KFintech / NSDL / CDSL / NPS)       │
└───────────────────────────────────────┬──────────────────────────────────────┘
                                        ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │ LAYER 1 — Transport Seen Ledger                                          │
  │ Has (messageId, attachmentId) been COMMITTED / AUTO_COMMITTED / SKIPPED? │
  │   • YES -> Skip before downloading bytes                                 │
  │   • DISMISSED or Unseen -> Download & Decrypt with Family Passwords      │
  └─────────────────────────────────────┬────────────────────────────────────┘
                                        ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │ LAYER 2 — Content SHA-256 Hash Gate (RUNS BEFORE OWNER ATTRIBUTION!)     │
  │ Does decrypted PDF's SHA-256 already exist in committed HISTORY ledger?  │
  │   • YES -> Auto-skip silently (SKIPPED_ALREADY_COMMITTED_HASH)           │
  │            Prevents manually-committed CAMS PDFs from re-queuing!        │
  └─────────────────────────────────────┬────────────────────────────────────┘
                                        ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │ LAYER 3 — Multi-Signal Attribution + Watermark + Cross-Source Coverage   │
  │ • Extract CAMS/KFintech investorPan from folio.PAN (+ password fallback) │
  │ • Extract investorEmail from CAS header as secondary member matcher      │
  │ • Enforce per-issuer watermark (incomingMonth <= committedIssuerMonth)   │
  │ • Stage & check isAllStaleSkipped -> Skip silently if all holdings are   │
  │   already covered by newer statements (even when owner matched via       │
  │   single-member / email fallback)                                        │
  │ • Auto-commit new/newer/cost-enriched rows; queue ONLY genuine conflicts │
  └──────────────────────────────────────────────────────────────────────────┘
```

- **Fixing CAMS Identity Extraction**:
  - Update the CAMS/KFintech CAS parser adapter to extract `investorPan` from parsed folio `PAN` fields (scanning folios for the first valid 10-character PAN when the top-level investor header omits it) and expose `investorEmail` from the statement's `investor_info` block.
  - Because CAMS PDFs are often encrypted with a user-chosen password (rather than PAN), reading `folio.PAN` ensures Gmail Sync reliably identifies the right family member without falling back to manual Review & Commit on every sync.
- **Pre-Owner SHA-256 & Cross-Source Skip Gate**:
  - Check `preflight.isDuplicate` (committed `HISTORY` SHA-256 match) **immediately after decryption and before owner matching**, silently recording `SKIPPED_ALREADY_COMMITTED_HASH` so a manually-committed CAMS PDF is never re-queued into Review & Commit.
  - When a Gmail conflict item is opened and committed from Review & Commit, verify that the conflict entry is cleanly evicted from the queue, the attachment is recorded as `COMMITTED` in the seen ledger, and the member's per-issuer watermark advances so subsequent syncs stay quiet.
- **Single-Member / Unique-Email CAMS Attribution**:
  - When PAN is absent from a CAMS PDF (rare summary PDFs) and only one eligible family member matches the statement's `investorEmail` (or the connected Gmail mailbox belongs uniquely to one enabled member), resolve that owner cleanly before deciding whether the statement is already up to date (`SKIPPED_ALREADY_IMPORTED` / `SKIPPED_STALE_CROSS_SOURCE`).

### 9.3 Key Product Trade-Offs

- **Import-Time Prevention vs. Automatic Vault Merging**:
  - *Chosen Approach*: Prevent duplicates strictly at import/reconciliation time without running a background migration that silently alters existing saved holdings.
  - *Why*: Matches your explicit preference to keep saved records untouched while guaranteeing clean, single-entry imports going forward (and still recognizing legacy CDSL SOA records during new imports so they don't duplicate again).
- **AMC Brand Protection in RTA Code Stripping**:
  - *Chosen Approach*: Strip 2–8 character alphanumeric registrar prefixes separated by ` - ` / `: ` (such as `MCAG - `, `101G - `, `B92G - `) using a strict code-shape heuristic + AMC-brand allowlist (`SBI`, `HDFC`, `ICICI`, `AXIS`, `UTI`, `DSP`, `HSBC`, `KOTAK`, `TATA`, `LIC`, `JM`, `ITI`, `NJ`, `PGIM`, `PPFAS`, `BOI`, `IDBI`, `IDFC`, `IIFL`).
  - *Why*: Eliminates CDSL registrar codes cleanly into `Holding Details` without accidentally amputating legitimate fund house names like `SBI - Magnum ...` or `UTI - Nifty 50 ...`.

### 9.4 Verification Checklist

1. **Real-Device Nippon India MNC Fund Scenario (CAMS `2026-09-16` + CDSL `2026-10-31`, Folio `499278997181/0`)**:
   - Importing CAMS (`NIPPON INDIA MNC FUND - DIRECT GROWTH PLAN (Non Demat)`, `499278997181 / 0`, `2026-09-16`, `₹20,03,537`, cost `₹20,00,000`) followed by CDSL (`MCAG - NIPPON INDIA MNC FUND - DIRECT GROWTH`, `499278997181/0`, `2026-10-31`, `₹18,87,376`, cost `₹20,00,000` or `null`) produces **exactly 1 holding** titled `NIPPON INDIA MNC FUND - DIRECT GROWTH`, latest valuation `₹18,87,376` (`2026-10-31`), preserved cost `₹20,00,000`, and `rtaSchemeCode = "MCAG"`.
   - Importing in reverse order (CDSL `2026-10-31` first — including a legacy CDSL SOA record stored with `mfHeldAs = "Demat"` and empty `dpId`/`clientId` — followed by CAMS `2026-09-16`) matches the same folio, keeps `2026-10-31` valuation and latest non-zero cost, backfills cost ONLY if CDSL omitted it and `(ISIN, Folio, Quantity)` match, and creates **zero duplicates**.
2. **RTA Scheme Prefix & Custody Tag Stripping**:
   - `MCAG - NIPPON INDIA MNC FUND - DIRECT GROWTH` -> Title `NIPPON INDIA MNC FUND - DIRECT GROWTH`, `rtaSchemeCode = "MCAG"`.
   - `101G - WhiteOak Capital - Mid Cap Fund - Regular Plan Growth` -> Title `WhiteOak Capital - Mid Cap Fund - Regular Plan Growth`, `rtaSchemeCode = "101G"`.
   - `NIPPON INDIA MNC FUND - DIRECT GROWTH PLAN (Non Demat)` -> Title `NIPPON INDIA MNC FUND - DIRECT GROWTH PLAN`.
   - Legitimate AMC prefixes (`SBI - Nifty Index Fund`, `HDFC - Mid-Cap Opportunities Fund`, `UTI - Nifty 50 Index Fund`) remain completely intact.
3. **Latest-Date Cost Survivorship**:
   - When both CAMS (`2026-09-16`, cost `₹19,50,000`) and CDSL (`2026-10-31`, cost `₹20,00,000`) report non-zero cost for the same `(ISIN, Folio, Quantity)`, `2026-10-31` (`₹20,00,000`) wins; importing the older CAMS statement afterward marks `STALE_SKIPPED` and never overwrites `₹20,00,000`.
4. **3-Layer Idempotent CAMS Gmail Sync**:
   - Manually committing a CAMS Online PDF (`donotreply@camsonline.com`) and then running Gmail Sync auto-skips the exact PDF via SHA-256 hash (`SKIPPED_ALREADY_COMMITTED_HASH`) with **0** items queued in Review & Commit.
   - Extracting PAN from CAMS `folio.PAN` auto-attributes new CAMS statements (even with custom non-PAN passwords) to the matching family member, respects per-issuer watermarks, and silently skips older statements.
5. **Encrypted Vault Round-Trip & Build Verification**:
   - Persist and reload `rtaSchemeCode` across encrypted vault cold-restart without breaking legacy vault files, verify `compile_applet`, and run the full unit & Robolectric test suite.
- **Status**: **Implemented & Verified** — Android build succeeds cleanly (`compile_applet`), Python CAS parser verification passes (`_canonicalize_scheme_name`, `_extract_valid_pan`, `_from_cams` folio PAN extraction), and all unit & Robolectric tests pass across `Section9EnterpriseDeduplicationTest`, `CrossSourceDeduplicationTest`, `GmailSyncIntegrationTest`, `FinancialEnginesBatch5Test`, and `MonthlySubscriptionAndTermsV2Test` (verifying real-device CAMS/CDSL Nippon India MNC Fund deduplication including legacy CDSL `Demat`-tagged SOA folios, `MCAG -` / `101G -` RTA code stripping into Holding Details while protecting AMC brands, latest-date cost survivorship with quantity-verified backfill, 3-layer idempotent CAMS Gmail Sync with pre-decrypt SHA-256 content-hash gating, and encrypted vault persistence of `rtaSchemeCode`).

---

## 10. Subcategory-Aware Holding Form Optimization & Field Matrix

Eliminate bloated category-level forms and silent default-value leakage across the 6 non-equity/MF holding categories (**Gold & SGB**, **Fixed Income**, **Real Estate**, **Specialised**, **Cash & Bank**, and **Liabilities**) by driving the **Add Holding Wizard**, **Edit Holding Metadata sheet**, **Holding Detail screen**, and **save-time serializer** from one shared, declarative **Subcategory Form Schema**.

### 10.1 Unified Declarative Form Schema Architecture

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                 SUBCATEGORY FORM SCHEMA (Single Source of Truth)             │
│  Keyed by (AssetCategory, Subcategory) -> resolves:                          │
│   1. Step 1 Identity Spec  : Name/Ref labels & placeholders, showISIN flag   │
│   2. Step 3 Specialist Spec: Exact set of visible fields + M3 chip options   │
│   3. Step 4 Valuation Mode : WEIGHT_GRAMS | UNITS_AND_PRICE |                │
│                              BALANCE_AND_COST | CASH_BALANCE_ONLY |          │
│                              LOAN_PRINCIPAL                                  │
│   4. Zero-Leakage Filter   : Only persists fields in visibleSpecialistFields │
└──────────────────────────────────────┬───────────────────────────────────────┘
        ┌──────────────────────────────┼──────────────────────────────┐
        ▼                              ▼                              ▼
┌───────────────────┐       ┌──────────────────────┐       ┌────────────────────┐
│ Add Holding Wizard│       │ Edit Metadata Sheet  │       │ Holding Detail &   │
│ • Clean Step 1/3/4│       │ • Exact same field   │       │ Domain Engines     │
│ • Quick-select    │       │   visibility & chips │       │ • Fixed Income rate│
│   M3 FilterChips  │       │ • Linked Property    │       │   drives accrual   │
│ • No Units=1 noise│       │   picker on Home Loan│       │ • EMI Due Day      │
│ • Zero leakage    │       │ • Scrubs stale keys  │       │   drives calendar  │
└───────────────────┘       └──────────────────────┘       └────────────────────┘
```

### 10.2 Step 4 Valuation Modes (Eliminating `Units = 1` Friction)

| Valuation Mode | Applied Subcategories | Fields Shown in Step 4 | Internal Ledger Mapping |
| :--- | :--- | :--- | :--- |
| **`WEIGHT_GRAMS`** | Sovereign Gold Bond, Physical gold (24K), Digital gold, Gold Other | **Weight (grams) \***, **Current Rate per gram (INR) \***, **Total Purchase Cost (INR)** + Cost Unknown toggle | `quantity = grams`, `unitPrice = rate/g`, live total preview |
| **`UNITS_AND_PRICE`** | Equity (all), Mutual Funds (all), **REIT**, **InvIT**, **Bond / GOI**, **RBI Floating Rate Bond**, **Unlisted equity**, **ESOP**, **Liquid / overnight** | **Units / Shares \***, **Current Price / NAV (INR) \***, **Total Acquisition Cost (INR)** + Cost Unknown toggle | `quantity = units`, `unitPrice = market price`, live total preview |
| **`BALANCE_AND_COST`** | **Bank FD**, **Post Office RD**, **PPF**, **EPF**, **NPS**, **SSY**, **SCSS**, **NSC**, **KVP**, **POMIS**, Fixed Income Other, **Residential**, **Commercial**, **Land**, Real Estate Other, **PMS**, **AIF**, Specialised Other | **Current Value / Balance (INR) \***, **Principal / Purchase Cost (INR)** (auto-defaults to Current Value if left blank for FD/RD/PPF, or Cost Unknown toggle for Property/NPS/PMS/AIF) | `quantity = 1` (hidden), `unitPrice = current value`, clean acquisition cost |
| **`CASH_BALANCE_ONLY`** | **Savings account**, **Current account**, Cash & Bank **Other** | **Current Account Balance (INR) \*** only | `quantity = 1` (hidden), `unitPrice = balance`, `costBasis = Known(balance)` |
| **`LOAN_PRINCIPAL`** | **Home loan**, **Car loan**, **Education loan**, **Personal loan**, Liability **Other** | **Outstanding Principal (INR) \***, **Original Sanctioned Principal (INR, optional)** | `quantity = 1` (hidden), `unitPrice = outstanding principal`, `costBasis = Known(original or outstanding)` — no confusing "Cost Unknown" toggle |

### 10.3 Complete Category × Subcategory Field Matrix (All 6 Target Categories)

#### A. Gold & SGB (`GOLD_SGB`)
| Subcategory | Step 1 `ISIN` | Relevant Specialist Fields (Shown & Saved) | Excluded Fields (Hidden & Never Saved) |
| :--- | :--- | :--- | :--- |
| **Sovereign Gold Bond** | **Shown** | `Hold Mode` chips (`Demat` / `RBI Certificate`), `SGB Issue Series`, `Coupon Rate (% p.a.)` (default `2.50`), `Early Exit Date` (5-yr window), `Maturity Date` (8-yr) | Purity, Hallmark/HUID, Storage Location, Custodian |
| **Physical gold (24K)** | Hidden | `Purity` chips (`24K / 999`, `22K / 916`, `18K / 750`), `Hallmark / HUID` (opt), `Storage Location` (e.g., Bank Locker / Home Safe, opt) | ISIN, Hold Mode, SGB Series, SGB Coupon Rate, Early Exit Date, Maturity Date |
| **Digital gold** | Hidden | `Vault / Custodian` chips (`SafeGold`, `MMTC-PAMP`, `Augmont`, `Other`) + custom input, `Purity` chips (`24K / 999`, `22K / 916`) | ISIN, Hold Mode, all SGB fields, Hallmark/HUID, Maturity Date |
| **Other** | Hidden | `Hold Mode` chips (`Physical` / `Demat` / `Digital`), `Purity` chips, `Storage / Vault` (opt) | ISIN, all SGB fields |

#### B. Fixed Income (`FIXED_INCOME`)
| Subcategory | Step 1 `ISIN` | Relevant Specialist Fields (Shown & Saved) | Excluded Fields (Hidden & Never Saved) |
| :--- | :--- | :--- | :--- |
| **Bank FD** | Hidden | `Interest Rate (% p.a.)`, `Compounding / Payout` chips (`Cumulative Quarterly`, `Monthly Payout`, `Quarterly Payout`, `At Maturity`), `Maturity Date`, `TDS Applicable` toggle, `Payout Day (1–31)` *(only when Monthly/Quarterly Payout selected)* | ISIN, Annual Contribution, NPS Tier/CRA/PFM |
| **Post Office RD** | Hidden | `Interest Rate (% p.a.)`, `Monthly Installment (INR)`, `Compounding` (`Quarterly` default chip), `Maturity Date` | ISIN, Annual Contribution, Payout Day, TDS, NPS fields |
| **PPF** | Hidden | `Interest Rate (% p.a.)` (prefilled `7.10` statutory ref), `Planned Annual Contribution (INR)` (₹1.5L cap), `Maturity Date` (15-yr) | ISIN, Compounding, Monthly Payout, Payout Day, TDS (EEE exempt), NPS fields |
| **Sukanya Samriddhi (SSY)** | Hidden | `Interest Rate (% p.a.)` (prefilled `8.20` statutory ref), `Planned Annual Contribution (INR)` (₹1.5L cap), `Maturity Date` (21-yr) | ISIN, Compounding, Monthly Payout, Payout Day, TDS (EEE exempt), NPS fields |
| **EPF** | Hidden | `Interest Rate (% p.a.)` (prefilled `8.25` EPFO ref), `Planned Annual Contribution (INR)` | ISIN, Compounding, Maturity Date, Monthly Payout, Payout Day, TDS, NPS fields |
| **NPS** | Hidden | `NPS Tier` chips (`Tier I`, `Tier II`), `NPS CRA` chips (`Protean`, `KFintech`, `CAMS`), `Pension Fund Manager (PFM)`, `Planned Annual Contribution (INR, opt)` | ISIN, Interest Rate, Compounding, Maturity Date, Monthly Payout, Payout Day, TDS |
| **SCSS** | Hidden | `Interest Rate (% p.a.)` (prefilled `8.20` ref), `Quarterly Payout (INR, opt)`, `Payout Day (1–31)`, `Maturity Date` (5-yr), `TDS Applicable` toggle | ISIN, Annual Contribution, Compounding, NPS fields |
| **POMIS** | Hidden | `Interest Rate (% p.a.)` (prefilled `7.40` ref), `Monthly Payout (INR, opt)`, `Payout Day (1–31)`, `Maturity Date` (5-yr) | ISIN, Annual Contribution, Compounding, TDS (no TDS on POMIS), NPS fields |
| **NSC** / **KVP** | Hidden | `Interest Rate (% p.a.)` (prefilled `7.70` NSC / `7.50` KVP ref), `Compounding` (`Annual` chip), `Maturity Date` | ISIN, Annual Contribution, Monthly Payout, Payout Day, TDS, NPS fields |
| **RBI Floating Rate Bond** | Hidden | `Interest Rate (% p.a.)` (prefilled `8.05` ref), `Payout Frequency` (`Semi-Annual` chip), `Maturity Date` (7-yr), `TDS Applicable` toggle | ISIN, Annual Contribution, NPS fields |
| **Bond / GOI** | **Shown** | `Coupon Rate (% p.a.)`, `Payout Frequency` chips (`Semi-Annual`, `Annual`, `Quarterly`, `Cumulative`), `Maturity Date`, `TDS Applicable` toggle | Annual Contribution, NPS fields |
| **Other** | Hidden | `Interest Rate (% p.a., opt)`, `Compounding / Payout` chips, `Maturity Date (opt)`, `TDS Applicable` toggle | NPS fields |

#### C. Real Estate (`REAL_ESTATE`)
| Subcategory | Step 1 `ISIN` | Relevant Specialist Fields (Shown & Saved) | Excluded Fields (Hidden & Never Saved) |
| :--- | :--- | :--- | :--- |
| **Residential** / **Commercial** | Hidden | `City / Locality / Register Ref`, `Area (sq ft)`, `Ownership Share (%)` (default `100`), `Monthly Rental Income (INR, opt)`, `Rent Day of Month (1–31, opt)` *(shown when rent > 0)* | ISIN, Exchange, Depository |
| **Land** / **Other** | Hidden | `City / Locality / Survey Ref`, `Area (sq ft / sq yd)`, `Ownership Share (%)` (default `100`) | ISIN, Rental Income, Rent Day, Exchange, Depository |
| **REIT** / **InvIT** | **Shown** | `Exchange` chips (`NSE`, `BSE`), `Depository` chips (`CDSL`, `NSDL`) | City/Locality, Area (sq ft), Ownership Share %, Rental Income |

#### D. Specialised (`SPECIALISED`)
| Subcategory | Step 1 `ISIN` | Relevant Specialist Fields (Shown & Saved) | Excluded Fields (Hidden & Never Saved) |
| :--- | :--- | :--- | :--- |
| **AIF** | Hidden | `AIF Category` chips (`Category I`, `Category II`, `Category III`), `Strategy / Fund Name`, `Custodian / Fund House`, `Capital Commitment (INR)`, `Capital Called (INR)` | ISIN |
| **PMS** | Hidden | `Strategy Name`, `PMS Provider / Custodian` | ISIN, AIF Category, Capital Commitment, Capital Called |
| **Unlisted equity** | **Shown (opt)** | `Depository / Mode` chips (`CDSL`, `NSDL`, `Physical`), `Broker / Cap Table Platform` (opt) | AIF Category, Strategy Name, Capital Commitment, Capital Called |
| **ESOP** | Hidden | `Grant / Cap Table Platform` (Carta / Qapita / EquityList / Company), `Next Vesting / Exercise Date (opt)` | ISIN, AIF Category, Strategy Name, Capital Commitment, Capital Called |
| **Other** | Hidden | `Instrument / Strategy Description`, `Custodian / Platform (opt)` | ISIN, AIF Category, Capital Commitment, Capital Called |

#### E. Cash & Bank (`CASH_BANK`)
| Subcategory | Step 1 `ISIN` | Relevant Specialist Fields (Shown & Saved) | Excluded Fields (Hidden & Never Saved) |
| :--- | :--- | :--- | :--- |
| **Savings account** | Hidden | `Bank IFSC Code (opt)`, `Interest Rate (% p.a., opt)`, `Expected Monthly Interest (INR, opt)` | ISIN, AMC, Held As |
| **Current account** | Hidden | `Bank IFSC Code (opt)` | ISIN, Interest Rate, Monthly Interest Credit (0% in India) |
| **Liquid / overnight** | **Shown (opt)** | `AMC / Fund House`, `Held As` chips (`SoA`, `Demat`), `Plan` chips (`Direct`, `Regular`) | Bank IFSC Code, Monthly Interest Credit |
| **Other** | Hidden | `Custodian / Wallet / Location (opt)` | ISIN, Bank IFSC Code, Monthly Interest Credit |

#### F. Liabilities (`LIABILITY`)
| Subcategory | Step 1 `ISIN` | Relevant Specialist Fields (Shown & Saved) | Excluded Fields (Hidden & Never Saved) |
| :--- | :--- | :--- | :--- |
| **Home loan** | Hidden | `Linked Property` picker (dropdown/chips of active Residential/Commercial/Land holdings, optional), `Rate Type` chips (`Floating` default, `Fixed`), `Interest Rate (% p.a.)`, `Monthly EMI (INR)`, `EMI Due Day (1–31)`, `Original Tenor (months)`, `Remaining Tenor (months)` | ISIN |
| **Car loan** / **Personal loan** | Hidden | `Rate Type` chips (`Fixed` default, `Floating`), `Interest Rate (% p.a.)`, `Monthly EMI (INR)`, `EMI Due Day (1–31)`, `Original Tenor (months)`, `Remaining Tenor (months)` | ISIN, Linked Property |
| **Education loan** / **Other** | Hidden | `Rate Type` chips (`Floating` default, `Fixed`), `Interest Rate (% p.a.)`, `Monthly EMI (INR)`, `EMI Due Day (1–31)`, `Original Tenor (months)`, `Remaining Tenor (months)` | ISIN, Linked Property |

### 10.4 Domain Model, Engine Wiring & Zero-Leakage Persistence

- **Backward-Compatible Data Model Additions**:
  - Add two nullable fields to `HoldingDetails` (`interestRatePercent: String? = null` for Fixed Income / Savings rates, and `storageLocation: String? = null` for Physical Gold locker/vault location), persisting them cleanly in the encrypted vault JSON without breaking any existing saved vaults.
  - Reuse existing `HoldingDetails` fields cleanly where semantic meaning matches: `monthlyIncomeMinor` & `incomeDay` for Real Estate Rental Income / Fixed Income Periodic Payout / RD Monthly Installment / Liability EMI Due Day (`incomeDay`), `maturityDate` for ESOP Vesting Date & Fixed Income / SGB Maturity, and `linkedHoldingId` for Home Loan → Property linking.
- **Domain Engine Enhancements**:
  - **Fixed Income Interest Accrual Engine**: Prioritize explicit `HoldingDetails.interestRatePercent` (and `sgbCouponRatePercent` for SGB) ahead of statutory fallback rates so Bank FD, Post Office RD, NSC, KVP, POMIS, RBI Floating Rate Bond, and Bonds generate accurate interest catch-up candidates automatically.
  - **Interest & EMI Engine**: Read `HoldingDetails.incomeDay` (clamped safely to the month's valid day range `1..lengthOfMonth()`) when generating upcoming EMI due dates instead of hardcoding the 5th of every month (gracefully defaulting to day `5` only for legacy loans with no `incomeDay` recorded).
  - **Holding Detail Screen**: Display the new fields cleanly (`Interest Rate`, `Storage Location`, `EMI Due Day`, `Linked Property` with computed Net Property Equity = Property Value − Linked Loan Principal) and synchronize the **Edit Holding Metadata sheet** to use the exact same subcategory schema and chip controls.

### 10.5 Key Product Trade-Offs

- **Declarative Schema Function vs. Inline `when` Branches**:
  - *Chosen Approach*: Centralize all visibility, label, chip-option, and Step 4 valuation mode rules inside a pure-Kotlin declarative form schema queried by the Wizard, Edit Metadata sheet, and save serializer.
  - *Why*: Guarantees 100% parity between creating and editing holdings, makes every subcategory rule unit-testable on the JVM without UI flakiness, and permanently prevents future metadata leakage bugs.
- **Preserving Existing Subcategories**:
  - *Chosen Approach*: Keep all existing `AssetTaxonomy` subcategory names untouched while optimizing every subcategory's fields.
  - *Why*: Ensures zero migration impact on existing portfolios, filters, sample data, or CAS imports while immediately delivering clean, tailored forms.

### 10.6 Verification Checklist

1. **Zero Data Leakage & Subcategory Visibility Matrix**:
   - Creating **Physical gold (24K)** saves `goldPurity`, `hallmarkHuid`, and `storageLocation` — and persists `sgbSeries = null`, `sgbCouponRatePercent = null`, `sgbEarlyExitDate = null`, `maturityDate = null`, `ownershipPercent = null`.
   - Creating **Bank FD** captures `interestRatePercent` (e.g., `7.25`), `compounding`, `maturityDate`, `tdsApplicable` — and excludes NPS fields and `ownershipPercent`.
   - Creating **NPS** captures `npsTier`, `npsCra`, `npsPfm`, `annualContributionPlannedMinor` — and hides Compounding, Maturity Date, Monthly Payout, and TDS.
   - Creating **REIT / InvIT** shows `ISIN`, `Exchange`, `Depository`, and `UNITS_AND_PRICE` valuation — and excludes `propertyCity`, `propertyAreaSqFt`, and `ownershipPercent`.
   - Creating **Residential / Commercial** hides `Units = 1` (uses `BALANCE_AND_COST`), shows `Monthly Rental Income` & `Rent Day`, and saves `ownershipPercent`.
   - Creating **PMS**, **Unlisted equity**, and **ESOP** excludes `aifCategory`, `capitalCommitmentMinor`, and `capitalCalledMinor`.
   - Creating **Current account** hides Monthly Interest Credit & Acquisition Cost (`CASH_BALANCE_ONLY`); **Liquid / overnight** hides Bank IFSC and uses `UNITS_AND_PRICE`.
   - Creating **Home loan** uses `LOAN_PRINCIPAL` (hiding `Units = 1` and Cost Unknown toggle), saves `linkedHoldingId` pointing to a Real Estate holding, and persists `incomeDay` (EMI Due Day).
2. **Engine Wiring Verification**:
   - `FixedIncomeAndCashFlowEngine.computeInterestAccrualCandidates()` computes exact accrual for a Bank FD using its explicit `interestRatePercent`.
   - `InterestAndEmiEngine.upcomingEventsForHolding()` schedules a Loan's next EMI on its recorded `incomeDay` (e.g., day `12` or safely clamped day `28`/`29` in February for day `31`).
3. **Edit Metadata Parity, Encrypted Vault Persistence & Build**:
   - `EditHoldingMetadataSheet` renders only the exact subcategory-allowed fields and persists updates cleanly across encrypted vault reload.
   - Clean `compile_applet` build and full passing `gradle :app:testDebugUnitTest` suite.
- **Status**: **Implemented & Verified** — Android build succeeds cleanly (`compile_applet`) and all **39/39** unit & Robolectric Compose UI tests pass across `Section10SubcategoryFormOptimizationTest` (11/11), `GrowUrDhanNavigationAndUiTest`, `UxPolishServicesAndAutoPasswordTest`, and `FinancialEnginesBatch5Test` — verifying the declarative `HoldingFormSchema` matrix across all 6 target categories, zero-leakage `HoldingDetails` sanitization, Step 4 direct Balance/Value/Principal valuation modes (no `Units = 1` friction), Material 3 quick-select chips, Home Loan Linked Property & Net Property Equity display, recorded EMI Due Day scheduling (including February month-end clamping), Fixed Income explicit `interestRatePercent` accrual calculation, encrypted vault round-trip persistence for `interestRatePercent` and `storageLocation`, automatic top-of-step scroll reset in the Holding Wizard, and full parity in the Edit Holding Metadata sheet.

---

## 11. Release 1 Onboarding Experience, Interactive Walkthrough, Auto-Custody Linking, UI Cleanups & Legal Terms v2.1

This release readiness milestone polishes the first-run user journey, strengthens security defaults, eliminates internal engineering/debug cards from production screens, automates custody account linking from eCAS statements, hardens the official market feed adapter, and upgrades the Terms & Conditions to a comprehensive Indian legal agreement (`v2.1-LEGAL-RELEASE`).

### 11.1 First-Run 5-Slide Onboarding Experience & Licensing Comparison

- **5-Slide Splash Carousel (`OnboardingIntroCarousel`)**:
  - Displayed once on fresh install before the Primary Account Sign-Up screen (persisted via `onboarding_intro_completed` in `AppPreferencesStore`).
  - Crafted using mobile fintech onboarding CRO & copywriting best practices (3-second scannable value-over-features headlines, bold outcome lead-ins, provable trust proof bars, and contextual next-step CTA labels):
    1. *One Clear View of Family Wealth* (`100% Private · On-Device` — all 8 Indian asset classes, zero cloud servers/ads, Hide Mode & opt-in biometrics).
    2. *Every Member and Account, Organised* (`Household & Auto-Custody` — Individual/HUF/Minor books, Owner Lens, automatic eCAS custody linking, Emergency Family Dossier).
    3. *Import eCAS & NPS PDFs in Seconds* (`Zero-Upload Statement Engine` — all 5 official senders parsed locally, smart CAMS/CDSL duplicate protection, optional read-only Gmail Sync).
    4. *Real Market Prices. Honest Returns.* (`NSE · BSE · AMFI Feeds` — official AMFI/NSE/BSE Bhavcopy refresh, fixed-point FIFO/XIRR math with truthful `Unknown` cost handling, household insights & Goals).
  - **Slide 5** displays a side-by-side **Transparent Licensing Models** comparison table across **`90-Day Trial`** (`₹0`, unlimited trial PDFs excluded from FY cap, Gmail Sync unlocked, no card/UPI mandate today), **`Free Forever`** (`₹0`, unlimited manual/CSV/market refresh, 3 PDF parses per Indian FY resetting April 1), and **`Pro Monthly`** (`₹20/month` inclusive of taxes via Google Play Billing), paired with a **Zero-Lock-In Promise** card and **"Start 90-Day Free Trial"** CTA.
  - Supports **Skip**, **Back (`←`)**, contextual forward CTAs (`Explore Family & Custody` → `See Statement Imports` → `See Official Live Pricing` → `Compare Plans`), and animated page indicators.

### 11.2 First-Time Interactive Navigation Walkthrough (`NavigationWalkthroughOverlay`)

- Launches automatically the first time a newly signed-up user enters the authenticated shell (persisted via `navigation_walkthrough_completed` in `AppPreferencesStore`).
- Guides the user through **6 live interactive stops** — **Home Command Center → Top Bar Controls (Owner Lens, Hide Mode, Instant Lock, Settings) → Portfolio & Price Refresh → Statements & Auto-Custody → Insights & Goals → Family & Custody Accounts** — dynamically switching the live primary tab behind the coach overlay at each step.
- Provides explicit **Forward (`→`)** and **Reverse (`←`)** arrow buttons, **Close (`✕`)**, **Skip Tour**, and **Finish** controls.
- Once skipped, closed, or completed, the walkthrough **never reopens automatically** on future launches (users can optionally replay it on demand from **Settings → Replay App Tour**).

### 11.3 Security & Family Profile Hardening

- **Biometric Login Disabled by Default**: `VaultSecurityState.biometricUnlockEnabled` and `PersistedVaultAuthJson.biometricUnlockEnabled` default to `false` (Settings toggle OFF by default). Hardware `BiometricPrompt` uses Android Keystore `CryptoObject` (`setInvalidatedByBiometricEnrollment(true)`) so unregistered fingers are strictly rejected by hardware, and users opt in whenever they choose.
- **Mandatory Date of Birth (DOB) for Family Members**: Adding or editing any household member in `FamilyScreen` now requires a valid `Date of Birth (DOB) *` (`YYYY-MM-DD` or `DD/MM/YYYY`), supporting accurate minor/guardian records and automatic NPS/CAS PDF password derivation.

### 11.4 Automatic Custody Account Creation & Linking from eCAS Imports

- `CasReconciliationEngine.resolveAndMaterializeCasCustodyAccounts()` automatically extracts and deduplicates custody accounts during `commitStagedCasBatch()`:
  - **Demat Accounts (`DEMAT`)**: Materialized from eCAS `accounts` headers and holding DP ID / Client ID / BO ID / Depository (`CDSL`/`NSDL`) metadata; deduplicated per owner by `(BO ID)` or `(DP ID, Client ID)`.
  - **Mutual Fund SOA Folios (`MF_FOLIO`)**: Materialized per unique normalized folio key (`normalizeFolioKey`) with AMC name and RTA (`CAMS` / `KFINTECH`).
  - **NPS PRAN Accounts (`NPS_PRAN`)**: Materialized from statement PRAN and CRA (`Protean`, etc.).
- Every committed holding (`NEW_POSITION` as well as backfilling existing unlinked holdings on `MATCH`, `COST_UPDATE`, `ADJUST_UP`, `ADJUST_DOWN`, `CLOSED`) and appended `LedgerEvent` links directly via `custodyAccountId` / `accountId`.
- Manual holdings continue to support manual custody account creation and selection via **Accounts & Custody**.

### 11.5 Release 1 UI Cleanups & Feature Scoping

- **Statements & Reconciliation**: Hide `"Unlimited PDF Parses (90-Day Free Trial)"` and `"Gmail Sync Unlocked"` chips while still showing Free Forever's remaining FY PDF count and upgrade notice once Free Forever applies.
- **Tax Feature Hidden for Release 1**: Hide the **Tax & Gains** button on Home (`home_tax_button`) and **Tax** button on Insights (`insights_open_tax_button`) pending tax-planner consultation, while retaining the underlying `IndianTaxEngine` and `TaxScreen` codebase for a future release.
- **Services Monitor**: Hide descriptive subtitles/summaries under **Python CASParser Engine** and **Keystore & Vault Auth Engine**, and hide the technical subtitle under **Encrypted Local Vault Storage** while preserving the live `"X member(s) · Y holding(s) · Z ledger event(s)"` count.
- **Privacy & Diagnostics**: Completely hide both the **"Schema, Backup Lockdown & Egress Inventory"** card and the **"Android Studio & Release Readiness"** card, relocating all security, permission, and Play Billing release disclosures into Terms & Conditions.

### 11.6 Comprehensive Legal Terms & Conditions (`v2.1-LEGAL-RELEASE`)

- Upgraded `TermsAndConditionsDocument` to **`v2.1-LEGAL-RELEASE`** (12 binding legal clauses) covering:
  1. Acceptance, Eligibility & Family / Minor / HUF Authority (Indian Contract Act, 1872 & DPDP Act, 2023).
  2. Informational Tool Only — No Financial, Investment, Tax, or Legal Advice (non-SEBI / non-ICAI disclaimer).
  3. Local-Only Storage, Zero Cloud Backup & Permanent Data Loss Warning (D57, `allowBackup=false`, user responsibility for offline recovery code).
  4. Platform Security Controls, Permissions & Play Release Disclosures (amended from the hidden Release Readiness card: Chaquopy CPython + `pypdfium2`, AES-256-GCM Keystore vault, PBKDF2-SHA256, 0 dangerous permissions, SAF/PrintManager, Play Billing SKU `gud_pro_monthly_20`, release SHA-1 for optional Gmail OAuth).
  5. Market Data & Third-Party Sources Disclaimer (NSE/BSE UDiFF Bhavcopy & AMFI `NAVAll.txt` provided AS-IS with zero warranty of completeness/real-time accuracy).
  6. Optional Read-Only Gmail Statement Sync & Google API Services User Data Policy (Limited Use).
  7. 90-Day Free Trial, Free Forever & Pro Monthly Subscription (`₹20/month` inclusive of taxes, Google Play auto-renewing mandate, Indian FY April 1 – March 31 PDF quota carry-over rule).
  8. On-Device Statement Parsing & Open-Source Attribution (`casparser` MIT License — Copyright © Sandeep Somasekharan, `pypdfium2`).
  9. Intellectual Property, Limited License & Prohibited Conduct.
  10. Disclaimer of Warranties ("AS IS" / "AS AVAILABLE").
  11. Limitation of Liability (capped at fees paid in the preceding 12 months, or ₹500 if on Free/Trial), User Indemnification & Force Majeure.
  12. Modifications, Severability, Governing Law (Republic of India) & Exclusive Indian Jurisdiction.
- Existing vaults with legacy `v1` or `v2.0` consent are automatically prompted with the blocking `TermsReacceptanceModalDialog` to review and record `v2.1-LEGAL-RELEASE` consent.

### 11.7 Official Market Feed Adapter (AMFI `NAVAll.txt`, NSE & BSE UDiFF Bhavcopy)

- Replaced legacy fragile equity JSON scraping with official public Indian exchange end-of-day Bhavcopy files:
  - **Mutual Funds**: Official AMFI `NAVAll.txt` matched primarily by ISIN (both Growth and IDCW columns) with AMFI scheme-code fallback.
  - **NSE Equities / ETFs / SGB / REIT / InvIT**: Official NSE UDiFF CM Bhavcopy `.csv.zip` (`archives.nseindia.com/content/cm/BhavCopy_NSE_CM_0_0_0_YYYYMMDD_F_0000.csv.zip`) matched by ISIN first, then ticker symbol.
  - **BSE Equities**: Official BSE UDiFF CM Bhavcopy `.CSV` (`www.bseindia.com/download/BhavCopy/Equity/BhavCopy_BSE_CM_0_0_0_YYYYMMDD_F_0000.CSV`) matched by ISIN first, then scrip code/symbol, with automatic cross-exchange NSE↔BSE ISIN fallback and up to 10 trading-day weekend/holiday/soft-404 lookback.
- **Status**: **Implemented & Verified** — Android build succeeds cleanly (`compile_applet`) and all **132/132** unit & Robolectric Compose UI tests pass across the entire suite, including `ReleaseReadinessAndOnboardingExperienceTest` (6/6), `MarketFeedAndBiometricSecurityTest`, `GrowUrDhanNavigationAndUiTest`, `SignupOnboardingAndPrimaryOwnerTest`, `UxPolishServicesAndAutoPasswordTest`, `Phase7HardeningAndAccessibilityTest`, `Phase8VaultPersistenceAndSecurityTest`, and `Phase10FinalPolishAndPdfReportTest`.

---

## 12. eCAS Nominee Registration Status, Custody Account Dropdown, AMC-First Folio Naming & Gmail Sync Pending-Conflict Deduplication

This update eliminates four real-world friction points surfaced during live eCAS and Gmail syncing: propagating eCAS nominee registration status (`Registered` / `Not Registered`) into ownership maps and holding metadata, replacing sprawling custody chip lists with an owner-filtered dropdown, replacing confusing generic `"Mutual Fund Folio"` labels with clear AMC names, and stopping Gmail Sync from creating duplicate records for statements already awaiting conflict review.

### User Review & Critical Decisions

> [!IMPORTANT] All four product decisions below were confirmed in Phase 1 and govern this implementation. Review the plan and tap **Proceed** to execute.

- **Confirmed Decision 1 — Nominee Display Format**: Show **`Registered`** or **`Not Registered`** status only across the Family Ownership & Custody Map and holding/account metadata summaries (reflecting both eCAS parsed registration status and manually recorded nominees).
- **Confirmed Decision 2 — Custody Account Dropdown Scope**: Replace the chip wall with a Material 3 dropdown in **both** the **Add Holding Wizard** and the **Edit Holding Metadata Sheet**, dynamically filtered to accounts belonging to the selected **Legal Owner**.
- **Confirmed Decision 3 — Mutual Fund Folio Labeling**: Replace confusing generic `"Mutual Fund Folio"` text with the **AMC Name only** in summary views (Family Ownership Map, Custody Account dropdown, Holding Detail summary, and Accounts card headers), while preserving the folio number in detailed account metadata.
- **Confirmed Decision 4 — Gmail Sync Unresolved Conflicts**: **Skip silently while pending** in the Review Queue (or currently open in Review & Commit) so repeated syncs never create duplicate records, while still **allowing re-fetch if explicitly dismissed** by the user.

### 12.1 Overview & Core Concept

- **What It Delivers**:
  1. **End-to-End Nominee Compliance Tracking**: Extracts folio/account nomination status directly from CAMS, KFintech, CDSL, and NSDL eCAS PDFs on-device and reflects `Registered` vs `Not Registered` cleanly in both holding metadata and the Family Ownership & Custody Map.
  2. **Scalable Custody Selection**: Swaps unbounded chip rows for a compact, owner-filtered Material 3 `ExposedDropdownMenuBox` so households with 20+ synced folios and demat accounts enjoy clean, fast forms.
  3. **Human-Readable MF Custody Labels**: Resolves every Mutual Fund folio to its true Indian AMC name (e.g., `Nippon India Mutual Fund`, `HDFC Mutual Fund`, `PPFAS Mutual Fund`) via parsed AMC fields plus a deterministic Indian AMC/scheme resolver, eliminating confusing `"Mutual Fund Folio"` placeholders.
  4. **Idempotent Gmail Sync Queueing**: Stops repeated sync runs from re-downloading or duplicating statements that already have unresolved conflicts waiting in the Gmail Review Queue—even when Gmail rotates attachment IDs between syncs.

### 12.2 User Experience & Visual Design

- **Flow 1 — eCAS Nominee Status (`Registered` / `Not Registered`)**:
  - When importing a CAMS, KFintech, CDSL, or NSDL eCAS PDF (manually or via Gmail Sync), the on-device parser inspects folio/scheme nomination lines (`Nominee 1/2/3`, `Nominee Registered`, `Nomination Registered`, `Not Registered`, `Opted Out`).
  - On commit, both the Holding and its linked Custody Account record `Registered` or `Not Registered`.
  - In **Family & Ownership → Family Ownership & Custody Map**, the `Nominee / Guardian` column renders **`Registered`** or **`Not Registered`** (appending `(Guard: <Name>)` for Minor holdings).
  - In **Holding Detail → Metadata** and **Edit Holding Metadata**, users see the exact `Nominee Status` (`Registered` / `Not Registered`) with a quick two-chip toggle so manual holdings and overrides stay synchronized.
- **Flow 2 — Owner-Filtered Custody Account Dropdown**:
  - In **Add Holding Wizard (Step 1)** and **Edit Holding Metadata Sheet**, `"Custody Account (optional)"` / `"Linked Custody Account"` renders as an accessible Material 3 `ExposedDropdownMenuBox` (minimum 48dp touch height).
  - Options show `"None (Unlinked)"` followed by custody accounts owned by the currently selected Legal Owner (displaying the AMC name for MF accounts, or broker/bank institution + masked reference for Demat/Bank/NPS accounts).
  - Switching the Legal Owner in the Add Wizard automatically refreshes the dropdown list and clears any previously selected account that belongs to a different member.
- **Flow 3 — AMC-Name-Only Summary Labels for MF Folios**:
  - Whenever an MF folio custody account is created (or reconciled from existing saved accounts), its institution resolves to the clean AMC name rather than `"Mutual Fund Folio"` or `"CAMS Mutual Fund Folio"`.
  - Summary surfaces (**Family Ownership & Custody Map**, **Custody Account Dropdown**, **Holding Detail Custody row**, and **Accounts & Custody card titles**) display the **AMC Name only** for MF folios (e.g., `HDFC Mutual Fund` instead of `Mutual Fund Folio · 123456`). Full folio number and RTA details remain neatly visible in the monospace metadata strip on the **Accounts & Custody** screen.
- **Flow 4 — Conflict-Safe Gmail Sync**:
  - Tapping **Sync Now** (or auto-sync on unlock) checks every candidate Gmail attachment against:
    1. Already committed statements (history & PDF content SHA-256).
    2. Statements currently sitting unresolved in the **Gmail Review Queue** or actively open in **Review & Commit** (matched by `messageId + filename`, `messageId + attachmentId`, and content SHA-256).
  - Unresolved statements are skipped silently with zero duplicate entries created; only genuinely new, never-seen, or previously dismissed statements are fetched and staged.
  - The sync summary truthfully distinguishes newly imported statements from those already awaiting review (e.g., *"Up to date · 1 statement awaiting review"*).

### 12.3 Key Product Decisions & Trade-Offs

- **Dedicated `NomineeRegistrationStatus` Enum vs. Storing `"Registered"` as a Fake Nominee Name**:
  - *Chosen Approach*: Add an explicit nullable `NomineeRegistrationStatus` (`REGISTERED`, `NOT_REGISTERED`) field alongside existing `nomineeName` / `nomineeNames` in holdings and custody accounts, plus a single helper (`effectiveNomineeStatus()`) that derives `REGISTERED` if either the status is `REGISTERED` or any nominee name is recorded, and `NOT_REGISTERED` otherwise.
  - *Why*: Keeps legal nominee names unpolluted if the user later wants full names in Emergency Dossiers, guarantees 100% backward compatibility with existing encrypted vaults, and enforces the user's exact `Registered` / `Not Registered` display rule consistently everywhere.
- **Matching Pending Gmail Conflicts by `(messageId, filename)` + Content SHA-256 Instead of `attachmentId` Alone**:
  - *Chosen Approach*: Deduplicate pending conflicts across three keys—`(messageId, filename)`, `(messageId, attachmentId)`, and PDF `sha256Prefix`—and clear those keys only when the user taps **Dismiss**.
  - *Why*: Gmail's REST API returns ephemeral `attachmentId` tokens that frequently rotate across requests for the exact same email attachment. Matching `(messageId, filename)` prevents redundant downloads before any network transfer happens, while the SHA-256 check catches forwarded duplicate emails carrying the identical PDF.
- **AMC Name Resolution with Retroactive Cleanup**:
  - *Chosen Approach*: Extract AMC directly from eCAS folio headers in the parser, fall back to a deterministic Indian AMC lookup table (matching scheme-name prefixes and AMFI AMC brands), and automatically upgrade any legacy `"Mutual Fund Folio"` / `"CAMS Mutual Fund Folio"` custody records during reconciliation or display.
  - *Why*: Existing portfolios synced before this release immediately gain clear AMC names without requiring users to delete and re-import their statements.

### 12.4 Technical Architecture & Data Strategy

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                 eCAS PDF / GMAIL SYNC & CUSTODY DATA FLOW                    │
├──────────────────────────────────────────────────────────────────────────────┤
│  1. Gmail Sync Orchestrator (3-Layer Pending & Content Guard)                │
│     • Pre-Download Guard : Skip if in Pending Queue or Active Staged Batch   │
│                            matching (messageId + filename) OR dedupKey       │
│     • Pre-Parse SHA Gate : Skip if PDF sha256Prefix matches Committed        │
│                            History OR Pending Queue / Active Staged Batch    │
│     • Dismiss Behavior   : Removes from Queue & clears Seen keys -> eligible │
│                            for re-fetch on next Sync Now                     │
│                                      │                                       │
│                                      ▼                                       │
│  2. On-Device Python CAS Parser (CAMS / KFintech / CDSL / NSDL / NPS)        │
│     • Extracts folio/scheme nominee status -> "REGISTERED" | "NOT_REGISTERED"│
│     • Extracts AMC name + scheme fallback  -> e.g. "Nippon India Mutual Fund"│
│                                      │                                       │
│                                      ▼                                       │
│  3. Reconciliation & Auto-Custody Materializer                               │
│     • Resolves clean Indian AMC name (never generic "Mutual Fund Folio")     │
│     • Persists NomineeRegistrationStatus on Holding & linked CustodyAccount  │
│     • Auto-upgrades legacy generic MF folio institution labels               │
│                                      │                                       │
│                                      ▼                                       │
│  4. UI Surfaces (Encrypted Vault State -> Compose)                           │
│     • Family Ownership Map : Custody = AMC Name; Nominee = Registered /      │
│                              Not Registered (+ Minor Guardian if applicable) │
│     • Add Wizard & Edit Sheet : Owner-filtered ExposedDropdownMenuBox for    │
│                                 Custody Account (AMC Name for MF folios)     │
│     • Holding Detail & Accounts : Clean AMC summary + Nominee Status badge   │
└──────────────────────────────────────────────────────────────────────────────┘
```

- **Data Model & Persistence**:
  - Extend `Holding` and `CustodyAccount` (and their encrypted JSON persistence envelopes) with optional `nomineeRegistrationStatus: NomineeRegistrationStatus? = null`, ensuring zero migration breakage on older vaults.
  - Extend parsed CAS holding/account DTOs with `nomineeStatus: String? = null` and `nominees: List<String> = emptyList()`.
- **Interactive Component & State Mapping**:
  - `CustodyAccountDropdown`: Shared Material 3 `ExposedDropdownMenuBox` composable used in both the Add Holding Wizard and Edit Holding Metadata Sheet, taking `ownerAccounts`, `selectedAccountId`, and `onSelectAccount`, formatting `MF_FOLIO` entries with the clean AMC Name and other accounts with `institution (maskedNumber)`.
  - `NomineeStatusToggle`: Two-choice `Registered` / `Not Registered` M3 chip selector in the Holding Metadata editor and Add Holding Wizard, defaulting automatically from eCAS parsed data and syncing cleanly to `Holding.nomineeRegistrationStatus`.
  - `GmailSyncOrchestrator` + `WealthRepository`: Deduplicates pending queue items prior to download, prior to parse (SHA-256), and inside `enqueueGmailConflict`, while keeping `dismissGmailConflict` re-syncable.

### 12.5 Verification Plan

1. **eCAS Nominee Parsing & Display**:
   - Unit + UI tests confirming CAMS/CDSL eCAS holdings with registered nominees vs missing/unregistered nominees persist `REGISTERED` / `NOT_REGISTERED` onto both Holding and CustodyAccount, and render `Registered` / `Not Registered` in Family Ownership & Custody Map and Holding Detail metadata.
2. **Owner-Filtered Custody Account Dropdown**:
   - Compose UI tests verifying both Add Holding Wizard and Edit Holding Metadata Sheet render an `ExposedDropdownMenuBox` dropdown (no chip wall), filter accounts strictly to the selected Legal Owner, and save the chosen linked account cleanly.
3. **AMC-First Mutual Fund Custody Labeling**:
   - Unit + UI tests confirming MF folios resolve to the real Indian AMC name (even when `amc` is omitted on CDSL/NSDL MF rows), upgrade legacy `"Mutual Fund Folio"` records, and display AMC Name only in summary views.
4. **Gmail Sync Pending-Conflict Deduplication**:
   - Unit tests running two consecutive Gmail Sync passes against an inbox containing an unresolved conflict statement (including with a rotated `attachmentId` on pass 2) verifying pass 2 skips it silently with **zero** duplicate queue records, and confirming that after the user explicitly calls **Dismiss**, a subsequent Sync Now re-fetches it cleanly.
5. **Full Regression**:
   - Clean `compile_applet` build and full passing `gradle :app:testDebugUnitTest` suite.
- **Status**: **Planned — Awaiting User Approval**.





