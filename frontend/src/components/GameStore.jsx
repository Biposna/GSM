import { useMemo, useState } from "react";
import { ShoppingCart, Heart, MagnifyingGlass, X, Check } from "@phosphor-icons/react";
import { GAMES, ACCESSORIES } from "@/data/content";
import { toast } from "sonner";
import { useLang } from "@/i18n/LanguageContext";
import { useCart } from "@/cart/CartContext";

const GAME_PLATFORMS = ["All", "PS5", "Xbox Series X", "Xbox Series S", "Nintendo Switch", "PS4"];
const ACC_TYPES = ["All", "Controller", "Headset", "Earbuds", "Charger", "Power Bank", "Cable", "Case", "Mount", "Camera"];

const ACC_TYPE_PL = {
  All: "Wszystko",
  Controller: "Pad",
  Headset: "Słuchawki",
  Earbuds: "Słuchawki douszne",
  Charger: "Ładowarka",
  "Power Bank": "Powerbank",
  Cable: "Kabel",
  Case: "Etui",
  Mount: "Uchwyt",
  Camera: "Kamera",
};

export default function GameStore() {
  const { pick, fmtPrice } = useLang();
  const { add, items: cartItems, setOpen: openCart } = useCart();
  const [tab, setTab] = useState("games"); // "games" | "accessories"
  const [gameFilter, setGameFilter] = useState("All");
  const [accFilter, setAccFilter] = useState("All");
  const [query, setQuery] = useState("");

  const items = tab === "games" ? GAMES : ACCESSORIES;
  const activeFilter = tab === "games" ? gameFilter : accFilter;
  const setActiveFilter = tab === "games" ? setGameFilter : setAccFilter;
  const filterOptions = tab === "games" ? GAME_PLATFORMS : ACC_TYPES;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      const title = typeof it.title === "string" ? it.title : pick(it.title.en, it.title.pl);
      const matchQ =
        !q ||
        title.toLowerCase().includes(q) ||
        it.platform?.toLowerCase().includes(q) ||
        it.type?.toLowerCase().includes(q);
      if (!matchQ) return false;
      if (activeFilter === "All") return true;
      if (tab === "games") return it.platform === activeFilter;
      return it.type === activeFilter;
    });
  }, [items, activeFilter, query, tab, pick]);

  const labelForFilter = (p) => {
    if (p === "All") return pick("All", "Wszystko");
    if (tab === "accessories") return pick(p, ACC_TYPE_PL[p] ?? p);
    return p;
  };
  const titleOf = (it) => (typeof it.title === "string" ? it.title : pick(it.title.en, it.title.pl));

  const TABS = [
    { id: "games", en: "Games", pl: "Gry" },
    { id: "accessories", en: "Accessories", pl: "Akcesoria" },
  ];

  return (
    <section id="store" data-testid="store-section" className="relative py-20 sm:py-28 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <div>
            <div className="text-[11px] uppercase tracking-[0.28em] text-fuchsia-300 font-bold mb-4">
              {pick("/02 — Game Store", "/02 — Sklep z grami")}
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight max-w-2xl">
              {pick("Games & ", "Gry i ")}
              <span className="neon-text">{pick("accessories", "akcesoria")}</span>
              {pick(" for every console.", " do każdej konsoli.")}
            </h2>
            <p className="mt-4 text-white/60 max-w-xl text-base leading-relaxed">
              {pick(
                "From fresh drops to instant classics — plus official console and phone accessories: controllers, headsets, chargers, cables and cases.",
                "Od świeżych premier po klasyki — a do tego oficjalne akcesoria do konsol i telefonów: pady, słuchawki, ładowarki, kable i etui."
              )}
            </p>
          </div>
        </div>

        {/* Category tabs + Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div
            data-testid="store-tabs"
            className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] p-1 self-start"
            role="tablist"
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                data-testid={`store-tab-${t.id}`}
                onClick={() => {
                  setTab(t.id);
                  setQuery("");
                }}
                className={`px-5 py-2.5 rounded-full text-[11px] uppercase tracking-[0.22em] font-bold transition-all duration-300 ${
                  tab === t.id
                    ? "bg-cyan-400 text-black"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {pick(t.en, t.pl)}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative md:w-96 w-full">
            <MagnifyingGlass
              size={18}
              weight="bold"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              data-testid="store-search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                tab === "games"
                  ? pick("Search games or platform...", "Szukaj gier lub platformy...")
                  : pick("Search accessories...", "Szukaj akcesoriów...")
              }
              className="w-full bg-white/[0.03] border border-white/10 rounded-full pl-11 pr-10 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 transition"
            />
            {query && (
              <button
                data-testid="store-search-clear"
                onClick={() => setQuery("")}
                aria-label={pick("Clear search", "Wyczyść")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 grid place-items-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition"
              >
                <X size={14} weight="bold" />
              </button>
            )}
          </div>
        </div>

        {/* Sub-filter chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filterOptions.map((p) => (
            <button
              key={p}
              data-testid={`store-filter-${p.replace(/\s+/g, "-").toLowerCase()}`}
              onClick={() => setActiveFilter(p)}
              className={`px-4 py-2 rounded-full border text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 ${
                activeFilter === p
                  ? "bg-white text-black border-white"
                  : "text-white/70 border-white/15 hover:border-white/35 hover:text-white"
              }`}
            >
              {labelForFilter(p)}
            </button>
          ))}
        </div>

        {/* Grid */}
        {visible.length === 0 ? (
          <div
            data-testid="store-empty"
            className="py-20 text-center border border-dashed border-white/10 rounded-2xl"
          >
            <p className="text-white/60">
              {pick("No results match your search.", "Brak wyników dla Twojego wyszukiwania.")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {visible.map((g) => {
              const title = titleOf(g);
              const badgeTxt = g.tag ? (typeof g.tag === "string" ? g.tag : pick(g.tag.en, g.tag.pl)) : null;
              const secondaryChip = tab === "games" ? g.platform : pick(g.type, ACC_TYPE_PL[g.type] ?? g.type);
              return (
                <article
                  key={g.id}
                  data-testid={`${tab === "games" ? "game" : "accessory"}-card-${g.id}`}
                  className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d14] transition-all duration-300 hover:-translate-y-1 hover:border-fuchsia-400/40 hover:shadow-[0_20px_60px_-20px_rgba(184,41,255,0.35)]"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={g.image}
                      alt={title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                    {badgeTxt && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-fuchsia-500/90 text-white text-[10px] uppercase tracking-[0.2em] font-bold">
                        {badgeTxt}
                      </span>
                    )}

                    <button
                      data-testid={`store-wishlist-${g.id}`}
                      onClick={() =>
                        toast.success(
                          pick(`Added "${title}" to wishlist`, `Dodano "${title}" do listy życzeń`)
                        )
                      }
                      className="absolute top-3 right-3 w-9 h-9 grid place-items-center rounded-full bg-black/60 backdrop-blur border border-white/10 text-white/80 hover:text-fuchsia-300 hover:border-fuchsia-400/50 transition"
                      aria-label={pick("Wishlist", "Lista życzeń")}
                    >
                      <Heart size={16} weight="bold" />
                    </button>

                    <div className="absolute bottom-3 left-3 flex gap-1.5">
                      <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur text-[9px] uppercase tracking-[0.22em] font-bold text-cyan-300 border border-cyan-400/30">
                        {g.platform}
                      </span>
                      {tab === "accessories" && (
                        <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur text-[9px] uppercase tracking-[0.22em] font-bold text-fuchsia-300 border border-fuchsia-400/30">
                          {secondaryChip}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 flex flex-col gap-3">
                    <h3 className="font-display font-bold text-white text-base leading-tight line-clamp-2">
                      {title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="font-display font-black text-xl text-cyan-300">
                        {fmtPrice(g.price)}
                      </div>
                      <button
                        data-testid={`store-buy-${g.id}`}
                        onClick={() => {
                          add(g.id, 1);
                          openCart(true);
                          toast.success(
                            pick(`Added "${title}" to cart`, `Dodano "${title}" do koszyka`)
                          );
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 ${
                          cartItems.some((c) => c.id === g.id)
                            ? "bg-emerald-400 text-black border-emerald-400"
                            : "bg-white/5 border-white/10 text-white hover:bg-cyan-400 hover:text-black hover:border-cyan-400"
                        }`}
                      >
                        {cartItems.some((c) => c.id === g.id) ? (
                          <>
                            <Check size={14} weight="bold" />
                            {pick("In cart", "W koszyku")}
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={14} weight="bold" />
                            {pick("Buy", "Kup")}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
