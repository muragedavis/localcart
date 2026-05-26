'use client';

import Image from 'next/image';
import { useFormatPrice } from '@/lib/settings-context';

interface Product {
  id: number; name: string; price: number; description: string;
  image_url: string; category_name: string; stock_quantity?: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const formatPrice = useFormatPrice();
  const inStock = product.stock_quantity === undefined || product.stock_quantity > 0;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 hover:border-gray-200 transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative w-full h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden shrink-0">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {product.category_name && (
          <span className="absolute top-3 left-3 badge badge-gray bg-white/90 backdrop-blur-sm shadow-sm">
            {product.category_name}
          </span>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-white/75 backdrop-blur-sm flex items-center justify-center">
            <span className="badge badge-gray text-xs shadow-sm bg-white">Sold out</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 mb-1.5 line-clamp-1 text-[15px]">{product.name}</h3>
        {product.description && (
          <p className="text-gray-400 text-xs mb-4 line-clamp-2 flex-1 leading-relaxed">{product.description}</p>
        )}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
          <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
          <button
            onClick={() => onAddToCart(product)}
            disabled={!inStock}
            className="btn-primary text-xs py-2 px-4 disabled:opacity-40 disabled:cursor-not-allowed disabled:!transform-none disabled:!shadow-none">
            {inStock ? 'Add to cart' : 'Sold out'}
          </button>
        </div>
      </div>
    </div>
  );
}
