import { NextRequest, NextResponse } from 'next/server';
const pool = require('@/database/connection');
import { withAdminAuth } from '@/lib/middleware';
import { getSiteSettings } from '@/lib/settings';

async function handleGET(req: NextRequest, user: any) {
  try {
    const settings = await getSiteSettings();
    
    // Get sales overview
    const salesResult = await pool.query(`
      SELECT 
        COUNT(o.id) as total_orders,
        SUM(o.total_amount) as total_revenue,
        COUNT(DISTINCT o.user_id) as total_customers,
        COUNT(CASE WHEN o.created_at > NOW() - INTERVAL '30 days' THEN 1 END) as orders_last_30_days
      FROM orders o
      WHERE o.order_status != 'cancelled'
    `);

    // Get top products
    const topProductsResult = await pool.query(`
      SELECT 
        p.id, p.name, SUM(oi.quantity) as total_sold,
        SUM(oi.quantity * oi.unit_price) as revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      GROUP BY p.id, p.name
      ORDER BY total_sold DESC
      LIMIT 5
    `);

    // Get low stock products
    const lowStockResult = await pool.query(`
      SELECT id, name, stock_quantity
      FROM products
      WHERE stock_quantity < 10
      ORDER BY stock_quantity ASC
    `);

    const sales = salesResult.rows[0];
    const topProducts = topProductsResult.rows;
    const lowStockProducts = lowStockResult.rows;

    return NextResponse.json({
      success: true,
      data: {
        sales,
        topProducts,
        lowStockProducts,
        currency: {
          code: settings.currency_code,
          symbol: settings.currency_symbol,
          position: settings.currency_position,
        },
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return withAdminAuth(req, handleGET);
}
