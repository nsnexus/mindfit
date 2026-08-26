// ============================================
// API Health Check
// ============================================
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    app: 'metodo-21-dias',
    timestamp: new Date().toISOString(),
  });
}
