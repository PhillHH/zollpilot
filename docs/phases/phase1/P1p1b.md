# Phase 1.2 — Prompt 1B (Leitplanken-Update)

## Prompt

> # Phase 1.2 — Prompt 1B (Leitplanken-Update vor Prompt 2)
> # Ziel: Korrigiere Annahmen, verhindere Scope-Leak, stelle Doc-Kohärenz sicher.
> # KEINE Feature-Entwicklung, nur Entscheidungen + Constraints + Mini-Doc-Fix.
>
> ## Rolle
> Du bist **Lead Architect + QA-Owner**. Du fixierst jetzt nur Leitplanken.
> Du baust keine neuen Features, außer minimalen Anpassungen, die zwingend sind, um Doc-Drift zu verhindern.
>
> ## Kontext
> - Auth ist laut Docs aktuell „NICHT IMPLEMENTIERT“.
> - User-Model erzwingt `tenantId`.
> - User hat aktuell kein `passwordHash`.
> - Docs nennen Rollen (ADMIN/USER/...) und nicht Owner/Member.
> - Aktueller Betrieb nutzt `prisma db push` (Prototyping), obwohl Docs teils „migrate“ nennen können.
>
> ## Verbindliche Entscheidungen (ab jetzt)
> 1) **Auth Stack**
>    - Auth.js / NextAuth v5 ist OK.
>    - Credentials Provider ist OK.
>    - Password hashing: **bcrypt** (keine DIY crypto).
>
> 2) **Session Strategie**
>    - Verwende **DB Sessions via Prisma Adapter** (cookie-basiert).
>    - Kein JWT-Session-Modell in Phase 1.2.
>
> 3) **Tenancy / Workspace**
>    - Beim Signup wird **automatisch** ein Tenant/Workspace erstellt.
>    - User wird diesem Tenant zugeordnet.
>    - Tenant-Name: **neutral**, keine E-Mail im Namen.
>
> 4) **RBAC Semantik (MVP)**
>    - In Phase 1.2 werden **keine neuen Rollen** eingeführt.
>    - Mapping für MVP:
>      - **ADMIN = Owner**
>      - **USER = Member**
>    - Diese Semantik muss dokumentiert werden.
>
> 5) **DB Strategy (Phase 1.2)**
>    - `prisma db push` bleibt als **Prototyping-Strategie**.
>    - Falls Docs „migrate“ behaupten: markiere das als „geplant Phase 2+“ (Doc-Drift Fix).
>
> ## Pflicht: Dokumentation & Log
> 1) Lege/aktualisiere Log: `docs/phases/phase1/P1p1b.md`
> 2) Inhalt:
>    - Prompt (vollständig)
>    - Entscheidungen (die 5 Punkte oben)
>    - Welche Docs betroffen sind (Impact)
>    - Genau welche Doc-Änderungen gemacht wurden (Files/Lines)
>    - Offene Risiken (max 5)
>
> ## Minimaler Doc-Fix (nur wenn nötig)
> - Aktualisiere Doku so, dass sie den Ist-Plan korrekt beschreibt:
>   - Rollen-Semantik (ADMIN/USER ≙ Owner/Member) an einer zentralen Stelle
>   - DB-Strategie: `db push` = aktuell, `migrate` = später
>   - Session-Strategie: DB Sessions (Prisma Adapter)
>
> ## Output im Chat (kurz)
> - Bestätige die 5 Entscheidungen.
> - Liste die geänderten Doku-Dateien.
> - Nenne offene Risiken/Blocker (falls vorhanden).
>
> ## Start
> Führe Prompt 1B aus und committe nur notwendige Doc/Config-Anpassungen.
> Danach erst mit Prompt 2 (Implementierung Auth/Org) fortfahren.

## Decisions
1. **Auth Stack:** Auth.js v5, Credentials, bcrypt.
2. **Session Strategy:** DB Sessions via Prisma Adapter (No JWT).
3. **Tenancy:** Auto-create on signup, neutral name.
4. **RBAC Semantics:** No new roles. ADMIN=Owner, USER=Member.
5. **DB Strategy:** `prisma db push` for Phase 1.2.

## Impact Analysis
- **Docs:** Security Baseline, Architecture, Setup need updates to remove "JWT" references and clarify DB strategy.
- **Code:** `auth.ts` needs to switch session strategy to Database.

## Doc Changes
- `docs/security/SECURITY_BASELINE.md`: Update session strategy, add RBAC mapping.
- `docs/ARCHITECTURE.md`: Update Auth/Session section.
- `docs/SETUP.md`: Clarify `db push` usage.

## Risks
- Database session performance (higher DB load than JWT).
- Schema changes with `db push` might cause data loss in dev (acceptable for Phase 1).
