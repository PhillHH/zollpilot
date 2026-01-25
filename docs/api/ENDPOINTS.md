# ZollPilot API Endpunkte

**Stand:** 2026-01-25 | **Phase:** 0.9.2

## Endpunkt-Inventar

| Methode | Route | Auth | Status | Beschreibung |
|---------|-------|------|--------|--------------|
| GET | `/api/health` | Nein | Aktiv | Health-Check für Monitoring |

**Gesamt:** 1 Endpunkt

---

## Detaillierte Endpunkt-Dokumentation

### GET /api/health

Health-Check-Endpunkt zur Überprüfung der Systemverfügbarkeit.

#### Übersicht

| Eigenschaft | Wert |
|-------------|------|
| **Pfad** | `/api/health` |
| **Methode** | GET |
| **Authentifizierung** | Keine |
| **Rate Limit** | Nein |
| **Caching** | Nein |

#### Quelldatei

`apps/web/src/app/api/health/route.ts`

```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ status: 'ok' })
}
```

#### Request

**Headers:**
```
Accept: application/json
```

**Body:** Keiner

**Query Parameters:** Keine

#### Response

**Erfolg (200 OK):**

```json
{
  "status": "ok"
}
```

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `status` | string | Immer `"ok"` bei Erfolg |

#### Error Codes

| HTTP Status | Ursache |
|-------------|---------|
| 500 | Interner Serverfehler |

**GAP:** Keine detaillierte Fehlerbehandlung implementiert.

#### Beispiel-Aufruf

**cURL:**
```bash
curl -X GET http://localhost:3000/api/health \
  -H "Accept: application/json"
```

**Response:**
```json
{"status":"ok"}
```

#### Tests

**Unit Test:** `apps/web/src/app/api/health/route.test.ts`

```typescript
describe('Health API Route', () => {
  it('should return status ok', async () => {
    const response = await GET()
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json).toEqual({ status: 'ok' })
  })
})
```

**E2E Test:** `apps/web/e2e/health.e2e.spec.ts`

```typescript
test('should return health status', async ({ request }) => {
  const response = await request.get('/api/health')
  expect(response.ok()).toBeTruthy()
  expect(await response.json()).toHaveProperty('status', 'ok')
})
```

#### Side Effects

Keine

#### Verwendung

- Monitoring-Systeme (Uptime-Checks)
- Load Balancer Health-Probes
- Kubernetes Liveness/Readiness Probes (geplant)

---

## Geplante Endpunkte (Phase 2+)

Die folgenden Endpunkte sind aus der Dokumentation und dem Schema abgeleitet, aber noch nicht implementiert:

### Tenant-Management (Admin)

| Methode | Route | Auth | Beschreibung |
|---------|-------|------|--------------|
| GET | `/api/v1/tenants` | Admin | Liste aller Tenants |
| GET | `/api/v1/tenants/{id}` | Admin | Tenant-Details |
| POST | `/api/v1/tenants` | Admin | Neuen Tenant erstellen |
| PATCH | `/api/v1/tenants/{id}` | Admin | Tenant aktualisieren |

### User-Management (Admin)

| Methode | Route | Auth | Beschreibung |
|---------|-------|------|--------------|
| GET | `/api/v1/users` | Admin | Liste aller Users im Tenant |
| GET | `/api/v1/users/{id}` | Admin | User-Details |
| POST | `/api/v1/users` | Admin | Neuen User erstellen |
| PATCH | `/api/v1/users/{id}` | Admin | User aktualisieren |
| DELETE | `/api/v1/users/{id}` | Admin | User löschen |

### Audit-Trail (Admin)

| Methode | Route | Auth | Beschreibung |
|---------|-------|------|--------------|
| GET | `/api/v1/audit-events` | Admin | Audit-Events abrufen |
| GET | `/api/v1/audit-events/{id}` | Admin | Einzelnes Event |

### Authentifizierung

| Methode | Route | Auth | Beschreibung |
|---------|-------|------|--------------|
| POST | `/api/v1/auth/login` | Nein | Anmeldung |
| POST | `/api/v1/auth/logout` | Ja | Abmeldung |
| GET | `/api/v1/auth/me` | Ja | Aktueller User |

---

## Endpunkt-Checkliste für neue Endpunkte

Bei Implementierung neuer Endpunkte sicherstellen:

- [ ] Route in `src/app/api/` erstellt
- [ ] Input-Validierung implementiert
- [ ] Authentifizierung/Autorisierung geprüft
- [ ] Audit-Event generiert (für Admin-Aktionen)
- [ ] Unit Tests geschrieben
- [ ] E2E Tests geschrieben
- [ ] Dokumentation in ENDPOINTS.md ergänzt
- [ ] Error-Handling implementiert
- [ ] Rate Limiting konfiguriert (wenn nötig)

---

**Letzte Aktualisierung:** 2026-01-25
