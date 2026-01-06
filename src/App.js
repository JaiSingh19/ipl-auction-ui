import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver";



const API = "https://iplaction-1-0-2.onrender.com/api/bids";

function App() {
  const [bids, setBids] = useState([]);
  const [form, setForm] = useState({
    bidderName: "",
    playerName: "",
    bidAmount: ""
  });

  useEffect(() => fetchBids(), []);

  const fetchBids = async () => {
    const res = await axios.get(API);
    setBids(res.data);
  };

  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.bidderName || !form.playerName || !form.bidAmount) return alert("Fill all fields");
    await axios.post(API, {
      bidderName: form.bidderName,
      playerName: form.playerName,
      bidAmount: parseFloat(form.bidAmount)
    });
    setForm({bidderName:"",playerName:"",bidAmount:""});
    fetchBids();
  };

  const downloadExcel = async () => {
    const res = await axios.get(`${API}/export/excel`, {
      responseType: "blob"
    });
    const blob = new Blob([res.data], { type: res.headers['content-type'] });
    saveAs(blob, "bids.xlsx");
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h2>IPL Auction Bidding</h2>
      <form onSubmit={submit} style={{ marginBottom: 20 }}>
        <input name="bidderName" placeholder="Bidder name" value={form.bidderName} onChange={handleChange} />
        <input name="playerName" placeholder="Player name" value={form.playerName} onChange={handleChange} style={{ marginLeft: 8 }} />
        <input name="bidAmount" placeholder="Bid amount" value={form.bidAmount} onChange={handleChange} style={{ marginLeft: 8 }} />
        <button type="submit" style={{ marginLeft: 8 }}>Place Bid</button>
      </form>

      <button onClick={downloadExcel}>Download Excel</button>

      <h3 style={{ marginTop: 20 }}>Bids</h3>
      <table border="1" cellPadding="6" style={{ borderCollapse: "collapse", marginTop: 8 }}>
        <thead>
          <tr><th>Id</th><th>Bidder</th><th>Player</th><th>Amount</th><th>CreatedAt</th></tr>
        </thead>
        <tbody>
          {bids.map(b => (
            <tr key={b.id || Math.random()}>
              <td>{b.id}</td>
              <td>{b.bidderName}</td>
              <td>{b.playerName}</td>
              <td>{b.bidAmount}</td>
              <td>{b.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
