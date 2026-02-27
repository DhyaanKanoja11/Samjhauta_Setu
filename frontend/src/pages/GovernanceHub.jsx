import { ExternalLink, Phone, Landmark, BookOpen } from "lucide-react";

export default function GovernanceHub() {

  const schemes = [
    {
      name: "PM-KISAN Samman Nidhi",
      description: "Direct income support of ₹6000 per year to eligible farmers.",
      link: "https://pmkisan.gov.in/"
    },
    {
      name: "Pradhan Mantri Fasal Bima Yojana",
      description: "Crop insurance scheme protecting farmers from natural calamities.",
      link: "https://pmfby.gov.in/"
    },
    {
      name: "Soil Health Card Scheme",
      description: "Provides soil health analysis and fertilizer recommendations.",
      link: "https://soilhealth.dac.gov.in/"
    },
    {
      name: "eNAM (National Agriculture Market)",
      description: "Online trading platform for transparent mandi pricing.",
      link: "https://www.enam.gov.in/"
    }
  ];

  const integrations = [
    {
      title: "Kisan Call Center",
      description: "24x7 national farmer helpline for agricultural guidance.",
      link: "https://agricoop.nic.in/en/KCC",
      extra: "Toll Free: 1800-180-1551"
    },
    {
      title: "State Agriculture Departments",
      description: "Coordination-ready integration with state-level agriculture portals."
    },
    {
      title: "DigiLocker (Future Integration)",
      description: "Secure government-backed document verification system."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-16">

        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-green-700">
            🌾 Krishi Governance Hub
          </h1>
          <p className="text-neutral-500 mt-3 max-w-3xl">
            Strengthening Atmanirbhar Bharat by connecting farmers with 
            government systems, legal infrastructure, and national schemes.
          </p>
        </div>

        {/* Government Integration Section */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Landmark className="text-green-700" />
            <h2 className="text-2xl font-semibold">
              Sarkar–Kisan Setu
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {integrations.map((item, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-neutral-100 dark:bg-neutral-900 shadow hover:scale-[1.02] transition"
              >
                <h3 className="text-lg font-semibold mb-3">
                  {item.title}
                </h3>

                <p className="text-sm text-neutral-500 mb-4">
                  {item.description}
                </p>

                {item.extra && (
                  <p className="text-sm font-semibold text-green-700 mb-3">
                    <Phone className="inline w-4 h-4 mr-1" />
                    {item.extra}
                  </p>
                )}

                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-700 font-semibold flex items-center gap-2"
                  >
                    Visit Official Portal
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Scheme Section */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="text-green-700" />
            <h2 className="text-2xl font-semibold">
              Government Scheme Awareness
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {schemes.map((scheme, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-neutral-100 dark:bg-neutral-900 shadow hover:scale-[1.02] transition"
              >
                <h3 className="text-lg font-semibold mb-3">
                  {scheme.name}
                </h3>

                <p className="text-sm text-neutral-500 mb-4">
                  {scheme.description}
                </p>

                <a
                  href={scheme.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-700 font-semibold flex items-center gap-2"
                >
                  Visit Official Portal
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}