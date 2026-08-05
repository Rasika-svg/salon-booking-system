"use client";

type Props = {
  total: number;
  pending: number;
  completed: number;
};

export default function DashboardCards({
  total,
  pending,
  completed,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

      <div className="bg-blue-500 text-white rounded-xl p-5 shadow">
        <h2 className="text-lg font-semibold">Today's Bookings</h2>
        <p className="text-3xl font-bold mt-2">{total}</p>
      </div>

      <div className="bg-yellow-500 text-white rounded-xl p-5 shadow">
        <h2 className="text-lg font-semibold">Pending</h2>
        <p className="text-3xl font-bold mt-2">{pending}</p>
      </div>

      <div className="bg-green-600 text-white rounded-xl p-5 shadow">
        <h2 className="text-lg font-semibold">Completed</h2>
        <p className="text-3xl font-bold mt-2">{completed}</p>
      </div>

    </div>
  );
}