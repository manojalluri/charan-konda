export const products = [
    {
        id: 1,
        name: "Premium Seer Fish (Vanjaram)",
        category: "Sea Fish",
        price: 850,
        image: "/sea_fish.png",
        description: "Freshly caught Seer Fish, known for its delicate texture and amazing taste. Perfect for frying and curries.",
        cuts: ["Uncut", "Cut & Cleaned"],
        stock: true,
        rating: 4.8,
        packSizes: ["250g", "500g", "1kg"],
        processing: "Belly Cleaned",
        minOrder: "500g",
        deliveryTime: "45-60 mins",
        quantityConfig: {
            "250g": true,
            "500g": true,
            "1kg": true,
            "custom": true,
            customMin: 250,
            customMax: 5000,
            customStep: 50
        }
    },
    {
        id: 2,
        name: "Fresh Tiger Prawns",
        category: "Prawns & Seafood",
        price: 650,
        image: "/prawns.png",
        description: "Juicy and tender Tiger Prawns, sourced daily from the coast. Cleaned and deveined for your convenience.",
        cuts: ["Uncut", "Cut & Cleaned"],
        stock: true,
        rating: 4.9,
        packSizes: ["500g", "1kg"],
        processing: "Deveined",
        minOrder: "1kg",
        deliveryTime: "30-45 mins"
    },
    {
        id: 3,
        name: "Indian Salmon (Rawas)",
        category: "Sea Fish",
        price: 950,
        image: "/sea_fish.png", // Reusing sea fish image
        description: "A popular choice for fish lovers, Rawas offers a rich flavor and soft texture. High in Omega-3.",
        cuts: ["Uncut", "Cut & Cleaned"],
        stock: true,
        rating: 4.7,
        packSizes: ["250g", "500g", "1kg"],
        processing: "Steak Cut",
        minOrder: "500g",
        deliveryTime: "45-60 mins"
    },
    {
        id: 4,
        name: "Rohu Fish (River Fish)",
        category: "Fresh Water Fish",
        price: 350,
        image: "/fresh_water.png",
        description: "Sweet water Rohu fish, a staple in many Indian households. Best for traditional fish curry.",
        cuts: ["Uncut", "Cut & Cleaned"],
        stock: true,
        rating: 4.5,
        packSizes: ["500g", "1kg", "2kg"],
        processing: "Curry Cut",
        minOrder: "1kg",
        deliveryTime: "60-90 mins"
    },
    {
        id: 5,
        name: "Black Pomfret",
        category: "Sea Fish",
        price: 700,
        image: "/sea_fish.png",
        description: "Delicious Black Pomfret with a unique taste. Great for tandoori or deep fry.",
        cuts: ["Uncut", "Cut & Cleaned"],
        stock: false, // Out of stock example
        rating: 4.6,
        packSizes: ["500g", "1kg"],
        processing: "Whole Cleaned",
        minOrder: "500g",
        deliveryTime: "45-60 mins"
    },
    {
        id: 6,
        name: "Catla Fish",
        category: "Fresh Water Fish",
        price: 320,
        image: "/fresh_water.png",
        description: "Fresh Catla, known for its large head and tender meat. Sourced from clean freshwater lakes.",
        cuts: ["Uncut", "Cut & Cleaned"],
        stock: true,
        rating: 4.4,
        packSizes: ["1kg", "2kg"],
        processing: "Bengali Cut",
        minOrder: "1kg",
        deliveryTime: "60-90 mins"
    },
    {
        id: 7,
        name: "White Prawns (Medium)",
        category: "Prawns & Seafood",
        price: 550,
        image: "/prawns.png",
        description: "Sweet and succulent medium-sized white prawns. Ideal for stir-fries and pasta.",
        cuts: ["Uncut", "Cut & Cleaned"],
        stock: true,
        rating: 4.7,
        packSizes: ["500g", "1kg"],
        processing: "Tail on",
        minOrder: "500g",
        deliveryTime: "30-45 mins"
    },
    {
        id: 8,
        name: "Mackerel (Bangda)",
        category: "Sea Fish",
        price: 280,
        image: "/sea_fish.png",
        description: "Oily fish rich in nutrients. Bangda is best enjoyed fried or in a spicy curry.",
        cuts: ["Uncut", "Cut & Cleaned"],
        stock: true,
        rating: 4.3,
        packSizes: ["500g", "1kg"],
        processing: "Whole",
        minOrder: "1kg",
        deliveryTime: "45-60 mins"
    },
    {
        id: 9,
        name: "Premium Chicken Curry Cut (Skinless)",
        category: "Chicken",
        price: 240,
        image: "/chicken.png",
        description: "Tender, antibiotic-free chicken cuts perfect for curries. Hygienically processed and packed.",
        cuts: ["Uncut", "Cut & Cleaned"],
        stock: true,
        rating: 4.8,
        packSizes: ["500g", "1kg", "2kg"],
        processing: "Curry Cut",
        minOrder: "500g",
        deliveryTime: "30 mins"
    },
    {
        id: 10,
        name: "Chicken Breast (Boneless)",
        category: "Chicken",
        price: 320,
        image: "/chicken.png",
        description: "Juicy, high-protein boneless chicken breast. Ideal for grilling, salads, and healthy meals.",
        cuts: ["Uncut", "Cut & Cleaned"],
        stock: true,
        rating: 4.9,
        packSizes: ["500g", "1kg"],
        processing: "Boneless fillets",
        minOrder: "500g",
        deliveryTime: "30 mins"
    },
    {
        id: 11,
        name: "Fresh Mutton Curry Cut",
        category: "Mutton",
        price: 850,
        image: "/mutton.png",
        description: "Premium quality tender mutton pieces including bone-in cuts. Perfect for rich gravies.",
        cuts: ["Uncut", "Cut & Cleaned"],
        stock: true,
        rating: 4.7,
        packSizes: ["500g", "1kg"],
        processing: "Medium Cut",
        minOrder: "500g",
        deliveryTime: "60-90 mins"
    },
    {
        id: 12,
        name: "Mutton Chops (Ribs)",
        category: "Mutton",
        price: 950,
        image: "/mutton.png",
        description: "Flavorful mutton chops, best suited for tandoori, frying, or roasting.",
        cuts: ["Uncut", "Cut & Cleaned"],
        stock: true,
        rating: 4.8,
        packSizes: ["500g", "1kg"],
        processing: "Rib Cut",
        minOrder: "5 mutton pieces",
        deliveryTime: "60-90 mins"
    }
];

export const categories = [
    { id: 'all', name: 'All' },
    { id: 'sea', name: 'Sea Fish' },
    { id: 'river', name: 'Fresh Water Fish' },
    { id: 'shellfish', name: 'Prawns & Seafood' },
    { id: 'chicken', name: 'Chicken' },
    { id: 'mutton', name: 'Mutton' }
];

export const reviews = [
    { id: 1, user: "Riya S.", text: "The fish was extremely fresh and the cut was perfect!", rating: 5 },
    { id: 2, user: "Arun K.", text: "Delivery was on time and packaging was hygienic.", rating: 5 },
    { id: 3, user: "Sneha M.", text: "Loved the prawns, tried the curry recipe and it was amazing.", rating: 4 }
];

// --- MISSING ADMIN MOCK DATA ---

export const dashboardStats = {
    todayOrders: 28,
    totalRestaurants: 15,
    pendingDeliveries: 8,
    todayQuantity: 145, // in kg
};

export const chartData = {
    dailyOrders: [
        { date: 'Mon', orders: 12 },
        { date: 'Tue', orders: 19 },
        { date: 'Wed', orders: 15 },
        { date: 'Thu', orders: 22 },
        { date: 'Fri', orders: 30 },
        { date: 'Sat', orders: 45 },
        { date: 'Sun', orders: 38 },
    ],
    productDemand: [
        { product: 'Seer Fish', quantity: 45 },
        { product: 'Prawns', quantity: 32 },
        { product: 'Chicken', quantity: 50 },
        { product: 'Mutton', quantity: 18 },
    ]
};

export const deliverySlots = [
    {
        id: 1,
        timeSlot: '08:00 AM - 10:00 AM',
        status: 'Completed',
        vehicle: 'VAN-01',
        driver: 'Ramesh Kumar',
        totalQuantity: '45kg',
        restaurants: ['The Coastal Kitchen', 'Blue Marine']
    },
    {
        id: 2,
        timeSlot: '10:00 AM - 12:00 PM',
        status: 'In Progress',
        vehicle: 'VAN-02',
        driver: 'Suresh Raina',
        totalQuantity: '32kg',
        restaurants: ['Sea Salt grill', 'Wave Catch']
    },
    {
        id: 3,
        timeSlot: '01:00 PM - 03:00 PM',
        status: 'Scheduled',
        vehicle: 'VAN-01',
        driver: 'Ramesh Kumar',
        totalQuantity: '28kg',
        restaurants: ['Ocean Breeze', 'Marina Dine']
    }
];

export const restaurants = [
    {
        id: '1',
        name: 'The Coastal Kitchen',
        area: 'HSR Layout',
        city: 'Bangalore',
        status: 'Active',
        phone: '+91 99887 76655',
        email: 'info@coastalkitchen.com',
        dailyRequirement: '15kg',
        joinedDate: '2024-01-15',
        preferredProducts: ['Seer Fish', 'Tiger Prawns']
    },
    {
        id: '2',
        name: 'Blue Marine',
        area: 'Indiranagar',
        city: 'Bangalore',
        status: 'Active',
        phone: '+91 88776 65544',
        email: 'orders@bluemarine.in',
        dailyRequirement: '10kg',
        joinedDate: '2024-02-10',
        preferredProducts: ['Pomfret', 'Crab']
    },
    {
        id: '3',
        name: 'Sea Salt Grill',
        area: 'Koramangala',
        city: 'Bangalore',
        status: 'Warning',
        phone: '+91 77665 54433',
        email: 'manager@seasalt.com',
        dailyRequirement: '12kg',
        joinedDate: '2024-03-05',
        preferredProducts: ['Salmon', 'Squid']
    }
];

export const orders = [
    {
        id: 'ORD-001',
        restaurantName: 'The Coastal Kitchen',
        contactPerson: 'Arjun Singh',
        product: 'Seer Fish',
        quantity: '5kg',
        deliveryDate: '2024-12-17',
        status: 'Delivered'
    },
    {
        id: 'ORD-002',
        restaurantName: 'Blue Marine',
        contactPerson: 'Sonia Nair',
        product: 'Tiger Prawns',
        quantity: '3kg',
        deliveryDate: '2024-12-17',
        status: 'Processing'
    },
    {
        id: 'ORD-003',
        restaurantName: 'Sea Salt Grill',
        contactPerson: 'Mohan Lal',
        product: 'Pomfret',
        quantity: '4kg',
        deliveryDate: '2024-12-18',
        status: 'Pending'
    }
];
