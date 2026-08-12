"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


import {
  collection,
query,
where,
orderBy,
onSnapshot,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import DashboardCards from ".././components/DashboardCards";
import SearchBar from ".././components/SearchBar";
import BookingCard from ".././components/BookingCard";
import BookingCalendar from ".././components/BookingCalendar";

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

export default function AdminPage() {

  const router = useRouter();

  const logout = async () => {
  await signOut(auth);
  router.push("/login");
};

  const [todayBookingsCount, setTodayBookingsCount] = useState(0);
const [pendingCount, setPendingCount] = useState(0);
const [completedCount, setCompletedCount] = useState(0);
const [todayIncome, setTodayIncome] = useState(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [staffList, setStaffList] = useState<
  { id: string; name: string }[]
>([]);

const [staffFilter, setStaffFilter] = useState("All")
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) {
      router.push("/login");
    }
  })
  
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

    setStaffList(list);
  });


  return () => unsubscribeStaff();
}, [router]);

  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, "bookings"),
      (snapshot) => {

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Booking[];

        setBookings(data);

          const today = new Date().toISOString().split("T")[0];

const todayList = data.filter((booking) => booking.date === today);

setTodayBookingsCount(todayList.length);

setPendingCount(
  todayList.filter((booking) => booking.status === "Pending").length
);

setCompletedCount(
  todayList.filter((booking) => booking.status === "Completed").length
);

      }
    );

    return () => unsubscribe();

  }, []);

  const today = new Date().toISOString().split("T")[0];

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowString = tomorrow.toISOString().split("T")[0];

const weekEnd = new Date();
weekEnd.setDate(weekEnd.getDate() + 7);

const filtered = bookings.filter((booking) => {
  const matchSearch =
    booking.name?.toLowerCase().includes(search.toLowerCase()) ||
    booking.phone?.includes(search);

  if (!matchSearch) return false;

  if (filter === "Today") {
    return booking.date === today;
  }

  if (filter === "Tomorrow") {
    return booking.date === tomorrowString;
  }

  if (filter === "Week") {
    if (!booking.date) return false;

    const bookingDate = new Date(booking.date);

    return (
      bookingDate >= new Date(today) &&
      bookingDate <= weekEnd
    );
  }
  
if (selectedDate) {
  return booking.date === selectedDate;
}

  if (
    staffFilter !== "All" &&
    booking.staff !== staffFilter
  ) {
    return false;
  }
  return true;
})
.sort((a, b) => {
    // Date + Time අනුව අලුත්ම booking උඩට
    const aDate = `${a.date ?? ""} ${a.time ?? "00:00"}`;
    const bDate = `${b.date ?? ""} ${b.time ?? "00:00"}`;

    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });


  const todayBookings = bookings.filter(
  (b) => b.date === today
).length; 
 
  const pending = bookings.filter(
    (b) => b.status !== "Completed"
  ).length;

  const completed = bookings.filter(
    (b) => b.status === "Completed"
  ).length;
    return (
    <main className="min-h-screen bg-gray-100 p-8">

      <div className="flex justify-between items-center mb-8">

  <h1 className="text-4xl font-bold text-pink-600">
    Salon Admin Dashboard
  </h1>

  <button
    onClick={logout}
    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
  >
    Logout
  </button>

</div>

      <DashboardCards
        total={todayBookings}
        pending={pending}
        completed={completed}
      />
      <BookingCalendar
  bookings={bookings}
  selectedDate={selectedDate}
  setSelectedDate={setSelectedDate}
/>
<div className="mb-4">
  <select
    value={staffFilter}
    onChange={(e) => setStaffFilter(e.target.value)}
    className="border rounded-lg p-3 w-full"
  >
    <option value="All">All Staff</option>

    {staffList.map((member) => (
      <option key={member.id} value={member.name}>
        {member.name}
      </option>
    ))}
  </select>
</div>

      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      <div className="flex flex-wrap gap-3 mb-6">

  <button
    onClick={() => {
  setFilter("All");
  setSelectedDate("");
}}
    className={`px-4 py-2 rounded-lg ${
      filter === "All"
        ? "bg-pink-600 text-white"
        : "bg-gray-200"
    }`}
  >
    All
  </button>

  <button
    onClick={() => {
  setFilter("Today");
  setSelectedDate("");
}}
    className={`px-4 py-2 rounded-lg ${
      filter === "Today"
        ? "bg-pink-600 text-white"
        : "bg-gray-200"
    }`}
  >
    Today
  </button>

  <button
    onClick={() => {
  setFilter("Tomorrow");
  setSelectedDate("");
}}
    className={`px-4 py-2 rounded-lg ${
      filter === "Tomorrow"
        ? "bg-pink-600 text-white"
        : "bg-gray-200"
    }`}
  >
    Tomorrow
  </button>

  <button
    onClick={() => {
  setFilter("Week");
  setSelectedDate("");
}}
    className={`px-4 py-2 rounded-lg ${
      filter === "Week"
        ? "bg-pink-600 text-white"
        : "bg-gray-200"
    }`}
  >
    This Week
  </button>

</div>

      <div className="space-y-6">

        {filtered.length === 0 ? (

          <div className="bg-white rounded-xl p-10 text-center shadow">

            <h2 className="text-xl font-semibold text-gray-900">
              No bookings found
            </h2>

          </div>

        ) : (
          filtered.map((booking) => (
  <BookingCard
    key={booking.id}
    booking={booking}
  />
))
        )}

      </div>

    </main>
  );
}