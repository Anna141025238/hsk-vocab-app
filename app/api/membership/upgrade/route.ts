import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount } = body;

    if (!amount || amount !== 9900) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // TODO: Create actual Omise/Opn payment charge
    // For now, return a mock charge ID
    const chargeId = `charge_${Date.now()}`;

    return NextResponse.json({
      success: true,
      chargeId,
      amount,
      currency: 'THB',
      // In production, this would be the real QR code URL from Omise
      qrUrl: 'https://via.placeholder.com/300x300?text=PromptPay+QR',
    });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}
