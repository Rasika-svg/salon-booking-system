"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
export default function SettingsPage() {

    const [openingTime, setOpeningTime] = useState("");
const [closingTime, setClosingTime] = useState("");

useEffect(() => {
  const loadSettings = async () => {
    const snap = await getDoc(doc(db, "settings", "salon"));

    if (snap.exists()) {
      setOpeningTime(snap.data().openingTime);
      setClosingTime(snap.data().closingTime);
    }
  };

  loadSettings();
}, []);

const saveSettings = async () => {
  try {
    await updateDoc(doc(db, "settings", "salon"), {
      openingTime,
      closingTime,
    });

    alert("Settings Saved!");
  } catch (error) {
    console.error(error);
    alert("Error saving settings");
  }
};

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-pink-600 mb-6">
          Salon Settings
        </h1>

        <div className="grid gap-6">

                    <div className="border rounded-lg p-5">

  <h2 className="font-bold text-lg mb-4">
    Working Hours
  </h2>

  <div className="grid grid-cols-2 gap-4">

    <div>
      <label className="font-semibold">
        Opening Time
      </label>

      <input
        type="time"
        value={openingTime}
        onChange={(e) => setOpeningTime(e.target.value)}
        className="border w-full rounded-lg p-3 mt-2"
      />
    </div>

    <div>
      <label className="font-semibold">
        Closing Time
      </label>

      <input
        type="time"
        value={closingTime}
        onChange={(e) => setClosingTime(e.target.value)}
        className="border w-full rounded-lg p-3 mt-2"
      />
    </div>

  </div>

  <button
    onClick={saveSettings}
    className="bg-pink-600 text-white px-6 py-3 rounded-lg mt-6 hover:bg-pink-700"
  >
    Save Settings
  </button>

</div>

          <div className="border rounded-lg p-5">
            <h2 className="font-bold text-lg">
              Services
            </h2>

            <p className="text-gray-500 mt-2">
              Manage salon services.
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}