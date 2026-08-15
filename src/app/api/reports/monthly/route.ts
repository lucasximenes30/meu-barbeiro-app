import { NextRequest, NextResponse } from 'next/server';
import { getAuthBarbershopId } from '@/lib/auth-server';
import { ReportsService } from '@/modules/reports/reports.service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const barbershopId = await getAuthBarbershopId(req);
    const { searchParams } = new URL(req.url);
    const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1));
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));

    const reportsService = new ReportsService();
    const report = await reportsService.getMonthlyReport(barbershopId, month, year);

    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    console.error('Error in monthly report API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate report' },
      { status: 500 }
    );
  }
}
