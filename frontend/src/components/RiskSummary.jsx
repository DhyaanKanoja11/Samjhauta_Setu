export default function RiskSummary({ result }) {
  if (!result) return null;

  const getRiskColor = (level) => {
    switch (level) {
      case "LOW":
        return "bg-green-100 text-green-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "HIGH":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSimpleMessage = (level) => {
    if (level === "LOW") return "This contract looks mostly safe.";
    if (level === "MEDIUM") return "Some clauses may be risky. Read carefully.";
    if (level === "HIGH") return "High risk contract. Review before signing.";
    return "";
  };

  return (
    <div className="mt-8 w-full max-w-3xl">

      {/* Overall Risk Badge */}
      <div className={`p-6 rounded-2xl shadow-md mb-6 ${getRiskColor(result.risk_level)}`}>
        <h2 className="text-2xl font-bold mb-2">
          Risk Level: {result.risk_level}
        </h2>
        <p className="text-lg">{getSimpleMessage(result.risk_level)}</p>
        <p className="mt-2">Risk Score: {result.risk_score}</p>
      </div>

      {/* Risky Clauses */}
      {result.risky_clauses.map((clause, index) => (
        <div
          key={index}
          className="bg-white p-5 rounded-xl shadow-sm border mb-5"
        >
          <h3 className="font-semibold text-lg mb-2">
            Risky Clause {index + 1}
          </h3>

          <p className="text-gray-700 mb-3">
            {clause.clause_text}
          </p>

          {clause.explanations && clause.explanations.length > 0 && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-medium mb-1">What this means:</p>
              <ul className="list-disc ml-5 text-sm">
                {clause.explanations.map((exp, i) => (
                  <li key={i}>{exp}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
