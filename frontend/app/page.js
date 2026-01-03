"use client";
import { useState } from 'react';
import { Camera, Truck, Leaf, UploadCloud, CheckCircle, Lightbulb, Heart, ExternalLink, Globe } from 'lucide-react';

// --- DATA: FOOD CONSERVATION TIPS ---
const TIPS_DATA = [
  {
    id: 1, category: "Vegetables", title: "Potatoes & Onions",
    image: "https://images.pexels.com/photos/144206/pexels-photo-144206.jpeg?auto=compress&cs=tinysrgb&w=600",
    text: "Never store potatoes and onions together! Onions release gases that cause potatoes to sprout faster. Keep potatoes in a cool, dark place."
  },
  {
    id: 2, category: "Fruit", title: "The Banana Trick",
    image: "https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg?auto=compress&cs=tinysrgb&w=600",
    text: "Wrap the stems of your banana bunch with plastic wrap or foil. This slows down the release of ethylene gas, keeping them fresh for 3-5 days longer."
  },
  {
    id: 3, category: "Greens", title: "Crispy Lettuce",
    image: "https://images.pexels.com/photos/1199562/pexels-photo-1199562.jpeg?auto=compress&cs=tinysrgb&w=600",
    text: "Wilting lettuce? Shock it in a bowl of ice water for 5 minutes to revive the crunch! Store washed greens in a container with a paper towel."
  },
  {
    id: 4, category: "Berries", title: "Berry Bath",
    image: "https://images.pexels.com/photos/70746/strawberries-red-fruit-royalty-free-70746.jpeg?auto=compress&cs=tinysrgb&w=600",
    text: "Soak berries in a mix of 1 part vinegar to 3 parts water, then dry completely before storing. This kills spores and stops mold instantly."
  },
  {
    id: 5, category: "Herbs", title: "Herb Bouquets",
    image: "https://images.pexels.com/photos/4022083/pexels-photo-4022083.jpeg?auto=compress&cs=tinysrgb&w=600",
    text: "Treat soft herbs (cilantro, parsley) like flowers. Trim stems, place in a jar of water, and cover loosely with a plastic bag in the fridge."
  },
  {
    id: 6, category: "Dairy", title: "Milk Placement",
    image: "https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=600",
    text: "Don't store milk in the fridge door! The temp fluctuates too much. Keep it on the middle or bottom shelf where it is coldest."
  },
  {
    id: 7, category: "Bread", title: "Revive Stale Bread",
    image: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=600",
    text: "Run a stale loaf quickly under water (yes, really!) and bake at 350°F (175°C) for 5-10 minutes. It will come out crispy outside and soft inside."
  },
  {
    id: 8, category: "Freezer", title: "Freeze Fresh Herbs",
    image: "https://images.pexels.com/photos/1437629/pexels-photo-1437629.jpeg?auto=compress&cs=tinysrgb&w=600",
    text: "Chop leftover herbs, place them in an ice cube tray, cover with olive oil, and freeze. Pop a cube into your pan when cooking!"
  },
  {
    id: 9, category: "Avocado", title: "Stop the Browning",
    image: "https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg?auto=compress&cs=tinysrgb&w=600",
    text: "Store cut avocado with a piece of onion in an airtight container. The sulfur from the onion prevents browning without altering the taste."
  }
];

// --- DATA: SUSTAINABLE GARDENING ---
const GARDEN_DATA = [
  {
    id: 1, name: "Cherry Tomatoes", difficulty: "Medium",
    image: "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=600",
    details: [
      "☀️ **Sun:** Needs 6-8 hours of direct sunlight daily.",
      "💧 **Water:** Keep soil moist but not soggy. Water at the base.",
      "🌱 **Tip:** Use a chopstick or small stake to support the stem."
    ]
  },
  {
    id: 2, name: "Basil", difficulty: "Easy",
    image: "https://images.pexels.com/photos/1087902/pexels-photo-1087902.jpeg?auto=compress&cs=tinysrgb&w=600",
    details: [
      "☀️ **Sun:** Loves warm, sunny windowsills (6+ hours).",
      "✂️ **Harvest:** Pinch off the top leaves, not the sides.",
      "💧 **Water:** Water when the top inch of soil feels dry."
    ]
  },
  {
    id: 3, name: "Scallions", difficulty: "Very Easy",
    image: "https://images.pexels.com/photos/4197444/pexels-photo-4197444.jpeg?auto=compress&cs=tinysrgb&w=600",
    details: [
      "🔄 **Regrow:** Save the white root ends from store-bought onions.",
      "💧 **Water:** Place roots in a glass of water. Change water every 2 days.",
      "🚀 **Speed:** You will see new green growth in just 24 hours!"
    ]
  },
  {
    id: 4, name: "Mint", difficulty: "Easy",
    image: "https://images.pexels.com/photos/1264000/pexels-photo-1264000.jpeg?auto=compress&cs=tinysrgb&w=600",
    details: [
      "🚧 **Contain:** Mint roots spread aggressively. Keep in a separate pot.",
      "💧 **Water:** Loves moisture. Don't let soil dry out completely.",
      "🍵 **Use:** Perfect for fresh tea, mojitos, or infusing water."
    ]
  },
  {
    id: 5, name: "Spinach", difficulty: "Medium",
    image: "https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&cs=tinysrgb&w=600",
    details: [
      "☁️ **Sun:** Prefers cooler temps and partial shade.",
      "🌱 **Soil:** Needs nitrogen-rich soil to stay dark green.",
      "✂️ **Harvest:** Pick outer leaves first so the center keeps growing."
    ]
  },
  {
    id: 6, name: "Chili Peppers", difficulty: "Medium",
    image: "https://images.pexels.com/photos/4033324/pexels-photo-4033324.jpeg?auto=compress&cs=tinysrgb&w=600",
    details: [
      "🔥 **Heat:** The more sun they get, the hotter the peppers.",
      "💧 **Stress:** Let soil dry out between watering to increase spice.",
      "☀️ **Sun:** Needs a very bright, warm spot to produce fruit."
    ]
  },
  {
    id: 7, name: "Strawberries", difficulty: "Medium",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/PerfectStrawberry.jpg/640px-PerfectStrawberry.jpg",
    details: [
      "☀️ **Sun:** Needs full sun (6-10 hours) to produce sweet fruit.",
      "💧 **Water:** Roots are shallow, so keep soil consistently moist.",
      "🍓 **Tip:** Plant in a hanging basket to keep fruit off the dirt!"
    ]
  },
  {
    id: 8, name: "Microgreens", difficulty: "Very Easy",
    image: "https://images.pexels.com/photos/7457497/pexels-photo-7457497.jpeg?auto=compress&cs=tinysrgb&w=600",
    details: [
      "🏠 **Space:** Can grow on a shallow tray on a counter.",
      "⏱️ **Speed:** Ready to harvest in just 7-10 days.",
      "💪 **Health:** Packed with 40x more nutrients than mature veg."
    ]
  }
];

// --- DATA: CHARITIES ---
const CHARITY_DATA = [
  {
    id: 1, name: "Feeding America",
    desc: "The largest charity working to end hunger in the United States by partnering with food banks.",
    url: "https://www.feedingamerica.org/"
  },
  {
    id: 2, name: "World Food Programme",
    desc: "The world's largest humanitarian organization saving lives in emergencies and building prosperity.",
    url: "https://www.wfp.org/"
  },
  {
    id: 3, name: "Action Against Hunger",
    desc: "A global humanitarian organization that takes decisive action against the causes and effects of hunger.",
    url: "https://www.actionagainsthunger.org/"
  },
  {
    id: 4, name: "No Kid Hungry",
    desc: "Working to end childhood hunger in America by connecting kids to effective nutrition programs.",
    url: "https://www.nokidhungry.org/"
  },
  {
    id: 5, name: "Meals on Wheels",
    desc: "Delivering nutritious meals to seniors struggling with hunger and isolation in their homes.",
    url: "https://www.mealsonwheelsamerica.org/"
  },
  {
    id: 6, name: "The Hunger Project",
    desc: "A global movement of people working to end world hunger through sustainable, grassroots strategies.",
    url: "https://thp.org/"
  },
  {
    id: 7, name: "Food for the Poor",
    desc: "Providing food, housing, and emergency relief to the poorest of the poor in 17 countries.",
    url: "https://www.foodforthepoor.org/"
  },
  {
    id: 9, name: "City Harvest",
    desc: "Rescuing food to feed hungry New Yorkers. The world's first food rescue organization.",
    url: "https://www.cityharvest.org/"
  },
  {
    id: 10, name: "Mercy Corps",
    desc: "Alleviating suffering, poverty and oppression by helping people build secure, productive communities.",
    url: "https://www.mercycorps.org/"
  }
];

export default function Home() {
  const [view, setView] = useState('donor');
  // Added 'quantity' and 'unit' to state
  const [donorDetails, setDonorDetails] = useState({ name: '', phone: '', address: '', quantity: '', unit: 'lbs' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const handleFileUpload = async () => {
    if (!file || !donorDetails.name || !donorDetails.quantity) return alert("Please fill all details including quantity!");
    setLoading(true);

    // Simulating API for Visual Demo
    setTimeout(() => {
      setScanResult({
        item_name: "Fresh Produce",
        freshness: 92,
        action: "Donate to Shelter"
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="app-container">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '3rem' }}>
          <div style={{ background: '#2dd4bf', padding: '10px', borderRadius: '12px' }}>
            <Leaf color="white" size={24} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>ResQ Chain</h1>
        </div>

        <nav>
          <button className={`nav-btn ${view === 'donor' ? 'active' : ''}`} onClick={() => setView('donor')}>
            <Camera size={20} /> Donate Food
          </button>
          <button className={`nav-btn ${view === 'driver' ? 'active' : ''}`} onClick={() => setView('driver')}>
            <Truck size={20} /> Driver Mode
          </button>
          <button className={`nav-btn ${view === 'tips' ? 'active' : ''}`} onClick={() => setView('tips')}>
            <Lightbulb size={20} /> Tips & Tricks
          </button>
          <button className={`nav-btn ${view === 'garden' ? 'active' : ''}`} onClick={() => setView('garden')}>
            <Leaf size={20} /> Sustainable Garden
          </button>
          <button className={`nav-btn ${view === 'charities' ? 'active' : ''}`} onClick={() => setView('charities')}>
            <Heart size={20} /> Donate Funds
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* --- DONOR VIEW --- */}
        {view === 'donor' && (
          <div className="animate-fade-in">
            <h2 className="hero-text">Reduce Waste.<br/>Feed People.</h2>
            <p className="subtitle">AI-powered food rescue. Connect surplus food with local drivers instantly.</p>

            <div className="glass-panel">
              <div className="form-section">

                {/* LEFT: INPUTS */}
                <div style={{ paddingRight: '2rem' }}>
                  <div className="input-group">
                    <label className="label">1. Your Name</label>
                    <input type="text" className="input-field" placeholder="e.g. John Doe" onChange={e => setDonorDetails({...donorDetails, name: e.target.value})}/>
                  </div>
                  <div className="input-group">
                    <label className="label">2. Phone Number</label>
                    <input type="text" className="input-field" placeholder="+1 (555) 000-0000" onChange={e => setDonorDetails({...donorDetails, phone: e.target.value})}/>
                  </div>
                  <div className="input-group">
                    <label className="label">3. Pickup Address</label>
                    <input type="text" className="input-field" placeholder="Enter full address" onChange={e => setDonorDetails({...donorDetails, address: e.target.value})}/>
                  </div>

                  {/* NEW: QUANTITY INPUT */}
                  <div className="input-group">
                    <label className="label">4. Quantity</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="number"
                        className="input-field"
                        placeholder="e.g. 5"
                        style={{ flex: 1 }}
                        onChange={e => setDonorDetails({...donorDetails, quantity: e.target.value})}
                      />
                      <select
                        className="input-field"
                        style={{ width: '100px', cursor: 'pointer' }}
                        value={donorDetails.unit}
                        onChange={e => setDonorDetails({...donorDetails, unit: e.target.value})}
                      >
                        <option value="lbs">lbs</option>
                        <option value="kg">kg</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* RIGHT: UPLOAD */}
                <div>
                  <label className="label">5. Food Photo</label>
                  <div className="upload-box">
                    <input type="file" style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', cursor: 'pointer' }} onChange={(e) => { const f = e.target.files[0]; setFile(f); setPreview(URL.createObjectURL(f)); }} />
                    {preview ? (
                      <img src={preview} alt="Preview" />
                    ) : (
                      <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                        <UploadCloud size={48} style={{ margin: '0 auto 1rem auto', color: '#2dd4bf' }} />
                        <p style={{ fontWeight: 500 }}>Click to Upload</p>
                        <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Supports JPG, PNG</p>
                      </div>
                    )}
                  </div>

                  <button className="btn-primary" onClick={handleFileUpload} disabled={loading}>
                    {loading ? "Analyzing..." : "Analyze & Find Drivers"}
                  </button>
                </div>
              </div>
            </div>

            {/* RESULTS DEMO */}
            {scanResult && (
              <div className="glass-panel" style={{ marginTop: '2rem', borderColor: '#2dd4bf' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{scanResult.item_name}</h3>
                    <p style={{ color: '#2dd4bf', fontWeight: 'bold' }}>{scanResult.freshness}% Fresh Score</p>
                    <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Quantity: {donorDetails.quantity} {donorDetails.unit}</p>
                  </div>
                  <div style={{ background: 'rgba(45, 212, 191, 0.2)', padding: '1rem', borderRadius: '50%' }}>
                    <CheckCircle size={32} color="#2dd4bf" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- DRIVER VIEW --- */}
        {view === 'driver' && (
          <div>
            <h2 className="hero-text">Driver Dashboard</h2>
            <p className="subtitle">View available pickups in your area.</p>
            <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem' }}>
              <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>No active requests nearby.</p>
            </div>
          </div>
        )}

        {/* --- TIPS VIEW --- */}
        {view === 'tips' && (
          <div className="animate-fade-in">
            <h2 className="hero-text">Smart Storage,<br/>Longer Life.</h2>
            <p className="subtitle">Master the art of food preservation with these expert hacks.</p>

            <div className="tips-grid">
              {TIPS_DATA.map((tip) => (
                <div key={tip.id} className="tip-card">
                  <div className="tip-image-container">
                    <img src={tip.image} alt={tip.title} className="tip-image" />
                  </div>
                  <div className="tip-content">
                    <span className="tip-tag">{tip.category}</span>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{tip.title}</h3>
                    <p style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '0.95rem' }}>{tip.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- GARDENING VIEW --- */}
        {view === 'garden' && (
          <div className="animate-fade-in">
            <h2 className="hero-text">Grow Your Own.<br/>Eat Fresh.</h2>
            <p className="subtitle">From seed to plate. Discover the easiest plants to grow in your home.</p>

            <div className="tips-grid">
              {GARDEN_DATA.map((plant) => (
                <div key={plant.id} className="tip-card">
                  <div className="tip-image-container">
                    <img src={plant.image} alt={plant.name} className="tip-image" referrerPolicy="no-referrer" />
                  </div>
                  <div className="tip-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span className="tip-tag" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', margin: 0 }}>
                            {plant.difficulty}
                        </span>
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{plant.name}</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {plant.details.map((detail, index) => (
                        <li key={index} style={{ marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5' }}>
                           {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- CHARITY VIEW (Text Only) --- */}
        {view === 'charities' && (
          <div className="animate-fade-in">
            <h2 className="hero-text">Support the Cause.<br/>End Hunger.</h2>
            <p className="subtitle">Can't donate food? Support these organizations making a global difference.</p>

            <div className="tips-grid">
              {CHARITY_DATA.map((charity) => (
                <div key={charity.id} className="tip-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div className="tip-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                     <div style={{ marginBottom: '1rem' }}>
                        <Globe size={32} className="text-teal-400" style={{ color: '#2dd4bf', marginBottom: '0.5rem' }} />
                        <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{charity.name}</h3>
                     </div>
                    <p style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '1rem', marginBottom: '2rem', flex: 1 }}>
                      {charity.desc}
                    </p>
                    <a
                      href={charity.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        width: '100%',
                        padding: '1rem',
                        background: 'rgba(45, 212, 191, 0.1)',
                        border: '1px solid #2dd4bf',
                        borderRadius: '12px',
                        color: '#2dd4bf',
                        fontWeight: 'bold',
                        textDecoration: 'none',
                        transition: 'all 0.3s'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.background = '#2dd4bf'; e.currentTarget.style.color = 'white'; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(45, 212, 191, 0.1)'; e.currentTarget.style.color = '#2dd4bf'; }}
                    >
                      Visit Website <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}