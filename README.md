# Food Delivery System

## Overview
This project consists of several microservices designed to work together to form a complete application. Each microservice is responsible for a specific part of the application and communicates with the others as needed.

### Microservices
1. **User Service**
2. **Restaurant Service**
3. **Delivery Agent Service**

## Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/kshitijv09/kraftbase.git
   cd kraftbase
2. **Install dependencies**
   ```sh
   npm install
3. **Set up environment variables**
4. Run database migrations 
   ```sh
   npx prisma migrate dev --name init
5. Running the application
   ```sh
   npm start

## Endpoints

The following endpoints are available in this food delivery application:

### BASEURL: https://kraftbase-ovzk.onrender.com

### User Service

#### `GET user/list`

Description: Retrieve a list of all restaurants available online at the given hour.

Example Response:{
    "restaurants": [
         {
        "restaurant_id": 2,
        "name": "Madras Cafe",
        "address": " Sethurpatti, Some Block Road,Somewhere, Chennai",
        "availability": "online",
        "menus": [
            {
                "menu_id": 4,
                "item": "Idli",
                "price": 30,
                "restaurant_id": 2
            },
        ]
    },
    ]
}
#### `POST user/order`

Description: Place the order from the available restaurants.

Example Request:{
    "restaurantId":2,
    "userId":1,
    "deliveryAddress":"H-2/3 Koramangala Bangalore, Karnataka",
    "menuItems":[
        {"menuId":5,"quantity":1},
        {"menuId":5,"quantity":2}
    ]
}

Example Response:{
    "orderId": "33a182a6-e90b-411b-a316-48052586a2d0",
    "orders": [
        {
            "order_serial_no": 18,
            "order_id": "33a182a6-e90b-411b-a316-48052586a2d0",
            "rating": null,
            "accept_status": "pending",
            "delivery_status": null,
            "delivery_address": "H-2/3 Koramangala Bangalore, Karnataka",
            "quantity": 1,
            "amount": 150,
            "restaurant_id": 2,
            "user_id": 1,
            "agent_id": null,
            "menu_id": 5
        }
    ],
    "totalAmount": "450.00"
}

#### `PUT user/rateorder/:orderId`

Description: Rate delivery order (1-5)

Example Request:{
    "rating":3
}

Example Response:{
[
    {
        "order_serial_no": 18,
        "order_id": "33a182a6-e90b-411b-a316-48052586a2d0",
        "rating": 3,
        "accept_status": "accept",
        "delivery_status": "inTransit",
        "delivery_address": "H-2/3 Koramangala Bangalore, Karnataka",
        "quantity": 1,
        "amount": 150,
        "restaurant_id": 2,
        "user_id": 1,
        "agent_id": 1,
        "menu_id": 5
    },
    {
        "order_serial_no": 19,
        "order_id": "33a182a6-e90b-411b-a316-48052586a2d0",
        "rating": 3,
        "accept_status": "accept",
        "delivery_status": "inTransit",
        "delivery_address": "H-2/3 Koramangala Bangalore, Karnataka",
        "quantity": 2,
        "amount": 300,
        "restaurant_id": 2,
        "user_id": 1,
        "agent_id": 1,
        "menu_id": 5
    }
]
}

#### `PUT user/rateagent/:agentId`

Description: Rate delivery agent (1-5)

Example Request:{
    "newRating":5
}

Example Response:{
    "agent_id": 2,
    "name": "Anoop",
    "rating": "4.17",
    "availability": false,
    "deliveryCount": 6
}

### Restaurant Service

#### `POST restaurant/add`

Description: Add a restaurant along with its menu

Example Request:{
    "name":"Idrees Biryani",
    "address":"Major Road, Kolkata WB",
    "availability":"online",
    "menus":[
        {"item":"Biryani","price":100.00}
    ]
}

Example Response:{
    "restaurant_id": 10,
    "name": "Idrees Biryani",
    "address": "Major Road, Kolkata WB",
    "availability": "online",
    "menus": [
        {
            "menu_id": 17,
            "item": "Biryani",
            "price": 100,
            "restaurant_id": 10
        }
    ]
}

#### `PUT restaurant/update/:restaurantId`

Description: Update menu as well as availability status (online/offline)
Example Request:{
    "availability":"offline",
     "menus":[
        {"menu_id":7,"item":"Samosa","price":45}
     ]
}

Example Response:{
    "restaurant_id": 3,
    "name": "Flying Saucer",
    "address": " Sector-5, Ashiyana Road,Somewhere, Lucknow",
    "availability": "offline",
    "menus": [
        {
            "menu_id": 8,
            "item": "Cheesecake",
            "price": 90,
            "restaurant_id": 3
        }
    ]
}

#### `PUT restaurant/approve/:orderId`

Description: Accept or reject an order. Assign an available delivery agent if order accepted.

Example Request:{
    "acceptStatus":"accepted",
    "deliveryStatus":"inTransit"
}

Example Response:{
    "totalAmount": 450,
    "updatedOrder": [
        {
            "order_serial_no": 18,
            "order_id": "33a182a6-e90b-411b-a316-48052586a2d0",
            "rating": null,
            "accept_status": "accepted",
            "delivery_status": "inTransit",
            "delivery_address": "H-2/3 Koramangala Bangalore, Karnataka",
            "quantity": 1,
            "amount": 150,
            "restaurant_id": 2,
            "user_id": 1,
            "agent_id": 4,
            "menu_id": 5
        }
    ]
}

### Delivery Agent Service

#### `PUT agent/update/:orderId`

Description: Update Order status (inTransit/completed)

Example Request:{
    "deliveryStatus":"completed"
}

Example Response:{
    "updatedOrders": [
        {
            "order_serial_no": 7,
            "order_id": "dd966e71-53a5-4a66-9df8-76c39e347326",
            "rating": 5,
            "accept_status": "pending",
            "delivery_status": "completed",
            "delivery_address": "My Home",
            "quantity": 3,
            "amount": 60,
            "restaurant_id": 2,
            "user_id": 1,
            "agent_id": null,
            "menu_id": 6
        }
    ]
}

## Tech Stack

- **Node.js**: JavaScript runtime for building the server-side application.
- **Prisma**: ORM for database management and queries.
- **PostgreSQL**: Relational database management system for storing data.
- **Redis**: In-memory data structure store, used for caching.
- **Docker**: Containerization platform for running the microservices.

   
