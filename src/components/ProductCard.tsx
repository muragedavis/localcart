'use client';

import Image from 'next/image';
import { useFormatPrice } from '@/lib/settings-context';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category_name: string;
  stock_quantity?: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const formatPrice = useFormatPrice();
  const inStock = product.stock_quantity === undefined || product.stock_quantity > 0;

  return (
    <div className="bg-white group flex flex-col overflow-hidden border border-gray-100 hover:border-gray-300 hover:shadow-xl transition-all duration-300">
      {/* Image */}
      <div className="relative w-full h-60 bg-[#f5f5f5] overflow-hidden shrink-0">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-200">
            <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {product.category_name && (
          <span className="absolute top-3 left-3 px-2 py-1 text-[9px] font-black tracking-widest uppercase bg-white text-gray-700">
            {product.category_name}
          </span>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <span className="text-xs font-black tracking-widest uppercase text-gray-400 border border-gray-300 px-3 py-1.5">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-[9px] font-black tracking-[0.25em] uppercase text-gray-400 mb-1">{product.category_name || 'Product'}</p>
        <h3 className="font-black text-gray-900 text-sm uppercase tracking-tight leading-snug mb-2 line-clamp-1">{product.name}</h3>
        {product.description && (
          <p className="text-gray-400 text-xs mb-4 line-clamp-2 flex-1 leading-relaxed">{product.description}</p>
        )}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <span className="text-lg font-black text-gray-900 tracking-tight">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            disabled={!inStock}
            className="text-[10px] font-black tracking-widest uppercase px-4 py-2 text-white transition-all duration-200 hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {inStock ? 'Add to Cart' : 'Sold Out'}
          </button>
        </div>
      </div>
    </div>
  );
}
