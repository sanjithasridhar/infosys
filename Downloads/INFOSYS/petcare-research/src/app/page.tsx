"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", species: "", breed: "", weight: "" });

  useEffect(() => {
    fetchPets();
  }, []);

  async function fetchPets() {
    try {
      const res = await fetch("/api/pets");
      if (res.ok) {
        const data = await res.json();
        setPets(data);
      }
    } catch (error) {
      console.error("Failed to fetch pets", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowForm(false);
        setFormData({ name: "", species: "", breed: "", weight: "" });
        fetchPets();
      }
    } catch (error) {
      console.error("Failed to create pet", error);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">PetCare Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your pets, health records, and activities.</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            {showForm ? "Cancel" : "+ Add Pet"}
          </button>
        </header>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <h2 className="text-xl font-semibold">Add a New Pet</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required placeholder="Name" className="border p-2 rounded" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              <input required placeholder="Species (e.g., Dog, Cat)" className="border p-2 rounded" value={formData.species} onChange={e => setFormData({ ...formData, species: e.target.value })} />
              <input placeholder="Breed" className="border p-2 rounded" value={formData.breed} onChange={e => setFormData({ ...formData, breed: e.target.value })} />
              <input required type="number" placeholder="Weight (kg)" className="border p-2 rounded" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} />
            </div>
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium">Save Pet</button>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="col-span-2 bg-white p-6 rounded-lg shadow-sm min-h-[400px]">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">My Pets</h2>
            {loading ? (
              <p className="text-gray-400 text-center mt-10">Loading pets...</p>
            ) : pets.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 space-y-4">
                <p>No pets found. Add a pet to get started.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {pets.map(pet => (
                  <li key={pet.id} className="border p-4 rounded-md flex justify-between items-center">
                    <div>
                      <p className="font-bold text-lg">{pet.name} <span className="text-sm font-normal text-gray-500">({pet.species})</span></p>
                      <p className="text-sm text-gray-600">{pet.breed || "Unknown breed"} • {pet.weight} kg</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <aside className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Recent Activity</h2>
              <p className="text-sm text-gray-500 italic">Activity logs will appear here.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Adoption Spotlight</h2>
              <p className="text-sm text-gray-500 italic">Loading available pets...</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
