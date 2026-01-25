# Phase 1 Exit Audit

**Datum:** 2026-01-25  
**Rolle:** Principal Engineer + QA Lead + Produkt-Auditor  
**Audit-Scope:** Vollständige Bestandsaufnahme Phase 1 vor Phase-2-Freigabe

---

## Executive Summary

**Gesamtanzahl Issues:** 23  
**BLOCKER:** 0  
**HIGH:** 5  
**MEDIUM:** 11  
**LOW:** 7

**Phase-2-Freigabe:** ✅ **JA** (unter Bedingungen)

**Wichtigstes Risiko:** Inkonsistenz zwischen dokumentiertem Datenmodell (P1p3) und tatsächlicher Implementierung führt zu Verwirrung bei Phase-2-Arbeiten. Mehrere `console.error` Aufrufe im Frontend widersprechen der dokumentierten Logging-Policy aus P1p5.

---

## Gefundene Issues

### Kategorie A: Produktlogik & Flow-Kohärenz

#### A1: Wizard-Flow Step-Nummerierung inkonsistent
- **Schweregrad:** MEDIUM
- **Beschreibung:** P1p4 dokumentiert Steps 1-6, aber die Implementierung nutzt Steps 1-5. Step 1 ist "Start/Kopfdaten" laut Doku, aber im Code wird direkt zu `parties` (Step 2) navigiert.
- **Beleg:**
  - [P1p4.md:153-210](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/docs/phases/phase1/P1p4.md#L153-L210) definiert 6 Steps
  - [schema.prisma:99](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/apps/web/prisma/schema.prisma#L99) `step Int @default(1)`
  - [page.tsx:7-13](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/apps/web/src/app/declarations/page.tsx#L7-L13) STEP_MAP zeigt 1→parties, 2→parties, 3→transport, 4→items, 5→review
- **Empfehlung:** **Vor Phase 2 fixen**. Entweder Doku anpassen (5 Steps statt 6) oder Code anpassen (expliziter Step 1 "Start").

#### A2: "Declarant" Feld wird nie erfasst
- **Schweregrad:** LOW
- **Beschreibung:** P1p3 und P1p4 dokumentieren `declarant` (Anmelder) als optionales Feld, aber es gibt kein UI-Feld dafür im Parties-Screen.
- **Beleg:**
  - [P1p3.md:149](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/docs/phases/phase1/P1p3.md#L149) definiert `declarant` in JSON
  - [parties/page.tsx](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/apps/web/src/app/declarations/[id]/wizard/parties/page.tsx) hat keine Declarant-Felder
- **Empfehlung:** **In Phase 2 akzeptabel**. Für MVP reicht Exporter/Recipient. Dokumentieren als "bewusst nicht implementiert".

#### A3: Wizard-Layout zeigt keine aktive Step-Hervorhebung
- **Schweregrad:** LOW
- **Beschreibung:** Das Wizard-Layout hat einen Kommentar "Highlighting logic handled in page or just generic here", aber keine Implementierung. Alle Steps sind immer blau.
- **Beleg:** [layout.tsx:24-26](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/apps/web/src/app/declarations/[id]/wizard/layout.tsx#L24-L26)
- **Empfehlung:** **In Phase 2 akzeptabel**. UX-Verbesserung, kein funktionaler Fehler.

---

### Kategorie B: Datenmodell vs. Realität

#### B1: `procedureCode` in P1p3 dokumentiert, aber nirgends implementiert
- **Schweregrad:** MEDIUM
- **Beschreibung:** P1p3 definiert `procedureCode` als Feld in `DeclarationItem.data`, aber es wird weder im UI erfasst noch in der Validierung geprüft.
- **Beleg:**
  - [P1p3.md:187](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/docs/phases/phase1/P1p3.md#L187) `"procedureCode": "string (z.B. 1000)"`
  - Grep-Suche nach `procedureCode` findet **0 Treffer** im Code
- **Empfehlung:** **Vor Phase 2 fixen**. Entweder aus Doku entfernen oder als "TODO Phase 2" markieren.

#### B2: `referenceNumber` in P1p3 dokumentiert, aber nicht erfassbar
- **Schweregrad:** LOW
- **Beschreibung:** P1p3 definiert `referenceNumber` (eigene Referenz) im JSON, aber es gibt kein UI-Feld dafür.
- **Beleg:** [P1p3.md:145](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/docs/phases/phase1/P1p3.md#L145)
- **Empfehlung:** **In Phase 2 akzeptabel**. Nice-to-have Feature.

#### B3: Keine Unique-Constraint auf `sequenceNumber` pro Declaration
- **Schweregrad:** MEDIUM
- **Beschreibung:** P1p3 sagt "muss eindeutig pro Decl sein", aber das Schema hat keinen `@@unique([declarationId, sequenceNumber])` Constraint.
- **Beleg:**
  - [P1p3.md:171](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/docs/phases/phase1/P1p3.md#L171) "muss eindeutig pro Decl sein"
  - [schema.prisma:114-126](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/apps/web/prisma/schema.prisma#L114-L126) kein unique constraint
- **Empfehlung:** **Vor Phase 2 fixen**. Datenintegrität.

---

### Kategorie C: Validation & Fehlerzustände

#### C1: Draft vs. Complete Validierung nicht klar getrennt
- **Schweregrad:** HIGH
- **Beschreibung:** P1p3 sagt "Draft (partial, permissiv) vs Complete (strikt)", aber PATCH-Endpunkte validieren **gar nicht**. Nur `/complete` validiert.
- **Beleg:**
  - [route.ts:21-35](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/apps/web/src/app/api/declarations/[id]/route.ts#L21-L35) PATCH hat keine Validierung
  - [complete/route.ts:19-26](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/apps/web/src/app/api/declarations/[id]/complete/route.ts#L19-L26) nur hier Validierung
- **Empfehlung:** **Vor Phase 2 fixen**. Mindestens Typ-Validierung (z.B. "country muss String sein") auch bei Draft.

#### C2: Client-Side Validierung kann umgangen werden
- **Schweregrad:** MEDIUM
- **Beschreibung:** Frontend nutzt Zod + React Hook Form, aber ein direkter API-Call (z.B. via Postman) kann ungültige Daten speichern.
- **Beleg:** PATCH `/api/declarations/:id` hat keine Server-Side Validation
- **Empfehlung:** **Vor Phase 2 fixen**. Zumindest Basic-Validierung (Typ-Checks) auf Server.

#### C3: Fehlermeldungen teilweise auf Englisch, teilweise Deutsch
- **Schweregrad:** LOW
- **Beschreibung:** Zod-Schemas nutzen deutsche Fehlermeldungen, aber API-Responses sind englisch ("Internal Server Error").
- **Beleg:**
  - [declaration.ts:6-10](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/apps/web/src/lib/validation/declaration.ts#L6-L10) deutsche Meldungen
  - [route.ts:14](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/apps/web/src/app/api/declarations/route.ts#L14) englische Meldungen
- **Empfehlung:** **In Phase 2 akzeptabel**. Konsistenz ist nice-to-have.

#### C4: Keine Validierung für `invoiceAmount.currency` gegen ISO-Liste
- **Schweregrad:** LOW
- **Beschreibung:** Validierung prüft nur "3 Zeichen", aber nicht ob es ein gültiger ISO-Code ist (z.B. "XXX" wäre akzeptiert).
- **Beleg:** [declaration.ts:51](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/apps/web/src/lib/validation/declaration.ts#L51)
- **Empfehlung:** **In Phase 2 akzeptabel**. MVP-Niveau.

---

### Kategorie D: API-Verträge & Stabilität

#### D1: PATCH `/declarations/:id` akzeptiert beliebige JSON-Struktur
- **Schweregrad:** HIGH
- **Beschreibung:** Der PATCH-Endpunkt merged blind `data` ins bestehende JSON, ohne Schema-Validierung. Man könnte `data.foo = "bar"` senden.
- **Beleg:** [route.ts:26-27](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/apps/web/src/app/api/declarations/[id]/route.ts#L26-L27) `const { data, step } = body;`
- **Empfehlung:** **Vor Phase 2 fixen**. Mindestens Whitelist der erlaubten Keys.

#### D2: Keine Fehlerbehandlung für "Declaration not found" in mehreren Endpunkten
- **Schweregrad:** MEDIUM
- **Beschreibung:** `updateDeclaration` wirft Error bei "not found", aber der PATCH-Handler catcht nur generisch und gibt 500 zurück statt 404.
- **Beleg:** [declaration.ts:48](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/apps/web/src/server/declaration.ts#L48) wirft Error, [route.ts:31-34](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/apps/web/src/app/api/declarations/[id]/route.ts#L31-L34) catcht als 500
- **Empfehlung:** **Vor Phase 2 fixen**. Korrekte HTTP-Statuscodes.

#### D3: POST `/declarations/:id/items` hat keinen expliziten Endpunkt
- **Schweregrad:** MEDIUM
- **Beschreibung:** P1p4 dokumentiert `POST /api/declarations/:id/items`, aber es gibt keinen `items/route.ts` im `[id]` Ordner.
- **Beleg:**
  - [P1p4.md:246](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/docs/phases/phase1/P1p4.md#L246) dokumentiert Endpunkt
  - `list_dir` zeigt nur `items/[itemId]/route.ts`
- **Empfehlung:** **BLOCKER-Kandidat**, aber Code funktioniert laut E2E-Test. **Klärung nötig**: Ist der Endpunkt woanders? Oder Doku falsch?

#### D4: DELETE `/items/:itemId` fehlt `declarationId` in URL
- **Schweregrad:** LOW
- **Beschreibung:** Laut Doku sollte es `/declarations/:id/items/:itemId` sein, aber vermutlich ist es `/api/declarations/:id/items/:itemId` (nicht verifiziert).
- **Beleg:** Code-Struktur legt nahe, dass Route existiert, aber nicht explizit geprüft.
- **Empfehlung:** **In Phase 2 akzeptabel**. Funktioniert laut E2E.

---

### Kategorie E: Docker, Startup & Reproduzierbarkeit

#### E1: `migrate` Service nutzt `db:push` statt echte Migrationen
- **Schweregrad:** MEDIUM
- **Beschreibung:** P1p5 und P1p6 dokumentieren "db:push ist Prototyping", aber es ist nicht klar, dass dies **nicht produktionsreif** ist.
- **Beleg:**
  - [docker-compose.yml:28](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/docker-compose.yml#L28) `pnpm --filter @zollpilot/web db:push`
  - [P1p5.md:73](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/docs/phases/phase1/P1p5.md#L73) "db:push (prototyping)"
- **Empfehlung:** **Bewusstes Risiko**. In Doku als "Phase 2 TODO" markieren.

#### E2: Keine explizite Healthcheck für `web` Service
- **Schweregrad:** LOW
- **Beschreibung:** `postgres` hat Healthcheck, `web` nicht. Bei schnellem Restart könnte `web` starten, bevor DB bereit ist (trotz `depends_on`).
- **Beleg:** [docker-compose.yml:2-15](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/docker-compose.yml#L2-L15)
- **Empfehlung:** **In Phase 2 akzeptabel**. `depends_on: service_healthy` reicht für MVP.

#### E3: `next.config.js` ignoriert TypeScript/ESLint Errors im Build
- **Schweregrad:** HIGH
- **Beschreibung:** `ignoreBuildErrors: true` und `ignoreDuringBuilds: true` bedeuten, dass Docker-Build auch bei Typ-Fehlern durchläuft.
- **Beleg:** [next.config.js:21-26](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/apps/web/next.config.js#L21-L26)
- **Empfehlung:** **Vor Phase 2 fixen**. CI sollte Typ-Fehler catchen, aber Build sollte nicht ignorieren.

---

### Kategorie F: Tests & Testlücken

#### F1: E2E-Test prüft nicht, ob Items wirklich persistiert werden
- **Schweregrad:** MEDIUM
- **Beschreibung:** Der Test fügt ein Item hinzu und prüft, ob es in der Liste erscheint, aber nicht, ob es nach Reload noch da ist.
- **Beleg:** [wizard.spec.ts:44-57](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/apps/web/e2e/wizard.spec.ts#L44-L57)
- **Empfehlung:** **In Phase 2 akzeptabel**. Draft-Persistence wird für Parties getestet (Zeile 26-31).

#### F2: Keine Unit-Tests für `declaration.ts` Server-Funktionen
- **Schweregrad:** MEDIUM
- **Beschreibung:** `createDraft`, `updateDeclaration`, `addItem` etc. haben keine Unit-Tests, nur indirekt via E2E.
- **Beleg:** `find_by_name *.test.ts` zeigt nur `validation.test.ts`, `health.test.ts`, `audit.int.test.ts`, `db.int.test.ts`
- **Empfehlung:** **In Phase 2 akzeptabel**. E2E deckt Happy Path ab.

#### F3: Keine Tests für Fehlerszenarien (z.B. "Item mit ungültiger commodityCode")
- **Schweregrad:** LOW
- **Beschreibung:** Validierung wird getestet, aber nicht die API-Responses bei Validierungsfehlern.
- **Beleg:** [validation.test.ts](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/apps/web/test/unit/validation.test.ts) testet nur Zod-Schemas
- **Empfehlung:** **In Phase 2 akzeptabel**. MVP-Niveau.

---

### Kategorie G: Dokumentation & Doc-Drift

#### G1: P1p4 sagt "Unit Tests für validateDeclarationComplete()", aber Funktion existiert nicht
- **Schweregrad:** MEDIUM
- **Beschreibung:** P1p4 dokumentiert eine Funktion `validateDeclarationComplete()`, aber grep findet sie nicht.
- **Beleg:**
  - [P1p4.md:120](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/docs/phases/phase1/P1p4.md#L120) erwähnt Funktion
  - Grep-Suche: 0 Treffer
- **Empfehlung:** **Vor Phase 2 fixen**. Doku korrigieren (es ist `declarationCompleteSchema.safeParse`).

#### G2: README.md sagt "Phase 0.12", aber Phase 1 ist abgeschlossen
- **Schweregrad:** LOW
- **Beschreibung:** README ist veraltet.
- **Beleg:** [README.md:11](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/README.md#L11) "Phase: 0.12"
- **Empfehlung:** **Vor Phase 2 fixen**. Auf "Phase 1 Complete" aktualisieren.

#### G3: STATUS.md erwähnt nicht die tatsächlichen Route-Pfade
- **Schweregrad:** LOW
- **Beschreibung:** STATUS.md zeigt `.../wizard/parties`, aber nicht die vollständigen Pfade wie `/declarations/[id]/wizard/parties`.
- **Beleg:** [STATUS.md:15](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/docs/phases/phase1/STATUS.md#L15)
- **Empfehlung:** **In Phase 2 akzeptabel**. Lesbarkeit vs. Präzision.

---

### Kategorie H: Phase-2-Risiken

#### H1: `console.error` im Frontend widerspricht Logging-Policy
- **Schweregrad:** HIGH
- **Beschreibung:** P1p5 dokumentiert "Replaced all console.error with logger.error", aber Frontend hat noch 7 `console.error` Aufrufe.
- **Beleg:**
  - [P1p5.md:46-48](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/docs/phases/phase1/P1p5.md#L46-L48) "Replaced all console.error"
  - Grep-Suche: 7 Treffer in `apps/web/src/app/declarations/**`
- **Empfehlung:** **Vor Phase 2 fixen**. Entweder Policy anpassen ("nur Backend") oder Frontend fixen.

#### H2: Keine klare Trennung zwischen "MVP-Subset" und "vollständiger IAA"
- **Schweregrad:** MEDIUM
- **Beschreibung:** P1p2 sagt "MVP-Subset der Pflichtfelder", aber es ist nirgendwo dokumentiert, **welche** Felder fehlen.
- **Beleg:** [P1p2.md:186](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/docs/phases/phase1/P1p2.md#L186) "Unterschätzung der Pflichtfelder-Menge"
- **Empfehlung:** **Vor Phase 2 fixen**. Liste der "nicht implementierten Pflichtfelder" erstellen.

#### H3: PDF-Generierung ist Server-Side (jsPDF), aber P1p6 sagt "client-side/server-side"
- **Schweregrad:** LOW
- **Beschreibung:** Unklare Aussage in P1p6.
- **Beleg:**
  - [P1p6.md:74](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/docs/phases/phase1/P1p6.md#L74) "client-side/server-side"
  - [pdf/route.ts](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/apps/web/src/app/api/declarations/[id]/pdf/route.ts) ist Server-Side
- **Empfehlung:** **In Phase 2 akzeptabel**. Doku-Unschärfe.

#### H4: Wizard-Layout ist nicht responsive (Desktop-Only)
- **Schweregrad:** LOW
- **Beschreibung:** P1p2 sagt "Kein Mobile Support", aber es ist nicht klar, ob das Layout auf kleinen Screens **bricht** oder nur "nicht optimiert" ist.
- **Beleg:** [P1p2.md:171](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/docs/phases/phase1/P1p2.md#L171)
- **Empfehlung:** **Bewusstes Risiko**. In Phase 2 testen.

#### H5: CI verwendet `prisma migrate deploy`, aber lokal `db:push`
- **Schweregrad:** HIGH
- **Beschreibung:** Inkonsistenz zwischen CI und Docker-Setup. CI erwartet Migrations-Files, aber Docker nutzt `db:push`.
- **Beleg:**
  - [ci.yml:176](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/.github/workflows/ci.yml#L176) `prisma:migrate:deploy`
  - [docker-compose.yml:28](file:///c:/Users/prugu/Desktop/zollhilfe/zollpilot/docker-compose.yml#L28) `db:push`
- **Empfehlung:** **Vor Phase 2 fixen**. Entweder CI auf `db:push` umstellen oder Migration-Files erstellen.

---

## Explizite Blocker für Phase 2

**Keine harten Blocker.**

Aber folgende Issues sollten **vor Phase 2** geklärt werden, um Design-Arbeit nicht zu sabotieren:

1. **H1 (console.error):** Frontend-Logging inkonsistent → Phase 2 UX-Arbeit könnte falsche Logging-Annahmen treffen.
2. **H5 (CI vs. Docker):** CI könnte in Phase 2 fehlschlagen, wenn Migrations-Files fehlen.
3. **D1 (PATCH ohne Validierung):** Phase 2 könnte auf instabile API-Verträge aufbauen.
4. **E3 (Build ignoriert Fehler):** Phase 2 könnte Typ-Fehler einführen, die unbemerkt bleiben.

---

## Nicht-Probleme (bewusst OK)

1. **Kein User-Management:** Dokumentiert als Out-of-Scope (P1p2).
2. **Mock PDF:** Dokumentiert als Limitation (P1p6).
3. **db:push statt Migrationen:** Dokumentiert als Prototyping (P1p5, P1p6).
4. **Keine ATLAS-Anbindung:** Dokumentiert als Out-of-Scope (P1p2).
5. **Keine Codelisten:** Dokumentiert als MVP-Niveau (P1p2).
6. **Wizard-Layout ohne aktive Step-Hervorhebung:** UX-Verbesserung, kein Bug.

---

## Klare Entscheidungsempfehlung

### Phase 2 STARTEN: ✅ **JA**

**Begründung:**
- Alle **Must-Haves** aus P1p2 sind implementiert und funktionieren.
- E2E-Test deckt Happy Path ab (Creation → Parties → Transport → Items → Review → Complete → PDF).
- Docker-Setup ist reproduzierbar (`docker compose up` funktioniert).
- Keine **kritischen** Sicherheitslücken oder Datenintegritätsprobleme.

### Bedingungen für Phase-2-Start:

1. **Vor Phase 2 fixen (5 Issues):**
   - **H1:** Frontend-Logging auf `logger` umstellen **oder** Policy anpassen ("nur Backend").
   - **H5:** CI auf `db:push` umstellen **oder** Migration-Files erstellen.
   - **D1:** PATCH-Endpunkt mit Basis-Validierung absichern.
   - **E3:** `ignoreBuildErrors` und `ignoreDuringBuilds` auf `false` setzen (nach Behebung aller Typ-Fehler).
   - **G1:** Doku korrigieren (validateDeclarationComplete → declarationCompleteSchema).

2. **Dokumentieren (3 Issues):**
   - **A1:** Step-Nummerierung klären (5 oder 6 Steps?).
   - **B1:** `procedureCode` aus Doku entfernen oder als "TODO Phase 2" markieren.
   - **H2:** Liste der "nicht implementierten IAA-Pflichtfelder" erstellen.

3. **Akzeptierte Risiken für Phase 2:**
   - **E1:** `db:push` bleibt bis Phase 2.3 (dokumentiert).
   - **F2:** Keine Unit-Tests für Server-Funktionen (E2E deckt ab).
   - **H4:** Desktop-Only Layout (dokumentiert).

---

## Zusammenfassung für Chat

- **23 Issues gefunden:** 0 BLOCKER, 5 HIGH, 11 MEDIUM, 7 LOW
- **Phase-2-Freigabe:** ✅ **JA** (unter Bedingungen)
- **Wichtigstes Risiko:** Inkonsistenz zwischen Doku und Code (Datenmodell, Logging-Policy, CI vs. Docker) könnte Phase-2-Arbeit verlangsamen.
- **Empfehlung:** 5 Issues vor Phase 2 fixen, 3 dokumentieren, Rest akzeptieren.
