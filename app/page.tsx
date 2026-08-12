"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

export default function Home() {
  const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];
  const [staff, setStaff] = useState<{ id: string; name: string }[]>([]);
  const [services, setServices] = useState<
  {
    id: string;
    name: string;
    price: number;
    duration: number;
  }[]
>([]);
  const [showSuccess, setShowSuccess] = useState(false);

const [bookingSummary, setBookingSummary] = useState({
  name: "",
  service: "",
  staff: "",
  date: "",
  time: "",
});
  const [selectedStaff, setSelectedStaff] = useState("");
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [date, setDate] = useState("");

  useEffect(() => {
  const servicesQuery = query(
    collection(db, "services"),
    where("active", "==", true),
    orderBy("name")
  );

  const unsubscribeServices = onSnapshot(
    servicesQuery,
    (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        price: doc.data().price,
        duration: doc.data().duration,
      }));

      setServices(list);
    }
  );

  return () => unsubscribeServices();
}, []);

  useEffect(() => {
  const staffQuery = query(
    collection(db, "staff"),
    where("active", "==", true),
    orderBy("name")
  );

  const unsubscribeStaff = onSnapshot(staffQuery, (snapshot) => {
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));

    setStaff(list);
  });

  return () => unsubscribeStaff();
}, []);

useEffect(() => {
  if (!date) {
    setBookedTimes([]);
    return;
  }

  const bookingQuery = query(
  collection(db, "bookings"),
  where("date", "==", date),
  where("staff", "==", selectedStaff)
);

  const unsubscribeBookings = onSnapshot(
    bookingQuery,
    (snapshot) => {
      const times = snapshot.docs.map(
        (doc) => doc.data().time as string
      );

      setBookedTimes(times);
    }
  );

  return () => unsubscribeBookings();


}, [date, selectedStaff]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  
  const [time, setTime] = useState("");

  const openingTime = "09:00";
const closingTime = "18:00";
  const [notes, setNotes] = useState("");
  
  const saveBooking = async () => {
  if (
  !name.trim() ||
  !phone.trim() ||
  !email.trim() ||
  !service.trim() ||
  !selectedStaff.trim() ||
  !date.trim() ||
  !time.trim() ||
  !notes.trim()
) {
  alert("Please fill all fields.");
  return;
}

  try {
    const bookingQuery = query(
  collection(db, "bookings"),
  where("date", "==", date),
  where("time", "==", time),
  where("staff", "==", selectedStaff)
);

const existingBookings = await getDocs(bookingQuery);

if (!existingBookings.empty) {
  alert("❌ This time slot is already booked.");
  return;
}
    await addDoc(collection(db, "bookings"), {
      name,
      phone,
      email,
      service,
      staff: selectedStaff,
      date,
      time,
      notes,
      status: "Pending",
      createdAt: new Date(),
    });

    setBookingSummary({
  name,
  service,
  staff: selectedStaff,
  date,
  time,
});

setShowSuccess(true);

    setName("");
    setPhone("");
    setEmail("");
    setService("");
    setSelectedStaff("");
    setDate("");
    setTime("");
    setNotes("");
  } catch (error) {
    console.error(error);
    alert("Error saving booking");
  }
};
const selectedServiceData = services.find(
  (item) => item.name === service
);
  return (
    <main className="min-h-screen bg-pink-50 flex items-center justify-center p-5">
      <div className="text-center">
  <img
    src="/logo.png"
    alt="Silvester Salon Logo"
    className="mx-auto mb-3 h-20 w-20 object-contain"
  />

  <h1 className="text-3xl font-bold text-pink-600">
    Silvester Salon Online Booking
  </h1>

        <p className="text-center text-gray-900 mt-2">
          Book Your Appointment
        </p>
        </div>

        <div className="mt-8">

          <label className="block text-sm font-medium text-gray-900">
            Full Name
          </label>

          <input
            type="fullname"
            className="border w-full p-3 rounded-lg mt-2"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />

        </div>
<div className="mt-5">
  <label className="font-semibold">
    Email
  </label>

  <input
    type="email"
    className="border w-full p-3 rounded-lg mt-2"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</div>
        <div className="mt-5">

          <label className="block text-sm font-semibold text-gray-900 text-center">
    Phone Number
  </label>

  <div className="relative mt-2">
    <input
      type="tel"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      className="w-full rounded-lg border border-gray-900 px-4 py-3"
    />

    {!phone && (
      <span className="absolute inset-y-0 left-4 flex items-center text-green-600 font-medium pointer-events-none">
        WhatsApp Number
      </span>
    )}
        </div>
<div className="mt-5">
  <label className="font-semibold">
    Service
  </label>

  <select
    className="border w-full p-3 rounded-lg mt-2"
    value={service}
  onChange={(e) => setService(e.target.value)}
>
  <option value="">Select Service</option>

  {services.map((item) => (
    <option key={item.id} value={item.name}>
      {item.name}
    </option>
  ))}
</select>
{selectedServiceData && (
  <div className="mt-4 rounded-lg bg-pink-50 border border-pink-200 p-4">

    <p className="font-semibold text-pink-600">
      Service Details
    </p>

    <div className="mt-2 space-y-1 text-gray-900">

      <p>
        💰 <strong>Price:</strong> Rs. {selectedServiceData.price}
      </p>

      <p>
        ⏱ <strong>Duration:</strong> {selectedServiceData.duration} Minutes
      </p>

    </div>

  </div>
)}
</div>
<div className="mt-5">
  <label className="font-semibold">
    Staff
  </label>

  <select
    value={selectedStaff}
    onChange={(e) => setSelectedStaff(e.target.value)}
    className="border w-full p-3 rounded-lg mt-2"
  >
    <option value="">Select Staff</option>

    {staff.map((member) => (
      <option key={member.id} value={member.name}>
        {member.name}
      </option>
    ))}
  </select>
</div>
<div className="mt-5">
  <label className="font-semibold">
    Appointment Date
  </label>

  <input
    type="date"
    className="border w-full p-3 rounded-lg mt-2"
    value={date}
    onChange={(e) => setDate(e.target.value)}
  />
</div>
<div className="mt-5">
  <label className="font-semibold">
    Appointment Time
  </label>

  <select
  value={time}
  onChange={(e) => setTime(e.target.value)}
  className="border w-full p-3 rounded-lg mt-2"
>
  <option value="">Select Time</option>

  {timeSlots
  .filter((t) => t >= openingTime && t <= closingTime)
  .map((t) => (
    <option
      key={t}
      value={t}
      disabled={bookedTimes.includes(t)}
    >
      {t} {bookedTimes.includes(t) ? "(Booked)" : ""}
    </option>
))}
</select>
</div>
<div className="mt-5">
  <label className="font-semibold">
    Notes
  </label>

  <textarea
    className="border w-full p-3 rounded-lg mt-2"
    rows={3}
    value={notes}
    onChange={(e) => setNotes(e.target.value)}
  />
</div>
        <button
          onClick={saveBooking}
          className="bg-pink-600 text-white w-full py-3 rounded-lg mt-8 hover:bg-pink-700"
        >
          Continue
        </button>

      </div>
      {showSuccess && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-8 w-[90%] max-w-md text-center shadow-2xl">

      <div className="text-5xl mb-4">✅</div>

      <h2 className="text-2xl font-bold text-green-900">
        Booking Confirmed
      </h2>

      <p className="mt-3 text-gray-900">
        Thank you for your booking.
      </p>

      <div className="mt-6 text-left space-y-2">

        <p><strong>Name:</strong> {bookingSummary.name}</p>

        <p><strong>Service:</strong> {bookingSummary.service}</p>

        <p><strong>Staff:</strong> {bookingSummary.staff}</p>

        <p><strong>Date:</strong> {bookingSummary.date}</p>

        <p><strong>Time:</strong> {bookingSummary.time}</p>

      </div>

      <button
        onClick={() => setShowSuccess(false)}
        className="mt-8 bg-pink-600 text-white px-6 py-3 rounded-lg w-full hover:bg-pink-700"
      >
        Done
      </button>

    </div>
  </div>
)}
    </main>
  );
}