import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // TODO: Get user from Supabase session
    // TODO: Query membership from database

    // For now, return mock response
    const mockMembership = {
      isMember: false,
      expiresAt: null,
      daysRemaining: 0,
    };

    return NextResponse.json(mockMembership);
  } catch (error) {
    console.error('Membership check error:', error);
    return NextResponse.json(
      { error: 'Failed to check membership' },
      { status: 500 }
    );
  }
}
