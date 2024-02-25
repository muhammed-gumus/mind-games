"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Product {
  productName: string;
  productDescription: string;
  productImages: string[];
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/productsGet");
        const data = await response.json();

        const receivedProducts = data.products || data;

        if (Array.isArray(receivedProducts)) {
          // Dosya yollarını istediğiniz formata dönüştür
          const transformedProducts = receivedProducts.map((product) => ({
            ...product,
            productImages: product.productImages.map((image: string) =>
              image.replace("../public", "")
            ),
          }));

          setProducts(transformedProducts);
        } else {
          console.error("Ürünler bir dizi içermiyor:", receivedProducts);
        }
      } catch (error) {
        console.error("Ürünleri getirirken hata oluştu:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center w-full">
      <h1 className="font-extrabold text-6xl mt-8">Ürün Listesi</h1>
      <div className="grid grid-cols-4 gap-8 px-24 mt-8 mb-16">
        {products.map((product, index) => (
          <div
            key={index}
            className="flex rounded-md bg-white flex-col items-center"
          >
            {/* Ürün Resmi */}
            {product.productImages.length > 0 && (
              <img
                className="w-full rounded-t-md"
                style={{ maxHeight: "250px" }} // Resmin maksimum yüksekliğini belirle
                src={product.productImages[0]} // Görsel yolu burada kullanılıyor
                alt={`Ürün Resmi ${index}`}
              />
            )}
            <div className="flex flex-col items-center gap-2 mb-4 text-center mt-2">
              {/* Ürün Adı */}
              <h3 className="text-black font-bold text-2xl ">
                {product.productName}
              </h3>

              {/* Ürün Açıklaması */}
              <p className="text-gray-600 line-clamp-3 px-4">
                {product.productDescription}
              </p>
            </div>
            {/* Ürün Detay Linki */}
            <div className="flex mt-auto w-full">
              <Link href="#" className="w-full">
                <button className="bg-green-600 text-white px-6 py-4 w-full">
                  Satın Al
                </button>
              </Link>
              <Link href="#" className="w-full">
                <button className="bg-blue-500 text-white px-6 py-4 w-full">
                  Detay
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
