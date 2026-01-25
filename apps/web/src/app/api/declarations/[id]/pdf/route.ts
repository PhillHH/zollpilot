import { NextRequest, NextResponse } from 'next/server';
import { getDeclaration } from '@/server/declaration';
import { jsPDF } from 'jspdf';
import { logger } from '@/server/logger';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const declaration = await getDeclaration(params.id);
    if (!declaration) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    const doc = new jsPDF();
    const data = declaration.data as any;

    doc.setFontSize(20);
    doc.text('Ausfuhranmeldung (IAA) - Mock', 20, 20);

    doc.setFontSize(12);
    doc.text(`ID: ${declaration.id}`, 20, 30);
    doc.text(`Status: ${declaration.status}`, 20, 40);
    doc.text(`Datum: ${new Date(declaration.createdAt).toLocaleDateString()}`, 20, 50);

    doc.setFontSize(14);
    doc.text('Beteiligte:', 20, 70);
    doc.setFontSize(10);
    doc.text(`Versender: ${data.parties?.exporter?.name || '-'}`, 20, 80);
    doc.text(`Empfänger: ${data.parties?.recipient?.name || '-'}`, 20, 90);

    doc.setFontSize(14);
    doc.text('Transport:', 20, 110);
    doc.setFontSize(10);
    doc.text(`Mode: ${data.transport?.mode || '-'}`, 20, 120);
    doc.text(`ID: ${data.transport?.identity || '-'}`, 20, 130);

    doc.setFontSize(14);
    doc.text('Warenpositionen:', 20, 150);
    doc.setFontSize(10);

    let y = 160;
    declaration.items.forEach((item: any, index: number) => {
      const iData = item.data as any;
      doc.text(`${index + 1}. ${iData.description} (${iData.commodityCode})`, 20, y);
      doc.text(`   ${iData.grossMass}kg / ${iData.invoiceAmount?.value} ${iData.invoiceAmount?.currency}`, 20, y + 5);
      y += 15;
    });

    const pdfBuffer = doc.output('arraybuffer');

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="declaration-${params.id}.pdf"`,
      },
    });
  } catch (error) {
    logger.error({ scope: 'api.declarations.pdf', msg: 'Failed to generate PDF', error: error as Error });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
