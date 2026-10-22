export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  brand: string;
  description: string;
  features: string[];
  inStock: boolean;
}

export const products: Product[] = [
  // ── COMPUTADORES ──────────────────────────────────────────────────────────
  {
    id: "1",
    name: "Lenovo IdeaPad 3",
    price: 1899900,
    originalPrice: 2799000,
    rating: 4.3,
    reviews: 1245,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMG5vdGVib29rfGVufDF8fHx8MTc5MDIxNTUwNHww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "computadores",
    brand: "Lenovo",
    description: "Portátil ideal para estudio y trabajo diario con procesador AMD y amplia duración de batería.",
    features: [
      "Procesador AMD Ryzen 5 5500U",
      "8GB RAM DDR4",
      "256GB SSD NVMe",
      "Pantalla 15.6\" FHD",
      "Windows 11 Home"
    ],
    inStock: true
  },
  {
    id: "2",
    name: "ASUS VivoBook 15",
    price: 2249900,
    rating: 4.4,
    reviews: 987,
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxsYXB0b3AlMjBjb21wdXRlciUyMG5vdGVib29rfGVufDF8fHx8MTc5MDIxNTUwNHww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "computadores",
    brand: "ASUS",
    description: "Portátil delgado y ligero con pantalla NanoEdge y desempeño confiable para el día a día.",
    features: [
      "Procesador Intel Core i5-1235U",
      "8GB RAM LPDDR4X",
      "512GB SSD NVMe",
      "Pantalla 15.6\" FHD IPS NanoEdge",
      "Lector de huella dactilar"
    ],
    inStock: true
  },
  {
    id: "3",
    name: "HP Pavilion 15",
    price: 2499900,
    originalPrice: 3499000,
    rating: 4.5,
    reviews: 1563,
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxsYXB0b3AlMjBjb21wdXRlciUyMG5vdGVib29rfGVufDF8fHx8MTc5MDIxNTUwNHww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "computadores",
    brand: "HP",
    description: "Portátil versátil con diseño moderno, ideal para productividad y entretenimiento.",
    features: [
      "Procesador Intel Core i7-1255U",
      "16GB RAM DDR4",
      "512GB SSD NVMe",
      "Pantalla 15.6\" FHD IPS micro-edge",
      "Gráficos Intel Iris Xe"
    ],
    inStock: true
  },
  {
    id: "4",
    name: "Acer Aspire 5",
    price: 2199900,
    rating: 4.2,
    reviews: 2134,
    image: "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw4fHxsYXB0b3AlMjBjb21wdXRlciUyMG5vdGVib29rfGVufDF8fHx8MTc5MDIxNTUwNHww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "computadores",
    brand: "Acer",
    description: "Portátil equilibrado con excelente relación calidad-precio para uso cotidiano.",
    features: [
      "Procesador AMD Ryzen 5 5625U",
      "8GB RAM DDR4",
      "512GB SSD NVMe",
      "Pantalla 15.6\" FHD IPS",
      "Wi-Fi 6 y Bluetooth 5.1"
    ],
    inStock: true
  },
  {
    id: "5",
    name: "Dell Inspiron 15",
    price: 2699900,
    originalPrice: 3799000,
    rating: 4.6,
    reviews: 876,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxsYXB0b3AlMjBjb21wdXRlciUyMG5vdGVib29rfGVufDF8fHx8MTc5MDIxNTUwNHww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "computadores",
    brand: "Dell",
    description: "Portátil premium con diseño elegante y alto rendimiento para profesionales.",
    features: [
      "Procesador Intel Core i7-1255U",
      "16GB RAM DDR4",
      "512GB SSD NVMe",
      "Pantalla 15.6\" FHD antirreflejo",
      "Windows 11 Pro"
    ],
    inStock: true
  },
  {
    id: "6",
    name: "ASUS TUF Gaming F15",
    price: 3199900,
    originalPrice: 4799000,
    rating: 4.7,
    reviews: 654,
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxsYXB0b3AlMjBjb21wdXRlciUyMG5vdGVib29rfGVufDF8fHx8MTc5MDIxNTUwNHww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "computadores",
    brand: "ASUS",
    description: "Portátil gaming con diseño robusto, refrigeración avanzada y GPU dedicada para juegos exigentes.",
    features: [
      "Procesador Intel Core i7-12700H",
      "16GB RAM DDR5",
      "512GB SSD NVMe PCIe 4.0",
      "NVIDIA GeForce RTX 3050 4GB",
      "Pantalla 15.6\" FHD 144Hz"
    ],
    inStock: true
  },

  // ── MONITORES ─────────────────────────────────────────────────────────────
  {
    id: "7",
    name: "Samsung Essential 24\"",
    price: 349900,
    rating: 4.3,
    reviews: 3214,
    image: "https://images.unsplash.com/photo-1547658718-1cdaa0852790?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMG1vbml0b3IlMjBkaXNwbGF5JTIwc2NyZWVufGVufDF8fHx8MTc5MDIxNTUwNHww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "monitores",
    brand: "Samsung",
    description: "Monitor de entrada con excelente calidad de imagen para el trabajo y el hogar.",
    features: [
      "Panel IPS 24\"",
      "Resolución Full HD 1920x1080",
      "75Hz con AMD FreeSync",
      "Tiempo de respuesta 5ms",
      "Entradas HDMI y VGA"
    ],
    inStock: true
  },
  {
    id: "8",
    name: "LG UltraGear 24\" Gaming",
    price: 599900,
    originalPrice: 1099000,
    rating: 4.6,
    reviews: 1876,
    image: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxjb21wdXRlciUyMG1vbml0b3IlMjBkaXNwbGF5JTIwc2NyZWVufGVufDF8fHx8MTc5MDIxNTUwNHww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "monitores",
    brand: "LG",
    description: "Monitor gaming de alta velocidad con panel IPS y sincronización adaptativa para máxima fluidez.",
    features: [
      "Panel IPS 24\" Full HD",
      "165Hz de frecuencia de refresco",
      "1ms de tiempo de respuesta (GtG)",
      "G-Sync Compatible y FreeSync Premium",
      "DisplayPort 1.4 + HDMI 2.0"
    ],
    inStock: true
  },
  {
    id: "9",
    name: "ASUS TUF Gaming 27\"",
    price: 899900,
    originalPrice: 1499000,
    rating: 4.7,
    reviews: 943,
    image: "https://images.unsplash.com/photo-1545665277-5937489579f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxjb21wdXRlciUyMG1vbml0b3IlMjBkaXNwbGF5JTIwc2NyZWVufGVufDF8fHx8MTc5MDIxNTUwNHww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "monitores",
    brand: "ASUS",
    description: "Monitor gaming QHD con tecnología HDR y alta frecuencia de refresco para máxima competitividad.",
    features: [
      "Panel IPS 27\" QHD 2560x1440",
      "165Hz y 1ms MPRT",
      "HDR10 y sRGB 130%",
      "G-Sync Compatible",
      "Soporte VESA 100x100mm"
    ],
    inStock: true
  },
  {
    id: "10",
    name: "Lenovo ThinkVision 24\"",
    price: 619900,
    rating: 4.4,
    reviews: 1123,
    image: "https://images.unsplash.com/photo-1666771410140-0573b232426e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxjb21wdXRlciUyMG1vbml0b3IlMjBkaXNwbGF5JTIwc2NyZWVufGVufDF8fHx8MTc5MDIxNTUwNHww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "monitores",
    brand: "Lenovo",
    description: "Monitor profesional con calibración de color precisa, ideal para diseño y productividad.",
    features: [
      "Panel IPS 24\" Full HD",
      "75Hz con AMD FreeSync",
      "Cobertura sRGB 99%",
      "Pivote, altura e inclinación ajustables",
      "USB-C con carga 65W integrado"
    ],
    inStock: true
  },
  {
    id: "11",
    name: "AOC Gaming 27\"",
    price: 699900,
    originalPrice: 1299000,
    rating: 4.5,
    reviews: 1432,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxjb21wdXRlciUyMG1vbml0b3IlMjBkaXNwbGF5JTIwc2NyZWVufGVufDF8fHx8MTc5MDIxNTUwNHww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "monitores",
    brand: "AOC",
    description: "Monitor gaming de gran formato con panel VA y colores vibrantes para inmersión total.",
    features: [
      "Panel VA 27\" Full HD",
      "165Hz y 1ms MPRT",
      "G-Sync Compatible y FreeSync Premium",
      "Shadow Control para zonas oscuras",
      "Base con iluminación RGB"
    ],
    inStock: true
  },
  {
    id: "12",
    name: "Samsung Odyssey G5 27\"",
    price: 949900,
    originalPrice: 1699000,
    rating: 4.8,
    reviews: 789,
    image: "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxjb21wdXRlciUyMG1vbml0b3IlMjBkaXNwbGF5JTIwc2NyZWVufGVufDF8fHx8MTc5MDIxNTUwNHww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "monitores",
    brand: "Samsung",
    description: "Monitor curvo QHD con curvatura 1000R, HDR y alta tasa de refresco para gamers exigentes.",
    features: [
      "Panel VA curvo 1000R, 27\" QHD 2560x1440",
      "165Hz con AMD FreeSync Premium",
      "HDR10 y tiempo de respuesta 1ms",
      "Sin marcos en tres lados",
      "HDMI 2.0 x2 + DisplayPort 1.2"
    ],
    inStock: true
  },

  // ── AUDIO ─────────────────────────────────────────────────────────────────
  {
    id: "13",
    name: "JBL Tune 770NC",
    price: 349900,
    originalPrice: 499000,
    rating: 4.4,
    reviews: 2341,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXMlMjBibHVldG9vdGglMjBhdWRpb3xlbnwxfHx8fDE3OTAyMTU1MDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "audio",
    brand: "JBL",
    description: "Audífonos inalámbricos con cancelación activa de ruido y hasta 70 horas de reproducción.",
    features: [
      "Cancelación activa de ruido (ANC)",
      "70 horas de batería con ANC desactivado",
      "Conexión multipoint a 2 dispositivos",
      "Diseño plegable y ligero",
      "JBL Pure Bass Sound"
    ],
    inStock: true
  },
  {
    id: "14",
    name: "Sony WH-CH720N",
    price: 349900,
    rating: 4.5,
    reviews: 1876,
    image: "https://images.unsplash.com/photo-1567928513899-997d98489fbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHx3aXJlbGVzcyUyMGhlYWRwaG9uZXMlMjBibHVldG9vdGglMjBhdWRpb3xlbnwxfHx8fDE3OTAyMTU1MDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "audio",
    brand: "Sony",
    description: "Audífonos inalámbricos ultralivianos con cancelación de ruido AI y sonido Sony de alta calidad.",
    features: [
      "Cancelación de ruido AI adaptativa",
      "35 horas de batería con ANC",
      "Diseño ultraligero de solo 192g",
      "Carga rápida USB-C (10 min = 1.5 h)",
      "Bluetooth 5.2 Multipoint"
    ],
    inStock: true
  },
  {
    id: "15",
    name: "JBL Flip 6",
    price: 519900,
    originalPrice: 599000,
    rating: 4.6,
    reviews: 3456,
    image: "https://images.unsplash.com/photo-1558537348-c0f8e733989d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxibHVldG9vdGglMjBwb3J0YWJsZSUyMHNwZWFrZXIlMjBKQkx8ZW58MXx8fHwxNzkwMjE1NTExfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "audio",
    brand: "JBL",
    description: "Parlante portátil resistente al agua con sonido potente y graves profundos para cualquier aventura.",
    features: [
      "IP67 resistente al agua y al polvo",
      "12 horas de reproducción continua",
      "JBL PartyBoost para vincular altavoces",
      "Carga USB-C",
      "Potencia de 20W RMS"
    ],
    inStock: true
  },
  {
    id: "16",
    name: "Sony WF-1000XM5",
    price: 899900,
    originalPrice: 1199000,
    rating: 4.8,
    reviews: 987,
    image: "https://images.unsplash.com/photo-1585298723682-7115561c51b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHx3aXJlbGVzcyUyMGhlYWRwaG9uZXMlMjBibHVldG9vdGglMjBhdWRpb3xlbnwxfHx8fDE3OTAyMTU1MDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "audio",
    brand: "Sony",
    description: "Audífonos intraurales premium con la mejor cancelación de ruido del mercado y audio Hi-Res inalámbrico.",
    features: [
      "Cancelación de ruido líder en la industria",
      "Audio Hi-Res inalámbrico (LDAC)",
      "8h batería + 16h adicionales con estuche",
      "Bluetooth Multipoint y IPX4",
      "Chip QN2e de procesamiento de audio"
    ],
    inStock: true
  },
  {
    id: "17",
    name: "Bose QuietComfort",
    price: 999900,
    rating: 4.7,
    reviews: 2134,
    image: "https://images.unsplash.com/photo-1641048930621-ab5d225ae5b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXMlMjBibHVldG9vdGglMjBhdWRpb3xlbnwxfHx8fDE3OTAyMTU1MDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "audio",
    brand: "Bose",
    description: "Audífonos de referencia con cancelación de ruido legendaria de Bose y comodidad incomparable todo el día.",
    features: [
      "Cancelación de ruido Bose de clase mundial",
      "24 horas de batería con ANC activo",
      "Modo Aware para escuchar el entorno",
      "Carga USB-C rápida",
      "Peso ligero de 254g"
    ],
    inStock: true
  },
  {
    id: "18",
    name: "JBL PartyBox Encore",
    price: 1299900,
    originalPrice: 1599000,
    rating: 4.5,
    reviews: 654,
    image: "https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVldG9vdGglMjBwb3J0YWJsZSUyMHNwZWFrZXIlMjBKQkx8ZW58MXx8fHwxNzkwMjE1NTExfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "audio",
    brand: "JBL",
    description: "Parlante portátil para fiestas con luces LED dinámicas, micrófono incluido y sonido potente de 100W.",
    features: [
      "100W de potencia RMS",
      "Luces LED dinámicas sincronizadas",
      "Micrófono alámbrico incluido",
      "Hasta 6 horas de batería",
      "IPX4 y modo TWS Stereo"
    ],
    inStock: true
  },

  // ── ACCESORIOS ────────────────────────────────────────────────────────────
  {
    id: "19",
    name: "Samsung Galaxy Watch 6",
    price: 899900,
    originalPrice: 1399000,
    rating: 4.6,
    reviews: 1234,
    image: "https://images.unsplash.com/photo-1660844817855-3ecc7ef21f12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwd2VhcmFibGUlMjB0ZWNoJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzkwMjE1NTA2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "accesorios",
    brand: "Samsung",
    description: "Smartwatch premium con seguimiento avanzado de salud, diseño elegante y Galaxy AI integrado.",
    features: [
      "Monitor de salud avanzado (ECG, presión arterial)",
      "Pantalla Super AMOLED 1.3\"",
      "Resistencia al agua 5ATM + MIL-STD-810H",
      "Hasta 2 días de batería",
      "Galaxy AI y análisis de sueño"
    ],
    inStock: true
  },
  {
    id: "20",
    name: "Apple Watch SE",
    price: 999900,
    rating: 4.7,
    reviews: 2341,
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxzbWFydHdhdGNoJTIwd2VhcmFibGUlMjB0ZWNoJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzkwMjE1NTA2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "accesorios",
    brand: "Apple",
    description: "El Apple Watch esencial con funciones avanzadas de salud y seguridad en un diseño compacto y accesible.",
    features: [
      "Chip S8 de Apple de doble núcleo",
      "Detección de caídas y accidentes de tráfico",
      "Resistencia al agua hasta 50m",
      "GPS integrado y brújula",
      "watchOS actualizado"
    ],
    inStock: true
  },
  {
    id: "21",
    name: "Base Refrigerante para Portátil",
    price: 79900,
    originalPrice: 159000,
    rating: 4.3,
    reviews: 4567,
    image: "https://images.unsplash.com/photo-1593640404951-24f6ef605031?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxVU0IlMjBodWIlMjBsYXB0b3AlMjBzdGFuZCUyMGNvb2xpbmclMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3OTAyMTU1MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "accesorios",
    brand: "Cooler Master",
    description: "Base con ventiladores de alta potencia que mantiene tu portátil a temperatura óptima durante sesiones largas.",
    features: [
      "5 ventiladores de alto flujo de aire",
      "Compatible con portátiles de hasta 17\"",
      "Panel LED azul con control de velocidad",
      "2 puertos USB adicionales",
      "Superficie antideslizante"
    ],
    inStock: true
  },
  {
    id: "22",
    name: "Hub USB-C 7 en 1",
    price: 89900,
    rating: 4.5,
    reviews: 3214,
    image: "https://images.unsplash.com/photo-1749048573961-5ef1a26bcfd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxVU0IlMjBodWIlMjBsYXB0b3AlMjBzdGFuZCUyMGNvb2xpbmclMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3OTAyMTU1MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "accesorios",
    brand: "UGREEN",
    description: "Expande la conectividad de tu portátil con 7 puertos esenciales en un solo adaptador compacto de aluminio.",
    features: [
      "Salida HDMI 4K a 30Hz",
      "3 puertos USB-A 3.0 (5Gbps)",
      "USB-C Power Delivery 100W",
      "Lector de tarjetas SD y MicroSD",
      "Carcasa de aluminio premium"
    ],
    inStock: true
  },
  {
    id: "23",
    name: "Cargador USB-C 65W",
    price: 119900,
    originalPrice: 219000,
    rating: 4.6,
    reviews: 5678,
    image: "https://images.unsplash.com/photo-1461141346587-763ab02bced9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxzbWFydHdhdGNoJTIwd2VhcmFibGUlMjB0ZWNoJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzkwMjE1NTA2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "accesorios",
    brand: "Anker",
    description: "Cargador compacto GaN de alta potencia con carga rápida para portátiles, tablets y smartphones.",
    features: [
      "Tecnología GaN de tercera generación",
      "65W de potencia máxima",
      "Compatible con USB-C Power Delivery 3.0",
      "Protección contra sobrecarga y sobrecalentamiento",
      "Tamaño 40% más pequeño que cargadores convencionales"
    ],
    inStock: true
  },
  {
    id: "24",
    name: "Soporte Ajustable para Portátil",
    price: 69900,
    rating: 4.4,
    reviews: 6789,
    image: "https://images.unsplash.com/photo-1634947096506-6d9f114cf64e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxVU0IlMjBodWIlMjBsYXB0b3AlMjBzdGFuZCUyMGNvb2xpbmclMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3OTAyMTU1MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "accesorios",
    brand: "UGREEN",
    description: "Soporte ergonómico con altura ajustable para mejorar la postura y la ventilación del portátil.",
    features: [
      "6 niveles de altura ajustables",
      "Compatible con portátiles de hasta 17\"",
      "Plegable y ultraportátil",
      "Pads antideslizantes de silicona",
      "Construcción en aluminio ligero"
    ],
    inStock: true
  },

  // ── PERIFÉRICOS ───────────────────────────────────────────────────────────
  {
    id: "25",
    name: "Logitech G213 Gaming Keyboard",
    price: 149900,
    originalPrice: 299000,
    rating: 4.4,
    reviews: 3456,
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWNoYW5pY2FsJTIwa2V5Ym9hcmQlMjBnYW1pbmclMjBwZXJpcGhlcmFsfGVufDF8fHx8MTc5MDIxNTUwNnww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "perifericos",
    brand: "Logitech",
    description: "Teclado gaming con retroiluminación RGB por zonas y teclas resistentes a derrames para gamers.",
    features: [
      "Retroiluminación LIGHTSYNC RGB en 5 zonas",
      "Teclas de membrana de tacto mecánico",
      "Resistente a derrames",
      "Reposamuñecas integrado",
      "Cable USB desmontable"
    ],
    inStock: true
  },
  {
    id: "26",
    name: "Logitech G502 HERO",
    price: 299900,
    rating: 4.7,
    reviews: 4321,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMG1vdXNlJTIwd2lyZWxlc3MlMjBnYW1pbmd8ZW58MXx8fHwxNzkwMjE1NTEyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "perifericos",
    brand: "Logitech",
    description: "Mouse gaming de alta precisión con sensor HERO 25K y sistema de pesos ajustables.",
    features: [
      "Sensor HERO 25K DPI ajustable",
      "11 botones programables",
      "Sistema de pesos ajustables 5x3.6g",
      "RGB LIGHTSYNC",
      "Cable USB con malla trenzada"
    ],
    inStock: true
  },
  {
    id: "27",
    name: "Razer BlackWidow V3",
    price: 549900,
    originalPrice: 599000,
    rating: 4.8,
    reviews: 1987,
    image: "https://images.unsplash.com/photo-1626958390943-a70309376444?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBsYXB0b3AlMjBSR0IlMjBrZXlib2FyZHxlbnwxfHx8fDE3OTAyMTU1MTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "perifericos",
    brand: "Razer",
    description: "Teclado mecánico premium con switches Razer Green auditivos y retroiluminación Chroma RGB por tecla.",
    features: [
      "Switches mecánicos Razer Green (clicky)",
      "Chroma RGB por tecla (16.8M colores)",
      "Reposamuñecas magnético de cuero sintético",
      "USB pass-through 2.0",
      "Cable USB trenzado desmontable"
    ],
    inStock: true
  },
  {
    id: "28",
    name: "Logitech MX Master 3S",
    price: 549900,
    rating: 4.8,
    reviews: 5432,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxjb21wdXRlciUyMG1vdXNlJTIwd2lyZWxlc3MlMjBnYW1pbmd8ZW58MXx8fHwxNzkwMjE1NTEyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "perifericos",
    brand: "Logitech",
    description: "Mouse inalámbrico de productividad con scroll electromagnético MagSpeed y sensor de precisión 8K DPI.",
    features: [
      "Sensor 8K DPI de alta precisión",
      "Scroll electromagnético MagSpeed",
      "Conexión a 3 dispositivos (Bluetooth + USB)",
      "70 días de batería",
      "Carga USB-C rápida"
    ],
    inStock: true
  },
  {
    id: "29",
    name: "Razer DeathAdder V2",
    price: 179900,
    originalPrice: 299000,
    rating: 4.6,
    reviews: 2876,
    image: "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxjb21wdXRlciUyMG1vdXNlJTIwd2lyZWxlc3MlMjBnYW1pbmd8ZW58MXx8fHwxNzkwMjE1NTEyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "perifericos",
    brand: "Razer",
    description: "Mouse gaming ergonómico con sensor óptico Focus+ de 20K DPI y switches ópticos ultrarrápidos.",
    features: [
      "Sensor óptico Focus+ 20K DPI",
      "Switches ópticos Razer (activan con luz)",
      "Chroma RGB",
      "8 botones programables",
      "Cable SpeedFlex de ultra-baja resistencia"
    ],
    inStock: true
  },
  {
    id: "30",
    name: "Logitech K380",
    price: 159900,
    rating: 4.5,
    reviews: 7654,
    image: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxtZWNoYW5pY2FsJTIwa2V5Ym9hcmQlMjBnYW1pbmclMjBwZXJpcGhlcmFsfGVufDF8fHx8MTc5MDIxNTUwNnww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "perifericos",
    brand: "Logitech",
    description: "Teclado Bluetooth compacto y multidispositivo, ideal para trabajar desde cualquier lugar con cualquier sistema.",
    features: [
      "Conecta hasta 3 dispositivos con Easy-Switch",
      "Bluetooth 3.0",
      "Hasta 24 meses de batería (2 pilas AAA)",
      "Diseño compacto con teclas redondas",
      "Compatible con Windows, macOS, iOS y Android"
    ],
    inStock: true
  }
];

export const categories = [
  { id: "computadores", name: "Computadores", icon: "💻", count: 6 },
  { id: "monitores", name: "Monitores", icon: "🖥️", count: 6 },
  { id: "audio", name: "Audio", icon: "🎧", count: 6 },
  { id: "accesorios", name: "Accesorios", icon: "⌚", count: 6 },
  { id: "perifericos", name: "Periféricos", icon: "⌨️", count: 6 }
];

export const brands = [
  "Lenovo",
  "ASUS",
  "HP",
  "Acer",
  "Dell",
  "Samsung",
  "LG",
  "AOC",
  "JBL",
  "Sony",
  "Anker",
  "Logitech",
  "Razer"
];
