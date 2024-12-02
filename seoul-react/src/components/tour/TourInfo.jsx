import React, { useState } from "react";
import axios from "axios";

const TourInfo = () => {
  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState(null);

  const fetchTourInfo = async () => {
    try {
      const response = await axios.get('http://localhost:9002/seoul/tour', { // Spring Backend URL
        params: { keyword }
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error fetching tour info:", error);
    }
  };

  return (
    <div>
      <h1>Tour Information</h1>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Enter keyword"
      />
      <button onClick={fetchTourInfo}>Search</button>
      <div>
        {result ? <pre>{JSON.stringify(result, null, 2)}</pre> : "No data"};
      </div>
    </div>
  );
};

export default TourInfo;