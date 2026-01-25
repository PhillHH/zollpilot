import Link from 'next/link';

const steps = [
  { id: 'parties', label: 'Beteiligte', number: 2 },
  { id: 'transport', label: 'Transport', number: 3 },
  { id: 'items', label: 'Waren', number: 4 },
  { id: 'review', label: 'Abschluss', number: 5 },
];

export default function WizardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r p-6">
        <h2 className="font-bold text-lg mb-6 text-gray-800">IAA Assistent</h2>
        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center text-sm">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold ${
                   'bg-blue-100 text-blue-600'
                   // Highlighting logic handled in page or just generic here
                }`}
              >
                {step.number}
              </div>
              <span className="text-gray-700">{step.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-8 border-t">
          <Link
            href="/declarations"
            className="text-gray-500 hover:text-gray-900 text-sm"
          >
            ← Zurück zur Übersicht
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow-sm">
          {children}
        </div>
      </main>
    </div>
  );
}
