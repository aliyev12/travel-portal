const { gql } = require("apollo-server-express");

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.

const typeDefs = gql`
  type Tour {
    id: ID!
    name: String!
    duration: Int
    maxGroupSize: Int
    difficulty: String!
    ratingsQuantity: Int
    summary: String
    description: String
    images: [String]
    createdAt: String
    startDates: [String]
    secretTour: Boolean
    imageCover: String
    rating: Float
    ratingsAverage: Float
    price: Int
    priceDiscount: Int
    slug: String
    startLocation: StartLocation
    locations: [Location]
    guides: [Guide]
  }

  type StartLocation {
    type: String
    description: String
    coordinates: [Float]
    address: String
  }

  type Location {
    _id: String
    type: String
    coordinates: [Float]
    description: String
    day: Int
  }

  type Query {
    getAllTours: [Tour]
    getTour(slug: String!): Tour
  }

  enum AllowedRoles {
    user
    guide
    lead_guide
    admin
  }

  type Guide {
    id: ID!
    role: AllowedRoles
    name: String!
    email: String!
    photo: String
    createdAt: String
    updatedAt: String
    _id: String
  }
`;

module.exports = typeDefs;

// const tourShape = {
//   createdAt: {
//     type: Date,
//     default: Date.now()
//     // select: false
//   },
//   startDates: [Date],
//   secretTour: {
//     type: Boolean,
//     default: false
//   },
//   imageCover: String,
//   rating: {
//     type: Number,
//     default: 4.5
//   },
//   ratingsAverage: {
//     type: Number,
//     default: 4.5,
//     min: [1, "Rating must be above 1.0"],
//     max: [5, "Rating must be below 5.0"],
//     set: val => Math.round(val * 10) / 10
//   },
//   price: {
//     type: Number,
//     required: [true, "A tour must have a price"]
//   },
//   priceDiscount: {
//     type: Number,
//     validate: {
//       validator: function(val) {
//         // The "this" is only when creating a new document, and NOT when updating an existing one!
//         return val < this.price;
//       },
//       message: `Price discount {VALUE} cannot be more than the price.`
//     }
//   },
//   slug: String,
//   startLocation: {
//     // GeoJSON
//     type: {
//       type: String,
//       default: "Point",
//       enum: ["Point"]
//     },
//     coordinates: [Number],
//     address: String,
//     description: String
//   },
//   locations: [
//     {
//       type: {
//         type: String,
//         default: "Point",
//         enum: ["Point"]
//       },
//       coordinates: [Number],
//       address: String,
//       description: String,
//       day: Number
//     }
//   ],
//   guides: [
//     {
//       type: mongoose.Schema.ObjectId,
//       ref: "User"
//     }
//   ]
// };
/*
            {
                "startLocation": {
                    "type": "Point",
                    "description": "Miami, USA",
                    "coordinates": [
                        -80.185942,
                        25.774772
                    ],
                    "address": "301 Biscayne Blvd, Miami, FL 33132, USA"
                },
                "ratingsQuantity": 4,
                "images": [
                    "tour-2-1.jpg",
                    "tour-2-2.jpg",
                    "tour-2-3.jpg"
                ],
                "createdAt": "2019-12-28T16:14:31.664Z",
                "startDates": [
                    "2021-06-19T09:00:00.000Z",
                    "2021-07-20T09:00:00.000Z",
                    "2021-08-18T09:00:00.000Z"
                ],
                "secretTour": false,
                "rating": 4.5,
                "ratingsAverage": 4.8,
                "guides": [],
                "_id": "5c88fa8cf4afda39709c2955",
                "name": "The Sea Explorer",
                "duration": 7,
                "maxGroupSize": 15,
                "difficulty": "medium",
                "price": 497,
                "summary": "Exploring the jaw-dropping US east coast by foot and by boat",
                "description": "Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\nIrure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
                "imageCover": "tour-2-cover.jpg",
                "locations": [
                    {
                        "type": "Point",
                        "coordinates": [
                            -80.128473,
                            25.781842
                        ],
                        "_id": "5c88fa8cf4afda39709c2959",
                        "description": "Lummus Park Beach",
                        "day": 1
                    },
                    {
                        "type": "Point",
                        "coordinates": [
                            -80.647885,
                            24.909047
                        ],
                        "_id": "5c88fa8cf4afda39709c2958",
                        "description": "Islamorada",
                        "day": 2
                    },
                    {
                        "type": "Point",
                        "coordinates": [
                            -81.0784,
                            24.707496
                        ],
                        "_id": "5c88fa8cf4afda39709c2957",
                        "description": "Sombrero Beach",
                        "day": 3
                    },
                    {
                        "type": "Point",
                        "coordinates": [
                            -81.768719,
                            24.552242
                        ],
                        "_id": "5c88fa8cf4afda39709c2956",
                        "description": "West Key",
                        "day": 5
                    }
                ],
                "updatedAt": "2019-12-28T16:14:33.379Z",
                "slug": "the-sea-explorer",
                "updatedFromNow": "38 days and 10 hours and 54765 minutes ago",
                "createdFromNow": "38 days and 10 hours and 54765 minutes ago",
                "id": "5c88fa8cf4afda39709c2955"
            },
*/
