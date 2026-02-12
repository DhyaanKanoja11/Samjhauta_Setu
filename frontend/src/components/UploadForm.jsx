import { useState } from "react";
import { analyzeContract } from "../services/api";

export default function UploadForm({ setResult }) {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", language);

    setLoading(true);

    try {
      const data = await analyzeContract(formData);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Error analyzing contract");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md">
      <input
        type="file"
        accept=".pdf,.jpg,.png"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />

      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="mb-4 border p-2 rounded"
      >
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="gu">Gujarati</option>
        <option value="pa">Punjabi</option>
        <option value="kn">Kannada</option>
        <option value="bh">Bihari</option>
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Analyzing..." : "Analyze Contract"}
      </button>
    </form>
  );
}
