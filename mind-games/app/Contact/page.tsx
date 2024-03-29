"use client";

import React, { useState } from "react";
import Map from "../../components/Map";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    text: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    toast.success("Mesaj gönderildi");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col items-center py-4">
      <div className="flex md:flex-row sm:flex-col gap-4 justify-center items-center w-full md:gap-8 my-12 md:px-12 sm:px-4">
        <div className="md:w-1/2 md:mr-6 flex flex-col items-start">
          <h2 className="text-3xl font-bold mb-4 underline">
            İletişim Bilgileri
          </h2>
          <p>Adres: Ardıçlı Mah. Rauf Orbay Cad. 42250, Selçuklu/KONYA</p>
          <p>Telefon: 0(332) 205 15 00</p>
          <p>E-posta: muhendislik@ktun.edu.tr</p>

          <h2 className="text-3xl font-bold my-4 underline">İletişim Formu</h2>
          <form onSubmit={handleSubmit} className="flex justify-center w-full flex-col gap-2">
            <div className="flex flex-col md:flex-row md:gap-4">
              <div className="flex-1">
                <label htmlFor="firstName">Ad</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full py-2 px-2 rounded-md"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="lastName">Soyad</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full py-2 px-2 rounded-md"
                />
              </div>
            </div>

            <label htmlFor="username">Kullanıcı Adı</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full py-2 px-2 rounded-md"
            />

            <label htmlFor="email">E-posta</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full py-2 px-2 rounded-md"
            />

            <label htmlFor="text">Mesaj</label>
            <input
              type="text"
              id="text"
              name="text"
              value={formData.text}
              onChange={handleChange}
              required
              className="w-full text-start h-20 px-2 rounded-md"
            />

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Gönder
            </button>
          </form>
        </div>
        <Map width="100%" height="500px" lat={38.0268432} lng={32.5101583} />
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default ContactPage;
