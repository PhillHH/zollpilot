# Status: Sprint 1 MVP Hardening (P1p5)

## 🎯 Current Scope
Release Candidate 1 for ZollPilot MVP. Focus is on stability, robustness, and reproducibility.

## ✅ Implemented Features (Clickable)
All features are available via the Wizard flow:

1.  **Dashboard** (`/declarations`)
    - List of recent declarations
    - Status overview

2.  **IAA Assistant Wizard**
    - **Step 1: Start** (`/declarations/new`) -> Creates Draft
    - **Step 2: Parties** (`.../wizard/parties`) -> Exporter, Recipient
    - **Step 3: Transport** (`.../wizard/transport`) -> Mode, Identity, Countries
    - **Step 4: Items** (`.../wizard/items`) -> Add/Remove Items (Commodity Code, Mass, Value)
    - **Step 5: Review** (`.../wizard/review`) -> Summary & Validation
    - **Step 6: Completion** (`/declarations/[id]/export`) -> Success Message & PDF Download

## 🚧 API Endpoints
Base URL: `/api`

- `GET /declarations` - List all declarations
- `POST /declarations` - Create new draft
- `GET /declarations/[id]` - Fetch declaration details
- `PATCH /declarations/[id]` - Update draft (Partial save allowed)
- `POST /declarations/[id]/items` - Add item
- `DELETE /declarations/[id]/items/[itemId]` - Remove item
- `POST /declarations/[id]/complete` - Finalize and Validate (Strict)
- `GET /declarations/[id]/pdf` - Generate Mock PDF

## 🛑 Limitations (Known Gaps)
- **No Real Customs Connection:** All submissions are internal only.
- **Mock PDF:** The PDF is generated client-side/server-side with mock data, not a valid customs form.
- **Tariff Logic:** No real tariff validation (mock 8-digit code check).

## 🔒 Security & Auth
- **Authentication:** Implemented (Credentials + DB Sessions).
- **Authorization:** RBAC (Admin/User) and Tenant Isolation enforced.
- **Validation:** Strict server-side Zod validation.

## 🔒 Security & Quality
- **Validation:** Strict server-side Zod validation on completion.
- **Logging:** Structured JSON logging (no PII).
- **CI/CD:** Automated E2E and Unit tests blocking invalid merges.
- **Environment:** Strict startup checks for missing ENV variables.
