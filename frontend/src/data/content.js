// Static content for As Game & GSM with EN + PL translations.
export const SERVICES = [
  {
    id: "phone-repair",
    title: { en: "Phone Repair", pl: "Naprawa telefonów" },
    tag: { en: "Smartphones", pl: "Smartfony" },
    blurb: {
      en: "Screen, battery, charging port, water damage and board-level repair for iPhone, Samsung, Xiaomi & more.",
      pl: "Ekran, bateria, port ładowania, zalania i naprawa płyty głównej — iPhone, Samsung, Xiaomi i inne.",
    },
    from: 119,
    icon: "DeviceMobile",
    span: "md:col-span-2",
    tone: "cyan",
    image:
      "https://images.pexels.com/photos/6754839/pexels-photo-6754839.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    id: "console-repair",
    title: { en: "Console Repair", pl: "Naprawa konsol" },
    tag: { en: "PS • Xbox • Switch", pl: "PS • Xbox • Switch" },
    blurb: {
      en: "HDMI port, laser, thermal paste, overheating fixes and firmware restoration for every major console.",
      pl: "Port HDMI, laser, pasta termoprzewodząca, przegrzewanie i odbudowa firmware dla każdej konsoli.",
    },
    from: 199,
    icon: "GameController",
    tone: "purple",
    image:
      "https://images.unsplash.com/photo-1549928435-3c73c585aeea?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzR8MHwxfHNlYXJjaHw0fHxnYW1pbmclMjBjb25zb2xlJTIwcmVwYWlyJTIwbmVvbnxlbnwwfHx8fDE3NzczMjEyNTR8MA&ixlib=rb-4.1.0&q=85",
  },
  {
    id: "tablet-repair",
    title: { en: "Tablet Repair", pl: "Naprawa tabletów" },
    tag: { en: "iPad • Galaxy Tab", pl: "iPad • Galaxy Tab" },
    blurb: {
      en: "Digitizer, LCD, home button and battery service for tablets of every generation.",
      pl: "Digitizer, LCD, przycisk home i wymiana baterii dla tabletów każdej generacji.",
    },
    from: 159,
    icon: "DeviceTablet",
    tone: "cyan",
  },
  {
    id: "controller-repair",
    title: { en: "Controller Repair", pl: "Naprawa padów" },
    tag: {
      en: "Stick drift • Triggers",
      pl: "Drift gałek • Triggery",
    },
    blurb: {
      en: "Say goodbye to stick drift. Full joystick rebuilds, trigger and bumper replacement.",
      pl: "Koniec z driftem. Kompletna regeneracja gałek, wymiana triggerów i bumperów.",
    },
    from: 79,
    icon: "GameController",
    tone: "green",
  },
  {
    id: "cleaning",
    title: { en: "Deep Cleaning", pl: "Czyszczenie i serwis" },
    tag: {
      en: "Dust • Thermal • Fans",
      pl: "Kurz • Termika • Wiatraki",
    },
    blurb: {
      en: "Full teardown, dust extraction, fan service and premium thermal compound re-application.",
      pl: "Pełny rozbiór, odkurzanie, serwis wentylatorów i wymiana pasty termoprzewodzącej premium.",
    },
    from: 99,
    icon: "Wind",
    span: "md:col-span-2",
    tone: "green",
    image:
      "https://images.unsplash.com/photo-1771014817844-327a14245bd1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwzfHxjeWJlcnB1bmslMjBuZW9uJTIwZ2FtaW5nJTIwYmFja2dyb3VuZHxlbnwwfHx8fDE3NzczMjEyNjV8MA&ixlib=rb-4.1.0&q=85",
  },
];

export const GAMES = [
  {
    id: "g-1",
    title: "Cyber Runner 2099",
    platform: "PS5",
    price: 249.99,
    tag: { en: "NEW", pl: "NOWOŚĆ" },
    image:
      "https://images.unsplash.com/photo-1763986365305-109ad3ddbf2b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBuZW9uJTIwZ2FtaW5nJTIwYmFja2dyb3VuZHxlbnwwfHx8fDE3NzczMjEyNjV8MA&ixlib=rb-4.1.0&q=85",
  },
  {
    id: "g-2",
    title: "Neon Drift Legacy",
    platform: "Xbox Series X",
    price: 199.99,
    image:
      "https://images.unsplash.com/photo-1610561212775-b191f21b6998?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGdhbWUlMjBjb250cm9sbGVyJTIwbmVvbnxlbnwwfHx8fDE3NzczMjEyNjV8MA&ixlib=rb-4.1.0&q=85",
  },
  {
    id: "g-3",
    title: "Pixel Warriors Remix",
    platform: "Nintendo Switch",
    price: 159.99,
    tag: { en: "HOT", pl: "HIT" },
    image:
      "https://images.pexels.com/photos/18161125/pexels-photo-18161125.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    id: "g-4",
    title: "Shadow Protocol VII",
    platform: "PS5",
    price: 279.99,
    image:
      "https://images.pexels.com/photos/7862493/pexels-photo-7862493.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    id: "g-5",
    title: "Arcade Infinity",
    platform: "PS4",
    price: 99.99,
    tag: { en: "-40%", pl: "-40%" },
    image:
      "https://images.unsplash.com/photo-1771014817844-327a14245bd1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwzfHxjeWJlcnB1bmslMjBuZW9uJTIwZ2FtaW5nJTIwYmFja2dyb3VuZHxlbnwwfHx8fDE3NzczMjEyNjV8MA&ixlib=rb-4.1.0&q=85",
  },
  {
    id: "g-6",
    title: "Orbital Siege",
    platform: "Xbox Series S",
    price: 139.99,
    image:
      "https://images.unsplash.com/photo-1610561212775-b191f21b6998?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGdhbWUlMjBjb250cm9sbGVyJTIwbmVvbnxlbnwwfHx8fDE3NzczMjEyNjV8MA&ixlib=rb-4.1.0&q=85",
  },
  {
    id: "g-7",
    title: "Dreamfall: Awaken",
    platform: "Nintendo Switch",
    price: 179.99,
    image:
      "https://images.pexels.com/photos/7862493/pexels-photo-7862493.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    id: "g-8",
    title: "Helix Prime",
    platform: "PS5",
    price: 229.99,
    tag: { en: "NEW", pl: "NOWOŚĆ" },
    image:
      "https://images.pexels.com/photos/18161125/pexels-photo-18161125.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
];

export const TESTIMONIALS = [
  {
    id: "t1",
    name: "Marcus R.",
    role: { en: "PS5 Owner", pl: "Posiadacz PS5" },
    text: {
      en: "Dropped my PlayStation with HDMI issues. Got it back in 48 hours running better than new. Unreal service.",
      pl: "Oddałem PlayStation z problemem HDMI. W 48 godzin wrócił działając lepiej niż nowy. Rewelacja.",
    },
    rating: 5,
  },
  {
    id: "t2",
    name: "Leah K.",
    role: { en: "Streamer", pl: "Streamerka" },
    text: {
      en: "Controller drift was killing my aim. They rebuilt the sticks in under an hour. Absolute lifesavers.",
      pl: "Drift pada rujnował mi celowanie. Zregenerowali gałki w niecałą godzinę. Uratowali mi życie.",
    },
    rating: 5,
  },
  {
    id: "t3",
    name: "Tomas V.",
    role: { en: "iPhone User", pl: "Użytkownik iPhone" },
    text: {
      en: "Screen replacement done in 30 min, perfect color calibration. The shop feels like a gaming lounge.",
      pl: "Wymiana ekranu w 30 minut, idealna kalibracja kolorów. Sklep wygląda jak prawdziwa gaming loża.",
    },
    rating: 5,
  },
  {
    id: "t4",
    name: "Priya S.",
    role: { en: "Switch Fan", pl: "Fanka Switcha" },
    text: {
      en: "Bought two games and got a free deep-clean on my dock. These folks know what they're doing.",
      pl: "Kupiłam dwie gry i dostałam gratis czyszczenie doku. Ci ludzie naprawdę znają się na rzeczy.",
    },
    rating: 5,
  },
];

export const BRANDS = [
  "PlayStation",
  "Xbox",
  "Nintendo",
  "Apple",
  "Samsung",
  "Xiaomi",
  "Razer",
  "ASUS ROG",
  "Steam Deck",
  "Oculus",
];

export const ACCESSORIES = [
  {
    id: "a-1",
    title: { en: "DualSense Wireless Controller", pl: "Pad bezprzewodowy DualSense" },
    platform: "PS5",
    type: "Controller",
    price: 299.99,
    tag: { en: "BEST SELLER", pl: "BESTSELLER" },
    image:
      "https://images.unsplash.com/photo-1610561212775-b191f21b6998?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGdhbWUlMjBjb250cm9sbGVyJTIwbmVvbnxlbnwwfHx8fDE3NzczMjEyNjV8MA&ixlib=rb-4.1.0&q=85",
  },
  {
    id: "a-2",
    title: { en: "Xbox Wireless Controller — Carbon Black", pl: "Pad bezprzewodowy Xbox — Carbon Black" },
    platform: "Xbox",
    type: "Controller",
    price: 259.99,
    image:
      "https://images.pexels.com/photos/18161125/pexels-photo-18161125.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    id: "a-3",
    title: { en: "Pro Gaming Headset 7.1", pl: "Słuchawki gamingowe Pro 7.1" },
    platform: "Multi",
    type: "Headset",
    price: 449.0,
    tag: { en: "NEW", pl: "NOWOŚĆ" },
    image:
      "https://images.unsplash.com/photo-1771014817844-327a14245bd1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwzfHxjeWJlcnB1bmslMjBuZW9uJTIwZ2FtaW5nJTIwYmFja2dyb3VuZHxlbnwwfHx8fDE3NzczMjEyNjV8MA&ixlib=rb-4.1.0&q=85",
  },
  {
    id: "a-4",
    title: { en: "iPhone USB-C 30W Fast Charger", pl: "Ładowarka iPhone USB-C 30W Fast" },
    platform: "iPhone",
    type: "Charger",
    price: 129.0,
    image:
      "https://images.pexels.com/photos/6754839/pexels-photo-6754839.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    id: "a-5",
    title: { en: "Braided USB-C Cable 2m", pl: "Kabel USB-C pleciony 2m" },
    platform: "Multi",
    type: "Cable",
    price: 49.0,
    image:
      "https://images.pexels.com/photos/7862493/pexels-photo-7862493.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    id: "a-6",
    title: { en: "Switch OLED Carry Case", pl: "Etui transportowe Switch OLED" },
    platform: "Switch",
    type: "Case",
    price: 89.0,
    image:
      "https://images.unsplash.com/photo-1763986365305-109ad3ddbf2b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBuZW9uJTIwZ2FtaW5nJTIwYmFja2dyb3VuZHxlbnwwfHx8fDE3NzczMjEyNjV8MA&ixlib=rb-4.1.0&q=85",
  },
  {
    id: "a-7",
    title: { en: "Samsung Galaxy Tempered Glass", pl: "Szkło hartowane Samsung Galaxy" },
    platform: "Samsung",
    type: "Case",
    price: 39.0,
    tag: { en: "-30%", pl: "-30%" },
    image:
      "https://images.pexels.com/photos/6754839/pexels-photo-6754839.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    id: "a-8",
    title: { en: "PS5 HD Camera", pl: "Kamera HD do PS5" },
    platform: "PS5",
    type: "Camera",
    price: 269.0,
    image:
      "https://images.pexels.com/photos/18161125/pexels-photo-18161125.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    id: "a-9",
    title: { en: "MagSafe Wireless Charger 15W", pl: "Ładowarka bezprzewodowa MagSafe 15W" },
    platform: "iPhone",
    type: "Charger",
    price: 199.0,
    tag: { en: "NEW", pl: "NOWOŚĆ" },
    image:
      "https://images.pexels.com/photos/6754839/pexels-photo-6754839.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    id: "a-10",
    title: { en: "20000 mAh Fast Power Bank", pl: "Powerbank 20000 mAh Fast" },
    platform: "Multi",
    type: "Power Bank",
    price: 159.0,
    image:
      "https://images.pexels.com/photos/7862493/pexels-photo-7862493.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    id: "a-11",
    title: { en: "iPhone 15 Silicone Case (MagSafe)", pl: "Etui silikonowe iPhone 15 (MagSafe)" },
    platform: "iPhone",
    type: "Case",
    price: 89.0,
    image:
      "https://images.pexels.com/photos/6754839/pexels-photo-6754839.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    id: "a-12",
    title: { en: "USB-C to Lightning Cable 1m", pl: "Kabel USB-C do Lightning 1m" },
    platform: "iPhone",
    type: "Cable",
    price: 69.0,
    image:
      "https://images.unsplash.com/photo-1771014817844-327a14245bd1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwzfHxjeWJlcnB1bmslMjBuZW9uJTIwZ2FtaW5nJTIwYmFja2dyb3VuZHxlbnwwfHx8fDE3NzczMjEyNjV8MA&ixlib=rb-4.1.0&q=85",
  },
  {
    id: "a-13",
    title: { en: "Magnetic Car Mount", pl: "Magnetyczny uchwyt samochodowy" },
    platform: "Multi",
    type: "Mount",
    price: 79.0,
    image:
      "https://images.pexels.com/photos/7862493/pexels-photo-7862493.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    id: "a-14",
    title: { en: "Wireless Earbuds Pro ANC", pl: "Słuchawki bezprzewodowe Pro ANC" },
    platform: "Multi",
    type: "Earbuds",
    price: 299.0,
    tag: { en: "HOT", pl: "HIT" },
    image:
      "https://images.unsplash.com/photo-1771014817844-327a14245bd1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwzfHxjeWJlcnB1bmslMjBuZW9uJTIwZ2FtaW5nJTIwYmFja2dyb3VuZHxlbnwwfHx8fDE3NzczMjEyNjV8MA&ixlib=rb-4.1.0&q=85",
  },
];

export const STATS = [
  { value: "12K+", label: { en: "Devices Revived", pl: "Naprawionych urządzeń" } },
  { value: "48H", label: { en: "Average Turnaround", pl: "Średni czas realizacji" } },
  { value: "4.9★", label: { en: "Customer Rating", pl: "Ocena klientów" } },
  { value: "90D", label: { en: "Repair Warranty", pl: "Gwarancja na naprawę" } },
];
