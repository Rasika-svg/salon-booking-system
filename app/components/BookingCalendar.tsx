"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-calendar/dist/Calendar.css";

const Calendar = dynamic(() => import("react-calendar"), {
  ssr: false,
});

type Value = Date | null;

type Booking = {
  date?: string;
};

type Props = {
  bookings: Booking[];
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
};

export default function BookingCalendar({
  bookings,
  selectedDate,
  setSelectedDate,
}: Props) {
  const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
  setDate(new Date());
}, []);

    const [date, setDate] = useState<Value>(null);

  useEffect(() => {
  setDate(new Date());
}, []);

  if (!mounted) return null;  

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-pink-600 mb-4">
        Booking Calendar
      </h2>

      <Calendar
  onChange={(value) => {
  const d = value as Date;

  setDate(d);

  const formatted =
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  setSelectedDate(formatted);
}}
  value={date}
  tileContent={({ date, view }) => {
    if (view !== "month") return null;

    const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, "0");
const day = String(date.getDate()).padStart(2, "0");

const dateString = `${year}-${month}-${day}`;

    const hasBooking = bookings.some(
      (booking) => booking.date === dateString
    );

    return hasBooking ? (
      <div className="flex justify-center mt-1">
        <div className="w-2 h-2 rounded-full bg-pink-600"></div>
      </div>
    ) : null;
  }}
/>

      <p className="mt-4 text-gray-600">
        Selected Date:{" "}
        <strong>
          {date ? date.toDateString() : "No date selected"}
        </strong>
      </p>
    </div>
  );
}