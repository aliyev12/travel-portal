const Tour = require("../../models/tourModel");

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    getAllTours: async (parent, args, context, info) => {
      const tours = await Tour.find();
      return tours;
    }
  }
};
module.exports = resolvers;
/*
  {
    startLocation: {
      type: "Point",
      description: "Miami, USA",
      coordinates: [-80.185942, 25.774772],
      address: "301 Biscayne Blvd, Miami, FL 33132, USA"
    },
    ratingsQuantity: 4,
    images: ["tour-2-1.jpg", "tour-2-2.jpg", "tour-2-3.jpg"],
    createdAt: "2019-12-28T16:14:31.664Z",
    startDates: [
      "2021-06-19T09:00:00.000Z",
      "2021-07-20T09:00:00.000Z",
      "2021-08-18T09:00:00.000Z"
    ],
    secretTour: false,
    rating: 4.5,
    ratingsAverage: 4.8,
    guides: ["5c8a22c62f8fb814b56fa18b", "5c8a1f4e2f8fb814b56fa185"],
    _id: "5c88fa8cf4afda39709c2955",
    name: "The Sea Explorer",
    duration: 7,
    maxGroupSize: 15,
    difficulty: "medium",
    price: 497,
    summary: "Exploring the jaw-dropping US east coast by foot and by boat",
    description:
      "Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\nIrure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    imageCover: "tour-2-cover.jpg",
    locations: [
      {
        type: "Point",
        coordinates: [-80.128473, 25.781842],
        _id: "5c88fa8cf4afda39709c2959",
        description: "Lummus Park Beach",
        day: 1
      },
      {
        type: "Point",
        coordinates: [-80.647885, 24.909047],
        _id: "5c88fa8cf4afda39709c2958",
        description: "Islamorada",
        day: 2
      },
      {
        type: "Point",
        coordinates: [-81.0784, 24.707496],
        _id: "5c88fa8cf4afda39709c2957",
        description: "Sombrero Beach",
        day: 3
      },
      {
        type: "Point",
        coordinates: [-81.768719, 24.552242],
        _id: "5c88fa8cf4afda39709c2956",
        description: "West Key",
        day: 5
      }
    ],
    updatedAt: "2019-12-28T16:14:33.379Z",
    slug: "the-sea-explorer",
    __v: 0,
    id: "5c88fa8cf4afda39709c2955"
  },
*/
