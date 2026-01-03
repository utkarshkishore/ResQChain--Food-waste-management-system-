"use client";
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [view, setView] = useState('donor'); // 'donor', 'driver', 'history'
  const [file, setFile] = useState(null);
  const [address, setAddress] = useState("");
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [donations, setDonations] = useState([]);

  // --- DONOR FUNCTIONS ---
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
  };

  const handleFileUpload = async () => {
    if (!file) return alert("Please select a file!");
    if (!address) return alert("Please enter an address!");

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('address', address);

    try {
      const res = await axios.post('http://127.0.0.1:8000/analyze_donation', formData);
      setResult(res.data.data);
    } catch (error) {
      console.error(error);
      alert("Error connecting to backend.");
    }
    setLoading(false);
  };

  // --- FETCH DATA (Used by Driver & History) ---
  const fetchData = async (targetView) => {
    setView(targetView);
    try {
      const res = await axios.get('http://127.0.0.1:8000/all_donations');
      setDonations(res.data.data);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  // --- DRIVER ACCEPT FUNCTION ---
  const handleAccept = async (id) => {
    // Optimistic UI Update: Remove from list immediately
    setDonations(donations.filter(item => item._id !== id));
    alert("✅ Pickup Confirmed! Status updated to 'Picked Up'.");

    try {
      // Update Status in Backend
      await axios.post('http://127.0.0.1:8000/pickup_donation', { id: id });
    } catch (error) {
      console.error("Update Error:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-10">

      <h1 className="text-4xl font-bold text-teal-400 mb-8">ResQ-Chain</h1>

      {/* NAVIGATION TABS */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setView('donor')}
          className={`px-6 py-2 rounded-lg font-bold transition ${view === 'donor' ? 'bg-green-600' : 'bg-gray-700'}`}
        >
          📷 Donor
        </button>
        <button
          onClick={() => fetchData('driver')}
          className={`px-6 py-2 rounded-lg font-bold transition ${view === 'driver' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          🚚 Driver
        </button>
        <button
          onClick={() => fetchData('history')}
          className={`px-6 py-2 rounded-lg font-bold transition ${view === 'history' ? 'bg-purple-600' : 'bg-gray-700'}`}
        >
          📜 History
        </button>
      </div>

      {/* --- VIEW 1: DONOR SCANNER --- */}
      {view === 'donor' && (
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">New Donation</h2>

          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-2">Pickup Address</label>
            <input
              type="text"
              placeholder="e.g. 123 Main St"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 rounded bg-gray-900 text-white border border-gray-600 focus:border-teal-400 outline-none"
            />
          </div>

          <input
            type="file"
            suppressHydrationWarning={true}
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-teal-600 file:text-white mb-4 cursor-pointer"
          />

          {preview && (
            <div className="mb-4">
              <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg border border-gray-600" />
              {!result && (
                <button
                  onClick={handleFileUpload}
                  disabled={loading}
                  className="w-full mt-4 bg-green-600 hover:bg-green-500 py-3 rounded-lg font-bold transition"
                >
                  {loading ? "Analyzing..." : "Analyze & Post"}
                </button>
              )}
            </div>
          )}

          {result && (
            <div className="mt-6 animate-fade-in">
              <h3 className="text-2xl font-bold text-green-400 mb-2 capitalize">{result.item_name}</h3>

              <div className="bg-gray-900 p-3 rounded mb-4 text-center border border-gray-700">
                 <p className="text-gray-400 text-xs uppercase">Your Location</p>
                 <p className="text-white font-mono text-sm">📍 {address}</p>
                 <p className="text-gray-500 text-xs mt-1">{result.timestamp}</p>
              </div>

              {result.action_recommendation && (
                <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">AI Recommendation</p>
                  <p className="text-lg font-bold text-white mb-1">{result.action_recommendation.replace(/_/g, " ")}</p>
                </div>
              )}
              <p className="text-xs text-center text-gray-500 mt-4">✅ Saved to Database</p>
            </div>
          )}
        </div>
      )}

      {/* --- VIEW 2: DRIVER LIST (ONLY PENDING) --- */}
      {view === 'driver' && (
        <div className="w-full max-w-2xl animate-fade-in">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span>🚚</span> Active Pickups (Pending)
          </h2>

          <div className="grid gap-4">
            {/* FILTER: Only show items where status is 'Pending' */}
            {donations.filter(item => item.status === 'Pending').map((item) => (
              <div key={item._id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex justify-between items-center shadow-lg">
                <div className="flex-1 pr-4">
                  <h3 className="text-xl font-bold text-green-400 capitalize">{item.item_name}</h3>
                  <p className="text-gray-300 font-mono text-xs mt-1 mb-2">📍 {item.address}</p>
                  <p className="text-gray-400 text-sm">{item.action_recommendation}</p>
                </div>
                <button
                  onClick={() => handleAccept(item._id)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-bold text-sm shadow-md"
                >
                  Accept
                </button>
              </div>
            ))}
            {donations.filter(item => item.status === 'Pending').length === 0 && (
              <p className="text-gray-500 text-center">No pending pickups.</p>
            )}
          </div>
        </div>
      )}

      {/* --- VIEW 3: HISTORY (SHOWS EVERYTHING) --- */}
      {view === 'history' && (
        <div className="w-full max-w-2xl animate-fade-in">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span>📜</span> Past Orders
          </h2>

          <div className="grid gap-4">
            {donations.map((item) => (
              <div key={item._id} className="bg-gray-800 p-5 rounded-xl border border-gray-700 flex justify-between items-center opacity-90 hover:opacity-100">
                <div>
                  <h3 className="text-lg font-bold text-gray-200 capitalize">{item.item_name}</h3>
                  <p className="text-gray-500 text-xs mt-1">📅 {item.timestamp || "No Date"}</p>
                  <p className="text-gray-400 text-sm mt-1">📍 {item.address}</p>
                </div>

                {/* STATUS BADGE */}
                <div className={`px-4 py-2 rounded-lg font-bold text-sm border
                  ${item.status === 'Picked Up'
                    ? 'bg-green-900/50 text-green-400 border-green-700'
                    : 'bg-yellow-900/50 text-yellow-400 border-yellow-700'}`}>
                  {item.status || "Pending"}
                </div>
              </div>
            ))}
            {donations.length === 0 && <p className="text-gray-500 text-center">No history found.</p>}
          </div>
        </div>
      )}

    </main>
  );
}