import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';

export const withAuth = async (
  req: NextRequest,
  handler: (req: NextRequest, user: any) => Promise<NextResponse>
) => {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    return handler(req, decoded);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
};

export const withAdminAuth = async (
  req: NextRequest,
  handler: (req: NextRequest, user: any) => Promise<NextResponse>
) => {
  return withAuth(req, async (req, user) => {
    if (user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }
    return handler(req, user);
  });
};
