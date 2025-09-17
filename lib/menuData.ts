// This file contains menu data for two restaurants.
// Each restaurant has a name, description, and a menu with detailed items.

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  calories?: number;
  ingredients?: string[];
  allergens?: string[];
  spicyLevel?: number; // 0-3
};

export type RestaurantMenu = {
  restaurantId: string;
  restaurantName: string;
  description: string;
  menu: MenuItem[];
};

export const restaurants: RestaurantMenu[] = [
  {
    restaurantId: "bistro-avenue",
    restaurantName: "Bistro Avenue",
    description: "A cozy European bistro offering classic and modern dishes.",
    menu: [
      {
        id: "ba-1",
        name: "Truffle Mushroom Risotto",
        description:
          "Creamy Arborio rice with wild mushrooms, truffle oil, and parmesan.",
        price: 18.5,
        category: "Main Course",
        imageUrl: "/images/risotto.jpg",
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: true,
        calories: 650,
        ingredients: [
          "Arborio rice",
          "Mushrooms",
          "Truffle oil",
          "Parmesan",
          "Cream",
        ],
        allergens: ["Dairy"],
        spicyLevel: 0,
      },
      {
        id: "ba-2",
        name: "Classic French Onion Soup",
        description:
          "Rich beef broth, caramelized onions, topped with melted Gruyère and croutons.",
        price: 9.0,
        category: "Soup",
        imageUrl: "/images/onion-soup.jpg",
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
        calories: 320,
        ingredients: ["Beef broth", "Onions", "Gruyère", "Croutons"],
        allergens: ["Dairy", "Gluten"],
        spicyLevel: 0,
      },
      {
        id: "ba-3",
        name: "Lemon Tart",
        description:
          "Tangy lemon curd in a buttery pastry shell, served with whipped cream.",
        price: 7.5,
        category: "Dessert",
        imageUrl: "/images/lemon-tart.jpg",
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: false,
        calories: 410,
        ingredients: ["Lemon", "Eggs", "Butter", "Flour", "Sugar"],
        allergens: ["Eggs", "Dairy", "Gluten"],
        spicyLevel: 0,
      },
    ],
  },
  {
    restaurantId: "spice-harbor",
    restaurantName: "Spice Harbor",
    description:
      "A vibrant Indian restaurant serving authentic and fusion dishes.",
    menu: [
      {
        id: "sh-1",
        name: "Paneer Tikka Masala",
        description:
          "Grilled paneer cubes in a creamy tomato and cashew sauce, served with naan.",
        price: 15.0,
        category: "Main Course",
        imageUrl: "/images/paneer-tikka.jpeg",
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: true,
        calories: 540,
        ingredients: ["Paneer", "Tomato", "Cashew", "Cream", "Spices"],
        allergens: ["Dairy", "Nuts"],
        spicyLevel: 2,
      },
      {
        id: "sh-2",
        name: "Chicken Biryani",
        description:
          "Fragrant basmati rice cooked with marinated chicken, saffron, and spices.",
        price: 17.0,
        category: "Main Course",
        imageUrl: "/images/chicken-biryani.jpg",
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
        calories: 720,
        ingredients: ["Chicken", "Basmati rice", "Saffron", "Spices", "Yogurt"],
        allergens: ["Dairy"],
        spicyLevel: 3,
      },
      {
        id: "sh-3",
        name: "Mango Lassi",
        description: "Refreshing yogurt-based mango drink, lightly sweetened.",
        price: 5.0,
        category: "Beverage",
        imageUrl: "/images/mango-lassi.jpg",
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: true,
        calories: 180,
        ingredients: ["Mango", "Yogurt", "Sugar"],
        allergens: ["Dairy"],
        spicyLevel: 0,
      },
    ],
  },
];
