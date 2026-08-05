"use client";

import { useState } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Booking = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  service?: string;
  staff?: string;
  date?: string;
  time?: string;
  notes?: string;
  status?: string;
};

type Props = {
  booking: Booking;
};

export default function BookingCard({ booking }: Props) {
  const [editing, setEditing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [form, setForm] = useState({
    name: booking.name,
    phone: booking.phone,
    email: booking.email ?? "",
    service: booking.service ?? "",
    date: booking.date ?? "",
    time: booking.time ?? "",
    notes: booking.notes ?? "",
  });

  const saveBooking = async () => {
    await updateDoc(doc(db, "bookings", booking.id), {
      ...form,
    });

    setEditing(false);
  };

  const completeBooking = async () => {
    await updateDoc(doc(db, "bookings", booking.id), {
      status: "Completed",
    });
  };

  const pendingBooking = async () => {
    await updateDoc(doc(db, "bookings", booking.id), {
      status: "Pending",
    });
  };

  const deleteBooking = async () => {
  await deleteDoc(doc(db, "bookings", booking.id));
  setShowDelete(false);
};

  const whatsapp = () => {
    const number = booking.phone.startsWith("0")
      ? "94" + booking.phone.substring(1)
      : booking.phone;

    const text = `Hello ${booking.name}

Your booking has been confirmed.

Service: ${booking.service ?? "-"}

Date: ${booking.date ?? "-"}

Time: ${booking.time ?? "-"}

Thank you.`;

    window.open(
      `https://wa.me/${number}?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

    
    return (
    <>
    {showDetails && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">

      <h2 className="text-2xl font-bold mb-5">
        Booking Details
      </h2>

      <div className="space-y-3 text-gray-700">

        <p><b>👤 Name:</b> {booking.name}</p>

        <p><b>📞 Phone:</b> {booking.phone}</p>

        {booking.email && (
          <p><b>📧 Email:</b> {booking.email}</p>
        )}

        {booking.service && (
          <p><b>💇 Service:</b> {booking.service}</p>
        )}

        {booking.staff && (
  <p>👩 Staff: {booking.staff}</p>
)}

        {booking.date && (
          <p><b>📅 Date:</b> {booking.date}</p>
        )}

        {booking.time && (
          <p><b>🕒 Time:</b> {booking.time}</p>
        )}

        {booking.notes && (
          <p><b>📝 Notes:</b> {booking.notes}</p>
        )}

      </div>

      <div className="flex justify-end mt-6">

        <button
          onClick={() => setShowDetails(false)}
          className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-lg"
        >
          Close
        </button>

      </div>

    </div>
  </div>
)}
      {editing && (
        
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-5">
              Edit Booking
            </h2>

            <div className="space-y-3">

              <input
                className="w-full border rounded-lg p-3"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="Customer Name"
              />

              <input
                className="w-full border rounded-lg p-3"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                placeholder="Phone"
              />

              <input
                className="w-full border rounded-lg p-3"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                placeholder="Email"
              />

              <input
                className="w-full border rounded-lg p-3"
                value={form.service}
                onChange={(e) =>
                  setForm({ ...form, service: e.target.value })
                }
                placeholder="Service"
              />

              <input
                type="date"
                className="w-full border rounded-lg p-3"
                value={form.date}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
              />

              <input
                type="time"
                className="w-full border rounded-lg p-3"
                value={form.time}
                onChange={(e) =>
                  setForm({ ...form, time: e.target.value })
                }
              />

              <textarea
                className="w-full border rounded-lg p-3"
                rows={3}
                value={form.notes}
                onChange={(e) =>
                  setForm({ ...form, notes: e.target.value })
                }
                placeholder="Notes"
              />
              

            </div>
            
            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setEditing(false)}
                className="px-5 py-2 rounded-lg bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={saveBooking}
                className="px-5 py-2 rounded-lg bg-pink-600 text-white"
              >
                Save
              </button>

            </div>

          </div>
        </div>
      )}
      {showDelete && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

      <div className="text-center">

        <div className="text-6xl mb-3">🗑</div>

        <h2 className="text-2xl font-bold text-gray-800">
          Delete Booking
        </h2>

        <p className="text-gray-500 mt-3">
          Are you sure you want to delete
          <br />
          <span className="font-semibold text-red-600">
            {booking.name}
          </span>
          ?
        </p>

      </div>

      <div className="flex justify-end gap-3 mt-8">

        <button
          onClick={() => setShowDelete(false)}
          className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
        >
          Cancel
        </button>

        <button
          onClick={deleteBooking}
          className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
        >
          Delete
        </button>

      </div>

    </div>
  </div>
)}

      <div
        className={`rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-l-8 ${
          booking.status === "Completed"
            ? "border-green-500 bg-green-50"
            : "border-yellow-500 bg-white"
        }`}
      >
        <div className="flex flex-col md:flex-row md:justify-between gap-6">

          <div className="flex-1">

            <h2 className="text-2xl font-bold text-gray-800">
              {booking.name}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 text-gray-700">

              <p>📞 {booking.phone}</p>

              {booking.email && <p>📧 {booking.email}</p>}

              {booking.service && <p>💇 {booking.service}</p>}

              {booking.date && <p>📅 {booking.date}</p>}

              {booking.time && <p>🕒 {booking.time}</p>}

              {booking.notes && <p>📝 {booking.notes}</p>}

            </div>

          </div>

          <div className="flex flex-col items-end">

            <span
              className={`px-4 py-2 rounded-full text-white font-semibold ${
                booking.status === "Completed"
                  ? "bg-green-600"
                  : "bg-yellow-500"
              }`}
            >
              {booking.status === "Completed"
                ? "Completed"
                : "Pending"}
            </span>

          </div>

        </div>

        <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t">
                    <button
            onClick={whatsapp}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
          >
            💬 WhatsApp
          </button>

          <button
  onClick={() => setShowDetails(true)}
  className="bg-gray-700 hover:bg-black text-white px-5 py-2 rounded-lg"
>
  👁 View
</button>

          {booking.status === "Completed" ? (
            <button
              onClick={pendingBooking}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg"
            >
              🔄 Pending
            </button>
          ) : (
            <button
              onClick={completeBooking}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
              ✅ Complete
            </button>
          )}

          <button
            onClick={() => setEditing(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg"
          >
            ✏️ Edit
          </button>

          <button
            onClick={() => setShowDelete(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
          >
            🗑 Delete
          </button>

        </div>
      </div>
    </>
  );
}