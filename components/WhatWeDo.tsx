const cards = [
  {
    title: "Our Promise",
    items: [
      "Made with carefully selected natural ingredients",
      "No preservatives or artificial additives",
      "No added colours or synthetic flavours",
      "Traditional processing with clean-label standards",
      "Healthy, wholesome & family-friendly products",
      "Crafted for everyday nutrition and authentic taste",
      "Trusted food choices for modern families",
    ],
  },
  {
    title: "We Specialize in",
    items: [
      "20+ varieties of idli & dosa batters",
      "Traditional spice powders & masala blends",
      "Homemade-style pickles & healthy condiments",
      "Millet-based food products & healthy mixes",
      "Cold-pressed oils & traditional ingredients",
      "Ready-to-cook and everyday healthy essentials",
    ],
  },
  {
    title: "Our Recipes are Inspired by",
    items: [
      "Traditional home-style cooking practices",
      "Authentic regional flavours and heritage recipes",
      "Clean, balanced & nutritious ingredients",
      "The belief that healthy food should never compromise taste",
      "A mission to build healthier future generations",
      "Food made with care, trust, and long-term wellness in mind",
    ],
  },
];

export default function WhatWeDo() {
  return (
    <section className="bg-[#e8eceb] py-14 px-4">
      {/* Section heading */}
      <h2
        className="text-center text-[#1e4620] text-4xl mb-10"
        style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}
      >
        What We Do
      </h2>

      {/* Cards grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-3xl p-8 shadow-sm"
          >
            <h3 className="text-[#1e5c2e] font-semibold text-lg mb-6">
              {card.title}
            </h3>
            <ol className="flex flex-col gap-3">
              {card.items.map((item, idx) => (
                <li key={idx} className="text-sm text-gray-800 leading-relaxed">
                  <span className="font-medium">{idx + 1}.</span>{" "}
                  {item}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}
