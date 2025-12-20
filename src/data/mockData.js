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
        rating: 4.9
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
        rating: 4.7
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
        rating: 4.5
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
        rating: 4.6
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
        rating: 4.4
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
        rating: 4.7
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
        rating: 4.3
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
        rating: 4.8
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
        rating: 4.9
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
        rating: 4.7
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
        rating: 4.8
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
