# ZollPilot API Übersicht

**Stand:** 2026-01-25 | **Phase:** 0.9.2 | **Status:** Minimal (nur Health-Check)

## Inhaltsverzeichnis

- [Aktueller Status](#aktueller-status)
- [Base URL](#base-url)
- [Authentifizierung](#authentifizierung)
- [Request/Response Format](#requestresponse-format)
- [Fehlerformat](#fehlerformat)
- [API-Konventionen](#api-konventionen)
- [Verfügbare Endpunkte](#verfügbare-endpunkte)
- [Geplante API-Features](#geplante-api-features)

## Aktueller Status

| Aspekt | Status | Details |
|--------|--------|---------|
| Endpunkte | 1 | Nur `/api/health` implementiert |
| Authentifizierung | Keine | Geplant für Phase 2 |
| Rate Limiting | Nein | Geplant |
| Versioning | Nein | Geplant |
| OpenAPI/Swagger | Nein | Geplant |

**GAP:** Keine formale API-Spezifikation vorhanden. OpenAPI-Generierung sollte in Phase 1 implementiert werden.

## Base URL

| Environment | URL |
|-------------|-----|
| Development | `http://localhost:3000/api` |
| E2E Tests | `http://localhost:3100/api` |
| Production | TBD |

## Authentifizierung

**Aktueller Stand:** Keine Authentifizierung implementiert.

**Geplant für Phase 2:**
- Session-basierte Authentifizierung
- Bearer Token für API-Zugriff
- RBAC (Role-Based Access Control)

### Geplante Rollen (aus Schema abgeleitet)

| Rolle | Beschreibung |
|-------|--------------|
| `ADMIN` | Vollständiger Systemzugriff |
| `SUPPORT_ADMIN` | Benutzersupport, Read-only Logs |
| `CONFIG_ADMIN` | Preis- und Konfigurationsverwaltung |
| `VIEWER` | Nur-Lese-Zugriff |
| `USER` | Standard-Benutzerzugriff |

## Request/Response Format

### Content-Type

```
Content-Type: application/json
Accept: application/json
```

### Response-Struktur (empfohlen)

**Erfolg:**
```json
{
  "status": "ok",
  "data": { ... },
  "meta": {
    "timestamp": "2026-01-25T10:00:00.000Z",
    "requestId": "req-uuid"
  }
}
```

**Fehler:**
```json
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": { ... }
  },
  "meta": {
    "timestamp": "2026-01-25T10:00:00.000Z",
    "requestId": "req-uuid"
  }
}
```

**GAP:** Einheitliches Response-Format nicht implementiert. Aktueller Health-Check gibt nur `{ status: "ok" }` zurück.

## Fehlerformat

### Geplante HTTP-Statuscodes

| Code | Bedeutung | Verwendung |
|------|-----------|------------|
| 200 | OK | Erfolgreiche GET/PUT/PATCH |
| 201 | Created | Erfolgreiche POST (Ressource erstellt) |
| 204 | No Content | Erfolgreiche DELETE |
| 400 | Bad Request | Validierungsfehler |
| 401 | Unauthorized | Keine/ungültige Authentifizierung |
| 403 | Forbidden | Keine Berechtigung |
| 404 | Not Found | Ressource nicht gefunden |
| 409 | Conflict | Duplikat/Konflikt |
| 422 | Unprocessable Entity | Business-Logic-Fehler |
| 429 | Too Many Requests | Rate Limit überschritten |
| 500 | Internal Server Error | Serverfehler |

## API-Konventionen

### URL-Struktur (geplant)

```
/api/v1/{resource}                 # Collection
/api/v1/{resource}/{id}            # Single Resource
/api/v1/{resource}/{id}/{subresource}  # Nested Resource
```

### HTTP-Methoden

| Methode | Verwendung |
|---------|------------|
| GET | Ressource(n) abrufen |
| POST | Neue Ressource erstellen |
| PUT | Ressource vollständig ersetzen |
| PATCH | Ressource teilweise aktualisieren |
| DELETE | Ressource löschen |

### Pagination (geplant)

```
GET /api/v1/resources?page=1&limit=20
```

Response:
```json
{
  "data": [...],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

### Filtering (geplant)

```
GET /api/v1/resources?filter[status]=active&filter[createdAt][gte]=2026-01-01
```

### Sorting (geplant)

```
GET /api/v1/resources?sort=-createdAt,name
```

## Verfügbare Endpunkte

### GET /api/health

Health-Check-Endpunkt für Monitoring.

**Siehe:** [ENDPOINTS.md](./ENDPOINTS.md#get-apihealth)

## Geplante API-Features

### Phase 1 (geplant)

- [ ] OpenAPI/Swagger Dokumentation
- [ ] Request-ID Header für Tracing
- [ ] Einheitliches Fehlerformat
- [ ] Input-Validierung mit Zod

### Phase 2 (geplant)

- [ ] Authentifizierung (Sessions/JWT)
- [ ] Rate Limiting
- [ ] API Versioning (`/api/v1/...`)
- [ ] Admin-API-Endpunkte

### Zukünftige Phasen

- [ ] Webhook-Unterstützung
- [ ] GraphQL (alternativ zu REST)
- [ ] API-Key-basierte Authentifizierung

---

**Letzte Aktualisierung:** 2026-01-25
