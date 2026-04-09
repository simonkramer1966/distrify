# DISTRIFY — CLAUDE.md

## What Is This Project?

Distrify is a vertical SaaS platform for film distribution finance. It turns messy distribution statements into structured, contract-verified financial intelligence — replacing Excel, email, and guesswork for independent sales agents managing film revenue across global territories.

**Product name:** Distrify
**Repo:** github.com/simonkramer1966/distrify
**Founder:** Simon (solo technical founder, building with Claude Code)
**Stage:** Pre-MVP, Sprint 1

---

## Core Problem

Independent international sales agents managing 5–50 films across dozens of territories:
- Receive financial statements in wildly inconsistent formats (PDF, Excel, email) from distributors worldwide
- Manually re-enter data into spreadsheets (10–20 hrs/week)
- Have no automated way to detect commission overcharges, expense cap breaches, or FX rate errors (5–15% revenue leakage)
- Chase overdue payments manually across time zones and languages
- Have no single view of film financial health across their slate

## Core Solution

An AI-powered platform with four modules:
1. **Film Master File** — Single source of truth per film (metadata, territories, rights, financials, documents)
2. **Agreement Manager** — Structured contract data with AI-assisted extraction from PDF agreements
3. **Statement Engine** — AI extraction of PDF/Excel statements, terminology normalisation, contract compliance checking (red flags)
4. **Collections Tracker** — Automated payment tracking, missing statement detection, multi-language reminders

## Pricing Formula

Per film per month: `MAX($10, MIN($100, 0.5% × Monthly Gross Receipts))`

- Band A (dormant, <$2K/mo MGR): $10/month floor
- Band B (active, $2K–$20K/mo MGR): 0.5% of MGR ($10–$100)
- Band C (high-performing, >$20K/mo MGR): $100/month cap

AI statement extraction is bundled (not a separate add-on).

## Competitive Positioning

We are **Layer 1 (Statement Intelligence)**. No competitor occupies this layer.

- **Layer 1 (us):** Ingest statements, extract data, validate against contracts, flag discrepancies, chase payments
- **Layer 2 (FilmChain, Fintage House, Freeway Entertainment):** Collection & disbursement — receive verified revenue, allocate per waterfall, disburse to beneficiaries
- **Layer 3 (future):** Investor/beneficiary reporting portals

We are complementary to Layer 2 players, not competitive. We feed clean data into whichever CAM the film uses.

---

## Architecture

### System Diagram
```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│   Next.js 14+ (App Router) / TypeScript / Tailwind  │
│   React Query for data fetching                     │
│   Zustand for client state                          │
└──────────────────────┬──────────────────────────────┘
                       │ REST + WebSocket
┌──────────────────────▼──────────────────────────────┐
│                   BACKEND API                        │
│   Node.js / Fastify / TypeScript                    │
│   Prisma ORM                                        │
│   Bull MQ (job queues)                              │
│   Socket.io (real-time)                             │
└───┬──────────┬───────────┬──────────┬───────────────┘
    │          │           │          │
┌───▼───┐ ┌───▼────┐ ┌────▼───┐ ┌───▼────────────┐
│Postgres│ │ Redis  │ │  S3    │ │ AI Pipeline    │
│ (data) │ │ (cache │ │ (docs) │ │ (extraction)   │
│        │ │  queue)│ │        │ │                │
└────────┘ └────────┘ └────────┘ └───┬────────────┘
                                     │
                              ┌──────▼──────────┐
                              │ External APIs    │
                              │ - Claude API     │
                              │ - Google Doc AI  │
                              │ - Open Exch Rate │
                              │ - SendGrid       │
                              └─────────────────┘
```

### Monorepo Structure
```
distrify/
├── apps/
│   ├── web/                          # Next.js frontend
│   │   ├── app/                      # App Router pages
│   │   │   ├── (auth)/               # Auth pages (login, register, forgot)
│   │   │   ├── (dashboard)/          # Authenticated layout
│   │   │   │   ├── films/
│   │   │   │   │   ├── page.tsx              # Slate overview
│   │   │   │   │   ├── [filmId]/
│   │   │   │   │   │   ├── page.tsx          # Film detail/dashboard
│   │   │   │   │   │   ├── agreements/
│   │   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   │   ├── [agreementId]/page.tsx
│   │   │   │   │   │   ├── statements/
│   │   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   │   ├── upload/page.tsx
│   │   │   │   │   │   │   ├── [statementId]/page.tsx
│   │   │   │   │   │   ├── collections/page.tsx
│   │   │   │   │   │   ├── documents/page.tsx
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── distributors/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── [distributorId]/page.tsx
│   │   │   │   ├── collections/page.tsx
│   │   │   │   ├── settings/page.tsx
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui primitives
│   │   │   ├── films/
│   │   │   ├── agreements/
│   │   │   ├── statements/
│   │   │   ├── collections/
│   │   │   ├── dashboard/
│   │   │   └── layout/
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   ├── hooks/
│   │   │   ├── stores/
│   │   │   └── utils.ts
│   │
│   └── api/                          # Fastify backend
│       ├── src/
│       │   ├── server.ts
│       │   ├── routes/
│       │   │   ├── auth.ts
│       │   │   ├── films.ts
│       │   │   ├── agreements.ts
│       │   │   ├── statements.ts
│       │   │   ├── collections.ts
│       │   │   ├── distributors.ts
│       │   │   ├── documents.ts
│       │   │   ├── invoices.ts
│       │   │   ├── taxonomy.ts
│       │   │   └── dashboard.ts
│       │   ├── services/
│       │   │   ├── film.service.ts
│       │   │   ├── agreement.service.ts
│       │   │   ├── statement.service.ts
│       │   │   ├── extraction.service.ts
│       │   │   ├── ocr.service.ts
│       │   │   ├── taxonomy.service.ts
│       │   │   ├── compliance.service.ts
│       │   │   ├── collection.service.ts
│       │   │   ├── invoice.service.ts
│       │   │   ├── email.service.ts
│       │   │   ├── fx.service.ts
│       │   │   └── dashboard.service.ts
│       │   ├── jobs/
│       │   │   ├── statement-extraction.job.ts
│       │   │   ├── compliance-check.job.ts
│       │   │   ├── missing-statement-check.job.ts
│       │   │   ├── payment-reminder.job.ts
│       │   │   └── fx-rate-sync.job.ts
│       │   ├── middleware/
│       │   │   ├── auth.ts
│       │   │   ├── rbac.ts
│       │   │   └── rateLimit.ts
│       │   ├── lib/
│       │   │   ├── prisma.ts
│       │   │   ├── redis.ts
│       │   │   ├── s3.ts
│       │   │   ├── claude.ts
│       │   │   ├── queue.ts
│       │   │   └── logger.ts
│       │   └── types/
│       └── prisma/
│           ├── schema.prisma
│           ├── migrations/
│           └── seed.ts
│
├── packages/
│   └── shared/
│       ├── src/
│       │   ├── types/
│       │   │   ├── film.ts
│       │   │   ├── agreement.ts
│       │   │   ├── statement.ts
│       │   │   ├── collection.ts
│       │   │   └── taxonomy.ts
│       │   ├── constants/
│       │   │   ├── territories.ts
│       │   │   ├── rights-types.ts
│       │   │   ├── currencies.ts
│       │   │   └── canonical-terms.ts
│       │   └── validation/
│       │       ├── film.schema.ts
│       │       ├── agreement.schema.ts
│       │       └── statement.schema.ts
│
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── .env.example
├── CLAUDE.md                         # This file
└── README.md
```

### Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14+ (App Router), React 18, TypeScript, TailwindCSS, React Query, Zustand, shadcn/ui, Recharts |
| Backend API | Node.js, Fastify 4, TypeScript, Prisma 5, Zod |
| Background Jobs | BullMQ 5 with Redis |
| Database | PostgreSQL 16, Redis 7 |
| Document Storage | S3-compatible (AWS S3 or MinIO for local dev) |
| AI/ML | Anthropic Claude Sonnet 4.6 ($3/$15 per MTok); Tesseract.js for OCR fallback |
| Auth | JWT (access + refresh tokens); bcrypt; RBAC |
| Email | SendGrid or Postmark |
| FX Data | Open Exchange Rates API |
| Tooling | pnpm workspaces, Turborepo, ESLint, Prettier, Vitest, Playwright |

### docker-compose.yml
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: distrify
      POSTGRES_USER: distrify
      POSTGRES_PASSWORD: distrify_dev
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - miniodata:/data
volumes:
  pgdata:
  miniodata:
```

### .env.example
```env
DATABASE_URL="postgresql://distrify:distrify_dev@localhost:5432/distrify"
REDIS_URL="redis://localhost:6379"
S3_ENDPOINT="http://localhost:9000"
S3_BUCKET="distrify-documents"
S3_ACCESS_KEY="minioadmin"
S3_SECRET_KEY="minioadmin"
S3_REGION="us-east-1"
JWT_SECRET="dev-secret-change-in-production"
NEXTAUTH_SECRET="dev-secret-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
ANTHROPIC_API_KEY=""
GOOGLE_DOCUMENT_AI_KEY=""
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASS=""
EMAIL_FROM="noreply@distrify.app"
OPEN_EXCHANGE_RATES_APP_ID=""
```

---

## Database Schema

### Prisma Schema (apps/api/prisma/schema.prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==================== AUTH & ORG ====================

model Organization {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  users          User[]
  films          Film[]
  distributors   Distributor[]
  taxonomyTerms  TaxonomySynonym[]
}

model User {
  id             String   @id @default(cuid())
  email          String   @unique
  passwordHash   String
  name           String
  role           UserRole @default(AGENT)
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  createdFilms     Film[]
  statementReviews StatementReview[]
}

enum UserRole {
  ADMIN
  AGENT
  READONLY
}

// ==================== FILM MASTER FILE ====================

model Film {
  id               String   @id @default(cuid())
  organizationId   String
  organization     Organization @relation(fields: [organizationId], references: [id])
  createdById      String
  createdBy        User     @relation(fields: [createdById], references: [id])
  title            String
  titleLocal       String?
  isan             String?
  eidr             String?
  genre            String[]
  runtime          Int?
  releaseYear      Int?
  director         String?
  cast             String[]
  synopsis         String?
  productionBudget   Decimal?  @db.Decimal(14, 2)
  salesEstimate      Decimal?  @db.Decimal(14, 2)
  baseCurrency       String    @default("USD")
  taxCreditInfo      String?
  collectionAccountManager  String?
  collectionAccountRef      String?
  status           FilmStatus @default(ACTIVE)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  agreements       Agreement[]
  statements       Statement[]
  documents        Document[]
  territories      FilmTerritory[]
  payments         Payment[]
  @@index([organizationId])
}

enum FilmStatus {
  DEVELOPMENT
  ACTIVE
  COMPLETED
  ARCHIVED
}

model FilmTerritory {
  id          String   @id @default(cuid())
  filmId      String
  film        Film     @relation(fields: [filmId], references: [id], onDelete: Cascade)
  territory   String
  rightsType  String[]
  status      TerritoryStatus @default(UNSOLD)
  agreementId String?
  agreement   Agreement? @relation(fields: [agreementId], references: [id])
  @@unique([filmId, territory, rightsType])
  @@index([filmId])
}

enum TerritoryStatus {
  UNSOLD
  IN_NEGOTIATION
  SOLD
  EXPIRED
  REVERTED
}

// ==================== DISTRIBUTION AGREEMENTS ====================

model Distributor {
  id              String   @id @default(cuid())
  organizationId  String
  organization    Organization @relation(fields: [organizationId], references: [id])
  name            String
  contactName     String?
  contactEmail    String?
  phone           String?
  address         String?
  country         String?
  preferredLanguage String @default("en")
  bankDetails     Json?
  notes           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  agreements      Agreement[]
  statements      Statement[]
  reportingScore     Float?
  paymentScore       Float?
  complianceScore    Float?
  overallHealthScore Float?
  @@index([organizationId])
}

model Agreement {
  id              String   @id @default(cuid())
  filmId          String
  film            Film     @relation(fields: [filmId], references: [id], onDelete: Cascade)
  distributorId   String
  distributor     Distributor @relation(fields: [distributorId], references: [id])
  territory       String
  rightsGranted   String[]
  startDate       DateTime
  endDate         DateTime
  termMonths      Int?
  mgAmount          Decimal?  @db.Decimal(14, 2)
  mgCurrency        String    @default("USD")
  advanceSchedule   Json?
  commissionPercent Decimal   @db.Decimal(5, 2)
  commissionBase    CommissionBase @default(GROSS)
  expenseCap        Decimal?  @db.Decimal(14, 2)
  expenseCapCurrency String?
  recoupmentStructure Json?
  reportingFrequency ReportingFrequency @default(QUARTERLY)
  paymentDueDays     Int       @default(30)
  auditRights        Boolean   @default(true)
  auditRightsYears   Int?      @default(3)
  currency            String   @default("USD")
  fxConversionRule    String?
  originalDocumentId  String?
  originalDocument    Document? @relation(fields: [originalDocumentId], references: [id])
  extractedTerms      Json?
  termsConfirmed      Boolean  @default(false)
  status              AgreementStatus @default(ACTIVE)
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  statements          Statement[]
  territories         FilmTerritory[]
  payments            Payment[]
  reportingSchedules  ReportingSchedule[]
  @@index([filmId])
  @@index([distributorId])
}

enum CommissionBase { GROSS  NET }
enum ReportingFrequency { MONTHLY  QUARTERLY  SEMI_ANNUAL  ANNUAL }
enum AgreementStatus { DRAFT  ACTIVE  EXPIRED  TERMINATED }

model ReportingSchedule {
  id            String   @id @default(cuid())
  agreementId   String
  agreement     Agreement @relation(fields: [agreementId], references: [id], onDelete: Cascade)
  periodStart   DateTime
  periodEnd     DateTime
  dueDate       DateTime
  status        ScheduleStatus @default(PENDING)
  statementId   String?
  remindersSent Int       @default(0)
  lastReminder  DateTime?
  @@index([agreementId])
  @@index([dueDate])
  @@index([status])
}

enum ScheduleStatus { PENDING  DUE  OVERDUE  RECEIVED  WAIVED }

// ==================== STATEMENTS ====================

model Statement {
  id              String   @id @default(cuid())
  filmId          String
  film            Film     @relation(fields: [filmId], references: [id])
  agreementId     String
  agreement       Agreement @relation(fields: [agreementId], references: [id])
  distributorId   String
  distributor     Distributor @relation(fields: [distributorId], references: [id])
  sourceType      StatementSource
  sourceDocumentId String?
  sourceDocument  Document? @relation(fields: [sourceDocumentId], references: [id])
  extractionStatus  ExtractionStatus @default(PENDING)
  extractionMethod  String?
  extractionConfidence Float?
  rawExtractedData  Json?
  ocrUsed           Boolean  @default(false)
  reportingPeriodStart  DateTime?
  reportingPeriodEnd    DateTime?
  grossRevenue          Decimal?  @db.Decimal(14, 2)
  taxesWithheld         Decimal?  @db.Decimal(14, 2)
  platformFees          Decimal?  @db.Decimal(14, 2)
  pAndA                 Decimal?  @db.Decimal(14, 2)
  distributionExpenses  Decimal?  @db.Decimal(14, 2)
  commission            Decimal?  @db.Decimal(14, 2)
  commissionPercent     Decimal?  @db.Decimal(5, 2)
  netReceipts           Decimal?  @db.Decimal(14, 2)
  mgRecoupmentBalance   Decimal?  @db.Decimal(14, 2)
  currency              String?
  fxRateUsed            Decimal?  @db.Decimal(12, 6)
  fxRateDate            DateTime?
  reviewStatus    ReviewStatus @default(PENDING)
  reviewedById    String?
  reviewedAt      DateTime?
  reviewNotes     String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  redFlags        RedFlag[]
  reviews         StatementReview[]
  lineItems       StatementLineItem[]
  termMappings    StatementTermMapping[]
  payment         Payment?
  @@index([filmId])
  @@index([agreementId])
  @@index([reviewStatus])
}

enum StatementSource { PDF_UPLOAD  EXCEL_UPLOAD  EMAIL_FORWARD  MANUAL_ENTRY }
enum ExtractionStatus { PENDING  PROCESSING  EXTRACTED  NEEDS_REVIEW  FAILED }
enum ReviewStatus { PENDING  IN_REVIEW  APPROVED  REJECTED  FLAGGED }

model StatementLineItem {
  id            String   @id @default(cuid())
  statementId   String
  statement     Statement @relation(fields: [statementId], references: [id], onDelete: Cascade)
  rawLabel      String
  rawValue      Decimal  @db.Decimal(14, 2)
  canonicalTerm String
  confidence    Float
  sortOrder     Int
  @@index([statementId])
}

model StatementTermMapping {
  id            String   @id @default(cuid())
  statementId   String
  statement     Statement @relation(fields: [statementId], references: [id], onDelete: Cascade)
  rawTerm       String
  canonicalTerm String
  confidence    Float
  confirmedBy   String?
  confirmedAt   DateTime?
  @@index([statementId])
}

model StatementReview {
  id            String   @id @default(cuid())
  statementId   String
  statement     Statement @relation(fields: [statementId], references: [id], onDelete: Cascade)
  reviewerId    String
  reviewer      User     @relation(fields: [reviewerId], references: [id])
  action        String
  fieldChanges  Json?
  notes         String?
  createdAt     DateTime @default(now())
  @@index([statementId])
}

// ==================== RED FLAGS ====================

model RedFlag {
  id            String   @id @default(cuid())
  statementId   String
  statement     Statement @relation(fields: [statementId], references: [id], onDelete: Cascade)
  type          RedFlagType
  severity      RedFlagSeverity
  description   String
  details       Json?
  status        RedFlagStatus @default(OPEN)
  resolvedById  String?
  resolvedAt    DateTime?
  resolution    String?
  createdAt     DateTime @default(now())
  @@index([statementId])
  @@index([type])
  @@index([status])
}

enum RedFlagType {
  COMMISSION_MISMATCH
  EXPENSE_CAP_EXCEEDED
  INCORRECT_FX_RATE
  REPORTING_PERIOD_GAP
  MG_RECOUPMENT_ERROR
  UNDERPAYMENT
  LATE_STATEMENT
  UNRECOGNIZED_DEDUCTION
  CURRENCY_MISMATCH
}

enum RedFlagSeverity { HIGH  MEDIUM  LOW }
enum RedFlagStatus { OPEN  INVESTIGATING  RESOLVED  FALSE_POSITIVE }

// ==================== TERMINOLOGY ====================

model TaxonomySynonym {
  id              String   @id @default(cuid())
  organizationId  String
  organization    Organization @relation(fields: [organizationId], references: [id])
  canonicalTerm   String
  synonym         String
  language        String?
  territory       String?
  distributorId   String?
  source          SynonymSource @default(MANUAL)
  confidence      Float?
  confirmedBy     String?
  confirmedAt     DateTime?
  createdAt       DateTime @default(now())
  @@unique([organizationId, canonicalTerm, synonym])
  @@index([organizationId, canonicalTerm])
  @@index([synonym])
}

enum SynonymSource { MANUAL  AI_CONFIRMED  AI_PENDING  SYSTEM }

// ==================== PAYMENTS ====================

model Payment {
  id            String   @id @default(cuid())
  filmId        String
  film          Film     @relation(fields: [filmId], references: [id])
  agreementId   String
  agreement     Agreement @relation(fields: [agreementId], references: [id])
  statementId   String?  @unique
  statement     Statement? @relation(fields: [statementId], references: [id])
  type          PaymentType
  amountDue     Decimal   @db.Decimal(14, 2)
  amountReceived Decimal? @db.Decimal(14, 2)
  currency      String
  fxRateAtDue   Decimal?  @db.Decimal(12, 6)
  dueDate       DateTime
  receivedDate  DateTime?
  status        PaymentStatus @default(PENDING)
  remindersSent Int       @default(0)
  lastReminder  DateTime?
  escalationLevel Int     @default(0)
  notes         String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  @@index([filmId])
  @@index([status])
  @@index([dueDate])
}

enum PaymentType { MG_INSTALLMENT  NET_RECEIPTS  OVERAGES }
enum PaymentStatus { PENDING  DUE  OVERDUE  RECEIVED  PARTIAL  DISPUTED  WRITTEN_OFF }

// ==================== DOCUMENTS ====================

model Document {
  id            String   @id @default(cuid())
  filmId        String?
  fileName      String
  fileType      String
  fileSize      Int
  s3Key         String
  category      DocumentCategory
  tags          String[]
  description   String?
  version       Int       @default(1)
  uploadedById  String?
  createdAt     DateTime @default(now())
  agreements    Agreement[]
  statements    Statement[]
  @@index([filmId])
  @@index([category])
}

enum DocumentCategory {
  DISTRIBUTION_AGREEMENT
  STATEMENT
  CHAIN_OF_TITLE
  EO_INSURANCE
  SALES_ESTIMATE
  DEAL_MEMO
  DELIVERY_MATERIALS
  INVOICE
  CORRESPONDENCE
  OTHER
}

// ==================== FX RATES ====================

model FxRate {
  id       String   @id @default(cuid())
  date     DateTime @db.Date
  baseCurrency String @default("USD")
  targetCurrency String
  rate     Decimal  @db.Decimal(12, 6)
  @@unique([date, baseCurrency, targetCurrency])
  @@index([date])
}
```

---

## Canonical Terms (packages/shared/src/constants/canonical-terms.ts)

```typescript
export const CANONICAL_TERMS = {
  GROSS_REVENUE: { label: 'Gross Revenue', description: 'Total revenue before any deductions', category: 'revenue' },
  TAXES_WITHHELD: { label: 'Taxes Withheld', description: 'Territory-specific withholding tax and VAT', category: 'deduction' },
  PLATFORM_FEES: { label: 'Platform Fees', description: 'TVOD/SVOD/AVOD platform technical fees', category: 'deduction' },
  P_AND_A: { label: 'P&A / Marketing', description: 'Print, advertising, marketing costs', category: 'expense' },
  DISTRIBUTION_EXPENSES: { label: 'Distribution Expenses', description: 'Distributor operational costs', category: 'expense' },
  COMMISSION: { label: 'Distributor Commission', description: 'Commission on gross or net', category: 'commission' },
  NET_RECEIPTS: { label: 'Net Receipts', description: 'Amount due to rights holder', category: 'net' },
  MG_RECOUPMENT: { label: 'MG Recoupment Balance', description: 'Running MG recovery balance', category: 'recoupment' },
  OVERAGES: { label: 'Overages', description: 'Revenue above MG threshold', category: 'revenue' },
} as const;

export type CanonicalTermKey = keyof typeof CANONICAL_TERMS;
```

---

## Sprint Plan

### Phase 1: Foundation (Sprints 1–9, Months 1–2)
| Sprint | Focus | Key Deliverables |
|--------|-------|-----------------|
| 1 | Project scaffolding | Monorepo, Docker, DB, auth skeleton, CI/CD |
| 2 | Auth & org management | Registration, login, org creation, RBAC |
| 3 | Film data model & CRUD | Film creation wizard, list, detail views |
| 4 | Territory-rights matrix | Grid view, slate overview |
| 5 | Document vault | Upload, tag, S3 storage, browse/search |
| 6 | Distributor management | CRUD, contact directory |
| 7 | Agreement data entry | Structured form for all contract fields |
| 8 | Agreement AI extraction (v1) | PDF → Claude extracts terms → pre-fills form |
| 9 | Agreement polish + bulk import | Timeline view, CSV import, amendments |

### Phase 2: Intelligence Engine (Sprints 10–18, Months 3–4)
| Sprint | Focus | Key Deliverables |
|--------|-------|-----------------|
| 10 | PDF ingestion pipeline | Multi-path: direct text → OCR → LLM |
| 11 | Excel ingestion pipeline | SheetJS parsing, column mapping |
| 12 | Terminology normalisation | Canonical taxonomy, synonym dict, AI classification |
| 13 | Statement normalised model | Map to canonical structure, confidence scoring |
| 14 | Statement review UI | Split view, field-by-field edit, term confirmation |
| 15 | Compliance engine (red flags) | 7 automated checks against contract terms |
| 16 | Red flag UI + resolution | Dashboard, detail, resolution workflow |
| 17 | Template learning | Distributor format memory |
| 18 | Multi-currency normalisation | FX rate service, statement-date conversion |

### Phase 3: Automation & Scale (Sprints 19–26, Months 5–6)
| Sprint | Focus | Key Deliverables |
|--------|-------|-----------------|
| 19 | Reporting schedule engine | Auto-generate dates from agreements |
| 20 | Missing statement detection | Cron, grace periods, auto-reminders |
| 21 | Payment tracking | Status workflow: Pending→Due→Overdue→Received |
| 22 | Payment reminders & escalation | Multi-language templates, escalation ladder |
| 23 | Invoice generation | PDF invoices, multi-currency, tax |
| 24 | Film-level dashboard | Revenue breakdown, recoupment, aging receivables |
| 25 | Slate-level dashboard | Cross-film metrics, commission tracker |
| 26 | Distributor health scoring + polish | Scoring algorithm, QA, performance |

### Critical Path
Sprint 1 → 2 → 3 → 6 → 7 → 10 → 12 → 13 → 15

---

## Sprint 1: Project Scaffolding (CURRENT)

**Goal:** Working monorepo. Developer can clone, run `docker compose up && pnpm dev`, and see a running app.

**Tasks:**
1. Initialize pnpm workspace with `apps/web`, `apps/api`, `packages/shared`
2. Configure Turborepo with `dev`, `build`, `lint`, `test` pipelines
3. Set up docker-compose.yml (Postgres 16, Redis 7, MinIO)
4. Initialize Prisma with Organization and User models only
5. Create Fastify server with health check: `GET /api/health`
6. Create Next.js app with App Router + shadcn/ui
7. Set up shared package with TypeScript types
8. Configure ESLint + Prettier
9. Create .env.example
10. Write README.md

**Acceptance Criteria:**
- `docker compose up -d` starts Postgres, Redis, MinIO
- `pnpm dev` starts frontend (port 3000) and backend (port 4000)
- `GET http://localhost:4000/api/health` returns `{ status: "ok" }`
- Frontend renders a blank shell with sidebar
- `pnpm lint` and `pnpm type-check` pass with zero errors

---

## Sprint 2: Auth & Org Management

**API Endpoints:**
```
POST   /api/auth/register       { email, password, name }
POST   /api/auth/login          { email, password } → { token, user }
POST   /api/auth/refresh        { refreshToken } → { token }
POST   /api/auth/forgot         { email }
POST   /api/auth/reset          { token, newPassword }
POST   /api/organizations                 { name, slug }
GET    /api/organizations/:orgId
PUT    /api/organizations/:orgId          { name }
POST   /api/organizations/:orgId/invite   { email, role }
GET    /api/organizations/:orgId/members
PUT    /api/organizations/:orgId/members/:userId  { role }
DELETE /api/organizations/:orgId/members/:userId
```

**Notes:** JWT with 15min access token + 7-day refresh token (httpOnly cookie). RBAC middleware: `requireRole('ADMIN')`, `requireOrg()`. Bcrypt 12 rounds.

---

## Sprint 3: Film CRUD

**API Endpoints:**
```
POST   /api/films                        { ...filmData }
GET    /api/films                        ?status=ACTIVE&search=&page=&limit=
GET    /api/films/:filmId
PUT    /api/films/:filmId                { ...filmData }
DELETE /api/films/:filmId
GET    /api/films/:filmId/summary
```

**Frontend:** `/films` (slate overview: card + table view toggle), `/films/new` (multi-step wizard: Identity → Financial → Collection Account), `/films/[filmId]` (tabbed detail: Overview, Agreements, Statements, Documents, Collections).

---

## Key Domain Concepts (for context)

- **Sales Agent:** Company that represents film producers, selling distribution rights to territorial distributors worldwide. Our primary customer.
- **Distributor:** Company that exploits film rights in a specific territory (e.g., a German broadcaster, a Japanese SVOD platform). They send statements and payments.
- **MG (Minimum Guarantee):** Upfront payment from distributor to sales agent for territorial rights. Must be recouped before overages are paid.
- **Recoupment Waterfall:** The order in which revenue is allocated to different parties (sales agent commission → expenses → MG recovery → producer share → investor return → talent backend).
- **CAMA:** Collection Account Management Agreement. Multi-party contract defining how a CAM allocates revenue.
- **CAM:** Collection Account Manager (Fintage, Freeway, FilmChain). Neutral third-party that receives and disburses revenue per the waterfall.
- **Rights Types:** TVOD (transactional VOD), SVOD (subscription VOD), AVOD (ad-supported VOD), Theatrical, Airline, Free TV, Pay TV.
- **Territory:** Geographic market (usually a country, sometimes a region like "Latin America" or "Benelux").
- **Red Flag:** Automated compliance alert when statement data contradicts contract terms.

---

## AI Pipeline Notes

- Use Claude Sonnet 4.6 for all extraction and classification
- Statement extraction: ~2,000 input + ~1,000 output tokens (~$0.02–$0.05/call)
- Agreement extraction: ~5,000 input + ~1,500 output tokens (~$0.05–$0.10/call)
- Term classification: ~500 input + ~200 output tokens (~$0.005/call)
- Max 5 concurrent extraction jobs per org (BullMQ concurrency)
- Confidence thresholds: ≥0.95 auto-accept, 0.80–0.94 queue confirmation, 0.50–0.79 flag for review, <0.50 manual only

---

## Response Format (API)

```typescript
// Success
{ data: T, meta?: { page, limit, total } }

// Error
{ error: { code: string, message: string, details?: any } }
```

Status codes: 200 (ok), 201 (created), 400 (validation), 401 (unauth), 403 (forbidden), 404 (not found), 409 (conflict), 500 (server error).
