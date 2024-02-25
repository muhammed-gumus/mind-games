"use client";
import React, { useState, useEffect, useRef } from "react";
import Login from "@/components/AdminLogin";

interface Product {
  productId: string;
  productName: string;
  // Diğer ürün alanları
}

const Admin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [clearForm, setClearForm] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/productsGet");

        if (response.ok) {
          const responseData = await response.json();
          setProducts(responseData.products);
        } else {
          console.error("Ürünleri getirirken hata oluştu");
        }
      } catch (error) {
        console.error("Ürünleri getirirken hata oluştu:", error);
      }
    };

    fetchProducts();
  }, []);

  const [productName, setProductName] = useState("");
  const [productImages, setProductImages] = useState<FileList | null>(null);
  const [productDescription, setProductDescription] = useState("");
  const [usageInstructions, setUsageInstructions] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.files.length > 5) {
        alert("En fazla 5 resim yükleyebilirsiniz.");
        return;
      }
      setProductImages(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("productDescription", productDescription);
    formData.append("usageInstructions", usageInstructions);

    if (productImages) {
      for (let i = 0; i < productImages.length; i++) {
        formData.append("productImages", productImages[i]);
      }
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/products", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Ürün başarıyla eklendi:", responseData);

        // Add the new product to the state with the generated productId
        setProducts((prevProducts) => [
          ...prevProducts,
          { productId: responseData.productId, productName /* other fields */ },
        ]);

        setClearForm(true);
      } else {
        const errorData = await response.json();
        console.error("Ürün eklenirken hata oluştu:", errorData.detail);
      }
    } catch (error) {
      console.error("Ürün eklenirken hata oluştu:", error);
    }
  };

  const handleClearForm: React.MouseEventHandler<HTMLButtonElement> = () => {
    setProductName("");
    setProductImages(null);
    setProductDescription("");
    setUsageInstructions("");

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }

    setClearForm(false);
  };

  useEffect(() => {
    if (clearForm) {
      setProductName("");
      setProductImages(null);
      setProductDescription("");
      setUsageInstructions("");
      setClearForm(false);
    }
  }, [clearForm]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
  };

  const toggleProductSelection = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleDeleteSelectedProducts = async () => {
    try {
      for (const productId of selectedProducts) {
        const response = await fetch(
          `http://127.0.0.1:8000/products/${productId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          const responseData = await response.json();
          console.log("Ürün başarıyla silindi:", responseData);
        } else {
          const errorData = await response.json();
          console.error("Ürün silinirken hata oluştu:", errorData.detail);
        }
      }

      // Seçili ürünleri listeden kaldır
      const updatedProducts = products.filter(
        (product) => !selectedProducts.includes(product.productId)
      );
      setProducts(updatedProducts);
      setSelectedProducts([]);
    } catch (error) {
      console.error("Ürün silinirken hata oluştu:", error);
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-md shadow-md text-black">
        <h1 className="text-2xl font-bold mb-4">Yönetici Paneli</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Ürün Adı:
            </label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-md"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Ürün Resimleri (en fazla 5):
            </label>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              ref={imageInputRef}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Ürün Açıklaması:
            </label>
            <textarea
              className="mt-1 p-2 w-full border rounded-md"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Kullanım Talimatları:
            </label>
            <textarea
              className="mt-1 p-2 w-full border rounded-md"
              value={usageInstructions}
              onChange={(e) => setUsageInstructions(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Ürün Ekle
          </button>

          <ul>
            {products.map((product) => (
              <li key={product.productId}>
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.productId)}
                  onChange={() => toggleProductSelection(product.productId)}
                />
                {product.productName}
              </li>
            ))}
          </ul>

          <button
            onClick={handleDeleteSelectedProducts}
            disabled={selectedProducts.length === 0}
            className="bg-red-500 text-white py-2 px-4 rounded-md mt-4 hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300"
          >
            Seçili Ürünleri Sil
          </button>
          <button
            type="button"
            onClick={handleClearForm}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring focus:border-gray-200 ml-2"
          >
            Formu Temizle
          </button>
        </form>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded-md mt-4 hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300"
        >
          Çıkış Yap
        </button>
      </div>
    </div>
  );
};

export default Admin;
