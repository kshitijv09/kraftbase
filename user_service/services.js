const { PrismaClient } = require('@prisma/client');
const redisClient = require('../config/redisClient');

const prisma = new PrismaClient();

const fetchMenuDetails = async (menuId) => {
  const cacheKey = `menu:${menuId}`;

  try {
   
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const menu = await prisma.menu.findUnique({
      where: { menu_id: parseInt(menuId) },
      select: { price: true },
    });
    if (!menu) {
      throw new Error(`Menu item with ID ${menuId} not found`);
    }
    await redisClient.set(cacheKey, JSON.stringify(menu.price)); // Cache for 1 hour

    return menu.price;
  } catch (error) {
    throw new Error(`Error fetching menu details: ${error.message}`);
  }
};

const validateOrder = async (restaurantId, menuItems) => {
  try {
    const menuItemRestaurants = await Promise.all(
      menuItems.map(async (menuItem) => {
        const menu = await prisma.menu.findUnique({
          where: { menu_id: parseInt(menuItem.menuId) },
          select: { restaurant_id: true },
        });
        return menu.restaurant_id;
      })
    );

    const allBelongToSameRestaurant = menuItemRestaurants.every(
      (id) => id === parseInt(restaurantId)
    );

    if (!allBelongToSameRestaurant) {
      throw new Error('All menu items must belong to the specified restaurant');
    }

    return true;
  } catch (error) {
    throw new Error(`Validation error: ${error.message}`);
  }
};

module.exports = { fetchMenuDetails,validateOrder };
