type MultiLang = {
  de: string;
  en: string;
  pl?: string;
  tr?: string;
  es?: string;
};

export type ZollFeld = {
  feldId: string;
  feldNameDe: string;
  erklaerung: MultiLang;
  frage: MultiLang;
  beispiele?: MultiLang;
  validierungsRegeln: string;
};

export const zollfelder: ZollFeld[] = [
  {
    feldId: "08_EMPFÄNGER",
    feldNameDe: "08 Empfänger",
    frage: {
      de: "Wer bekommt die Ware in der EU?",
      en: "Who receives the goods in the EU?",
    },
    erklaerung: {
      de: [
        "Was ist das? Name und Anschrift des Empfängers in der EU.",
        "Woher? Steht auf der Handelsrechnung / Frachtbrief. Bei Eigenimport: deine eigenen Daten.",
        "Format? Vollständige Firma/Person mit Straße, Hausnummer, PLZ, Ort, Land.",
      ].join("\n"),
      en: [
        "What is this? Name and address of the consignee in the EU.",
        "Where to find it? On the commercial invoice / waybill. For self-import: your own details.",
        "Format? Full company/person incl. street, house number, postal code, city, country.",
      ].join("\n"),
    },
    beispiele: {
      de: "z. B. Max Mustermann GmbH, Musterstraße 12, 12345 Berlin",
      en: "e.g., Max Mustermann GmbH, Musterstr. 12, 12345 Berlin",
    },
    validierungsRegeln: "Pflichtfeld; Freitext, max. 70 Zeichen pro Zeile.",
  },
  {
    feldId: "20_LIEFERBEDINGUNG",
    feldNameDe: "20 Lieferbedingung (Incoterm)",
    frage: {
      de: "Welche Lieferbedingung (Incoterm) gilt?",
      en: "Which delivery term (Incoterm) applies?",
    },
    erklaerung: {
      de: "Der mit dem Lieferanten vereinbarte Incoterm, z. B. DAP, DDP oder FCA. Bestimmt, wer Kosten und Risiko trägt.",
      en: "The agreed Incoterm with the supplier, e.g., DAP, DDP, or FCA. Determines who bears cost and risk.",
    },
    beispiele: {
      de: "Beispiel: DAP Hamburg (Lieferant trägt Transport bis Hamburg, keine Verzollung)",
      en: "Example: DAP Hamburg (supplier pays transport to Hamburg, no customs clearance)",
    },
    validierungsRegeln: "3-stelliger Incoterm-Code + optional Ort; Pflichtfeld.",
  },
  {
    feldId: "37_VERFAHREN",
    feldNameDe: "37 Verfahren",
    frage: {
      de: "Welches Zollverfahren soll angewendet werden?",
      en: "Which customs procedure applies?",
    },
    erklaerung: {
      de: "Vierstelliger Verfahrenscode nach ATLAS, z. B. 4000 für Überlassung zum zollrechtlich freien Verkehr.",
      en: "Four-digit customs procedure code per ATLAS, e.g., 4000 for release for free circulation.",
    },
    beispiele: {
      de: "4000 (Überlassung), 4200 (Verbringung mit innergemeinschaftlicher Lieferung), 6120 (vorübergehende Verwendung)",
      en: "4000 (release), 4200 (import with intra-EU supply), 6120 (temporary admission)",
    },
    validierungsRegeln: "Genau 4 Ziffern; Pflichtfeld.",
  },
  {
    feldId: "33_WARENNUMMER",
    feldNameDe: "33 Warennummer (HS-Code)",
    frage: {
      de: "Wie lautet der 8-stellige HS-Code der Ware?",
      en: "What is the 8-digit HS code of the goods?",
    },
    erklaerung: {
      de: "8-stellige Codenummer der Ware nach Zolltarif. Finde sie im Elektronischen Zolltarif (EZT) oder über den Lieferanten.",
      en: "8-digit customs tariff code (HS code). Look it up in the electronic customs tariff or ask the supplier.",
    },
    beispiele: {
      de: "z. B. 85176200 für Router, 94036090 für Möbelteile",
      en: "e.g., 85176200 for routers, 94036090 for furniture parts",
    },
    validierungsRegeln: "Genau 8 Ziffern; keine Buchstaben; Pflichtfeld.",
  },
  {
    feldId: "42_RECHNUNGSBETRAG",
    feldNameDe: "42 Rechnungsbetrag",
    frage: {
      de: "Wie hoch ist der Rechnungsbetrag der Sendung?",
      en: "What is the invoice value of the shipment?",
    },
    erklaerung: {
      de: "Gesamtwert der Ware laut Handelsrechnung ohne getrennte Angabe der Umsatzsteuer. Währung bitte angeben.",
      en: "Total value of the goods per commercial invoice, excluding VAT lines. Include the currency.",
    },
    beispiele: {
      de: "10.500,00 EUR",
      en: "10,500.00 EUR",
    },
    validierungsRegeln: "Numerisch; zwei Dezimalstellen; Währungscode (z. B. EUR, USD).",
  },
];

