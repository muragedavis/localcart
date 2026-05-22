import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';

async function handlePOST(req: NextRequest, _user: any) {
  try {
    const { phone, amount } = await req.json();

    if (!phone || !amount) {
      return NextResponse.json(
        { success: false, error: 'Phone number and amount are required' },
        { status: 400 }
      );
    }

    const normalised = String(phone).replace(/\s+/g, '');
    if (!/^(254|0)[17]\d{8}$/.test(normalised)) {
      return NextResponse.json(
        { success: false, error: 'Enter a valid Safaricom number (07xx or 01xx)' },
        { status: 400 }
      );
    }

    // Simulate Daraja STK Push response
    const checkoutRequestId = `ws_CO_${Date.now()}_${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
    const merchantRequestId = `${Math.floor(Math.random() * 90000000) + 10000000}-${Math.floor(Math.random() * 900000) + 100000}`;

    return NextResponse.json({
      success: true,
      MerchantRequestID: merchantRequestId,
      CheckoutRequestID: checkoutRequestId,
      ResponseCode: '0',
      ResponseDescription: 'Success. Request accepted for processing',
      CustomerMessage: 'Success. Request accepted for processing',
    });
  } catch (error) {
    console.error('M-Pesa STK push error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return withAuth(req, handlePOST);
}
