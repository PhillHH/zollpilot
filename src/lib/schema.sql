-- PostgreSQL table definition for ZollFeld entries.
CREATE TABLE IF NOT EXISTS public."ZollFeld" (
  feld_id TEXT PRIMARY KEY,
  feld_name_de TEXT NOT NULL,
  erklaerung_de TEXT NOT NULL,
  erklaerung_en TEXT NOT NULL,
  validierungs_regeln TEXT NOT NULL
);

-- Seed example data (first 5 fields of a standard Importanmeldung).
INSERT INTO public."ZollFeld" (feld_id, feld_name_de, erklaerung_de, erklaerung_en, validierungs_regeln)
VALUES
  ('02_VERSENDER', 'Versender / Absender',
   'Name und Anschrift des Versenders, wie auf der Handelsrechnung angegeben. Nutze die vollständige Firmenbezeichnung mit Straße, PLZ und Ort.',
   'Name and address of the consignor as shown on the commercial invoice. Provide the full legal name, street, postal code, and city.',
   'Pflichtfeld; Freitext, max. 70 Zeichen pro Zeile.'),
  ('08_EMPFÄNGER', 'Empfänger',
   'Name und Anschrift des Empfängers in der EU. Bei Eigenimport deine eigenen Kontaktdaten angeben.',
   'Name and address of the consignee in the EU. For self-imports, use your own contact details.',
   'Pflichtfeld; Freitext, max. 70 Zeichen pro Zeile.'),
  ('31_PACKSTÜCKE', 'Anzahl und Art der Packstücke',
   'Gesamtanzahl der Packstücke und eine kurze Beschreibung der Verpackungsart (z. B. 3 Kartons, 1 Palette).',
   'Total number of packages and a short description of packaging type (e.g., 3 cartons, 1 pallet).',
   'Numerisch für Anzahl; Beschreibung Freitext, max. 50 Zeichen.'),
  ('33_WARENNUMMER', 'Warennummer (HS-Code)',
   '8-stellige Codenummer der Ware nach Zolltarif. Finde sie im Elektronischen Zolltarif (EZT) oder über den Lieferanten.',
   '8-digit customs tariff code (HS code) of the goods. Look it up in the electronic customs tariff or ask the supplier.',
   'Genau 8 Ziffern; keine Buchstaben; Pflichtfeld.'),
  ('42_RECHNUNGSBETRAG', 'Rechnungsbetrag',
   'Gesamtwert der Ware laut Handelsrechnung ohne getrennte Angabe der Umsatzsteuer. Währung bitte angeben.',
   'Total value of the goods per commercial invoice, excluding VAT lines. Include the currency.',
   'Numerisch; zwei Dezimalstellen; Währungscode (z. B. EUR, USD).')
ON CONFLICT (feld_id) DO NOTHING;

