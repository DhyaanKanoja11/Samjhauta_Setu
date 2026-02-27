import { ExternalLink, Landmark, Sprout, FileCheck2, Shield, Phone, Tractor, Factory } from "lucide-react";

export default function KrishiSetuPage() {
  const schemeLinks = [
    {
      title: "PM-KISAN",
      desc: "Direct income support for eligible farmers.",
      url: "https://pmkisan.gov.in/",
      icon: <Sprout className="w-5 h-5" />,
      tag: "Income Support",
    },
    {
      title: "PMFBY (Crop Insurance)",
      desc: "Crop insurance & claim assistance portal.",
      url: "https://pmfby.gov.in/",
      icon: <Shield className="w-5 h-5" />,
      tag: "Insurance",
    },
    {
      title: "e-NAM (National Agri Market)",
      desc: "Online mandi trading, market price discovery.",
      url: "https://enam.gov.in/web/",
      icon: <Landmark className="w-5 h-5" />,
      tag: "Market",
    },
    {
      title: "Kisan Credit Card (KCC)",
      desc: "Credit access & banking-linked support.",
      url: "https://www.myscheme.gov.in/schemes/kcc",
      icon: <FileCheck2 className="w-5 h-5" />,
      tag: "Credit",
    },
    {
      title: "Soil Health Card",
      desc: "Know soil nutrients & improve yield decisions.",
      url: "https://soilhealth.dac.gov.in/",
      icon: <Sprout className="w-5 h-5" />,
      tag: "Soil",
    },
    {
      title: "MyScheme (Govt Schemes Finder)",
      desc: "Search schemes by category & eligibility.",
      url: "https://www.myscheme.gov.in/",
      icon: <Landmark className="w-5 h-5" />,
      tag: "Finder",
    },
    {
      title: "Kisan Call Centre",
      desc: "Toll-free advisory on farming, weather & pests.",
      url: "https://mkisan.gov.in/",
      icon: <Phone className="w-5 h-5" />,
      tag: "Advisory",
    },
    {
      title: "mKisan Portal",
      desc: "SMS advisory, market prices & weather alerts.",
      url: "https://mkisan.gov.in/",
      icon: <Phone className="w-5 h-5" />,
      tag: "SMS Service",
    },
    {
      title: "Fertilizer Subsidy (DBT)",
      desc: "Direct Benefit Transfer for fertilizer purchases.",
      url: "https://www.fert.nic.in/",
      icon: <Factory className="w-5 h-5" />,
      tag: "Subsidy",
    },
    {
      title: "Agri-Market Prices",
      desc: "Daily mandi rates across India (Agmarknet).",
      url: "https://agmarknet.gov.in/",
      icon: <Landmark className="w-5 h-5" />,
      tag: "Prices",
    },
    {
      title: "PM Kisan Samman Nidhi (Tractor)",
      desc: "Farm mechanization & tractor subsidy info.",
      url: "https://agrimachinery.nic.in/",
      icon: <Tractor className="w-5 h-5" />,
      tag: "Machinery",
    },
    {
      title: "ICAR (Research & Tech)",
      desc: "Agricultural research & technology solutions.",
      url: "https://icar.org.in/",
      icon: <Sprout className="w-5 h-5" />,
      tag: "Research",
    },
  ];

  const helplineNumbers = [
    {
      title: "Kisan Call Centre",
      number: "1800-180-1551",
      desc: "24x7 toll-free agri advisory in regional languages",
    },
    {
      title: "PM-KISAN Helpline",
      number: "011-24300606",
      desc: "Queries on payment status & scheme eligibility",
    },
    {
      title: "PMFBY Insurance Helpline",
      number: "1800-200-7710",
      desc: "Crop insurance claims & policy assistance",
    },
    {
      title: "Soil Health Card Helpline",
      number: "011-26862282",
      desc: "Soil testing & card distribution queries",
    },
    {
      title: "Fertilizer Subsidy (DBT)",
      number: "1800-116-024",
      desc: "Direct Benefit Transfer for fertilizers",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="py-8 space-y-10">
        {/* Header */}
        <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 shadow-sm">
          <div className="flex items-start justify-between gap-6 flex-col md:flex-row">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-black text-brand-green dark:text-brand-tan">
                Krishi Setu
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-2xl">
                One place to access <b>Sarkari Yojana</b>, official farmer portals, and verified resources.
                Built for <b>Atmanirbhar Bharat</b> less confusion, more action.
              </p>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-300 text-xs font-bold">
              ✅ Verified Official Links
            </div>
          </div>
        </div>

        {/* Sarkar Setu + Schemes */}
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-4 flex-col sm:flex-row">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                Sarkar–Kisan Setu
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Tap a portal → open official website → apply / track / verify.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schemeLinks.map((s) => (
              <a
                key={s.title}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="group p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-green-300 dark:hover:border-green-700 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-green-700 dark:text-green-300">
                      {s.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                        {s.title}
                      </h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {s.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                      {s.tag}
                    </span>
                    <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-green-700 transition" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Helpline Numbers */}
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-4 flex-col sm:flex-row">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                Helpline Numbers
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Direct phone support for scheme queries & assistance.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {helplineNumbers.map((h) => (
              <div
                key={h.title}
                className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-green-700 dark:text-green-300 flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                      {h.title}
                    </h3>
                    <a
                      href={`tel:${h.number}`}
                      className="text-xl font-black text-green-700 dark:text-green-300 hover:underline block my-1"
                    >
                      {h.number}
                    </a>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {h.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="rounded-3xl bg-neutral-100 dark:bg-neutral-900 p-6 border border-neutral-200 dark:border-neutral-800">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            ⚠️ Note: These are official portals & verified helplines. If any site is slow, it's due to government servers.
            We'll keep the links updated.
          </p>
        </div>
      </div>
    </div>
  );
}