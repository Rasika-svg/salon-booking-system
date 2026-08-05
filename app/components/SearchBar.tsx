"use client";

type Props = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

export default function SearchBar({ search, setSearch }: Props) {
  return (
    <input
      type="text"
      placeholder="🔍 Search customer..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full p-3 mb-6 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
    />
  );
}