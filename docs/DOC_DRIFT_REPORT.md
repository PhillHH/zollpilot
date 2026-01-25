# ZollPilot Doc-Drift Report

**Stand:** 2026-01-25 | **Audit durchgeführt von:** Claude (Opus 4.5)

## Übersicht

Dieser Report dokumentiert Inkonsistenzen zwischen Dokumentation und Code/Konfiguration.

**Regel:** Code/Config/Migrationen sind Source of Truth.

| Schwere | Anzahl |
|---------|--------|
| Kritisch | 1 |
| Hoch | 3 |
| Mittel | 4 |
| Info | 2 |

## Kritisch

### 1. Prisma-Migrationen fehlen im Repository

**Dokumentation behauptet:** `SETUP.md` beschreibt `pnpm prisma:migrate` als Teil des Setup-Prozesses.

**Code/Realität:** Keine `apps/web/prisma/migrations/` Verzeichnis oder Dateien vorhanden.

**Fundstellen:**
- `docs/SETUP.md:50` - "Run database migrations"
- `apps/web/prisma/` - Kein migrations-Verzeichnis

**Impact:** Erstinstallation funktioniert nicht ohne manuelles `prisma migrate dev`.

**Next Step:** `pnpm prisma:migrate` ausführen und Migrationen committen.

---

## Hoch

### 2. Phase-Angaben inkonsistent

**Dokumentation:**
- `README.md:11` - "Phase: 0.9.2"
- `USER_MANUAL.md:20` - "Phase 0.6"
- `ADMIN_MANUAL.md:11` - "Phase 0.4"

**Realität:** Projekt ist tatsächlich in Phase 0.9.2.

**Impact:** Verwirrung über aktuellen Projektstand.

**Next Step:** Alle Phase-Referenzen auf 0.9.2 aktualisieren.

---

### 3. scripts-Verzeichnis im README referenziert, existiert nicht

**Dokumentation:** `README.md:59` - "scripts/ - Build and utility scripts"

**Realität:** Kein `/scripts` Verzeichnis auf Root-Ebene. Nur `apps/web/scripts/`.

**Fundstellen:**
- `README.md:59`

**Impact:** Irreführende Repo-Struktur-Dokumentation.

**Next Step:** README anpassen oder Verzeichnis erstellen.

---

### 4. VS Code Extensions referenziert, existiert nicht

**Dokumentation:** `SETUP.md:29` - ".vscode/extensions.json - TBD"

**Realität:** Kein `.vscode` Verzeichnis vorhanden.

**Impact:** Empfohlene Editor-Konfiguration fehlt.

**Next Step:** `.vscode/extensions.json` erstellen oder Referenz entfernen.

---

## Mittel

### 5. ADR-Verzeichnis referenziert, existiert nicht

**Dokumentation:** `CONTRIBUTING.md:954-970` beschreibt ADR-Format in `docs/adr/`.

**Realität:** Kein `docs/adr/` Verzeichnis vorhanden.

**Impact:** ADR-Prozess nicht eingehalten.

**Next Step:** Verzeichnis erstellen oder auf DECISIONS.md verweisen.

---

### 6. CHANGELOG.md referenziert, existiert nicht

**Dokumentation:** `POLICIES.md:329` - "Keep CHANGELOG.md current"

**Realität:** Keine `CHANGELOG.md` Datei vorhanden.

**Impact:** Änderungsverlauf nicht dokumentiert.

**Next Step:** CHANGELOG.md erstellen oder Referenz entfernen.

---

### 7. pnpm docs:check ist Stub

**Dokumentation:** `README.md:165` und `CONTRIBUTING.md:164` beschreiben `pnpm docs:check`.

**Realität:** `package.json:27` - `"docs:check": "echo 'Doc drift check - TBD in Phase 0.10'"`

**Impact:** Dokumentations-Drift wird nicht automatisch erkannt.

**Next Step:** In Phase 0.10 implementieren.

---

### 8. Audit-Log-Retention nicht definiert

**Dokumentation:** `POLICIES.md:156` - "Retention: TBD (minimum 2 years recommended)"

**Realität:** Keine Retention-Policy implementiert.

**Impact:** Compliance-Risiko.

**Next Step:** Retention-Policy definieren und implementieren.

---

## Info

### 9. Technologie-Versionen könnten veralten

**Dokumentation:** Verschiedene Stellen listen spezifische Versionen.

**Realität:** Versionen in package.json sind aktuell.

**Impact:** Keine unmittelbare Auswirkung, aber bei Updates aktualisieren.

**Betroffene Stellen:**
- `README.md:31` - pnpm 9.15.2
- `ARCHITECTURE.md` - Technologie-Stack

**Next Step:** Bei Dependency-Updates auch Docs aktualisieren.

---

### 10. TBD-Marker in Dokumentation

**Dokumentation:** Viele "TBD" Platzhalter in bestehender Doku.

**Fundstellen (Auswahl):**
- `ARCHITECTURE.md:25` - "System Architecture: TBD"
- `ARCHITECTURE.md:211` - "Security Architecture: TBD"
- `SECURITY.md:8` - "[TBD - Internal security team contact]"

**Impact:** Doku ist unvollständig.

**Next Step:** TBDs bei Implementierung auflösen.

---

## Doc-Drift-Matrix

| Dokument | Code-Konsistenz | Vollständigkeit |
|----------|-----------------|-----------------|
| README.md | ⚠️ | ✅ |
| SECURITY.md | ✅ | ⚠️ TBDs |
| ARCHITECTURE.md | ⚠️ | ⚠️ TBDs |
| SETUP.md | ⚠️ | ✅ |
| CONTRIBUTING.md | ⚠️ | ✅ |
| POLICIES.md | ⚠️ | ✅ |
| USER_MANUAL.md | ⚠️ Phase | ⚠️ |
| ADMIN_MANUAL.md | ⚠️ Phase | ⚠️ |

---

**Letzte Aktualisierung:** 2026-01-25
