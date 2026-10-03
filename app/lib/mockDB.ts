// // app/lib/mockDB.ts

// interface ProductData {
//   name: string; // Added name for display
//   price: number;
//   stock: number;
//   lastUpdated: string;
// }

// // SIMPLIFIED KEYS (single words make matching easier)
// const PRODUCT_PRICES: Record<string, ProductData> = {
//   "iphone": { name: "Apple iPhone 14", price: 799.00, stock: 15, lastUpdated: "10:00 AM" },
//   "samsung": { name: "Samsung Galaxy S23", price: 650.00, stock: 0, lastUpdated: "10:05 AM" },
//   "macbook": { name: "MacBook Air M2", price: 1100.00, stock: 3, lastUpdated: "09:30 AM" },
// };

// export const queryDynamicDB = (text: string) => {
//   const lowerText = text.toLowerCase();
  
//   // MATCHING LOGIC: Check if any key (e.g. "iphone") is inside the user's message
//   const foundKey = Object.keys(PRODUCT_PRICES).find(key => lowerText.includes(key));

//   if (foundKey) {
//     const data = PRODUCT_PRICES[foundKey];
//     return `
//       [DYNAMIC DATABASE RESULT]
//       Product: ${data.name}
//       Current Price: $${data.price}
//       Stock Level: ${data.stock > 0 ? data.stock + " units" : "OUT OF STOCK"}
//       Last Checked: ${data.lastUpdated}
//     `;
//   }
//   return null; // No product found in message
// };