import { useEffect, useState } from "react";
import { getProtests, createProtest } from "../firebase/protests";

export default function Protests() {
  const [protests, setProtests] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getProtests();
    setProtests(data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Protests</h1>

      {protests.map((p) => (
        <div key={p.id}>
          <h3>{p.title}</h3>
          <p>{p.description}</p>
          <small>{p.date}</small>
        </div>
      ))}
    </div>
  );
}
