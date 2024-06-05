const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { v4: uuidv4 } = require('uuid');
const redisClient = require('../config/redisClient');

const getAllRestaurants=async (req,res)=>{

    
    try {
        const restaurants = await prisma.restaurant.findMany({
          where: { availability :'online' },
          include: {
            menus: true,
          },
        });
    
        res.json(restaurants);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
}

const createOrder=async(req,res)=>{
    const { restaurantId, menuItems, userId,deliveryAddress } = req.body;

    try {
      // Create an order for each menu item
      const order_id=uuidv4()
      const orders = await Promise.all(
        menuItems.map(menu =>
          prisma.order.create({
            data: {
              order_id,
              restaurant_id:parseInt(restaurantId),
              menu_id:parseInt(menu.menuId),
              user_id:parseInt(userId),
              quantity:parseInt(menu.quantity),
              delivery_address:deliveryAddress
            },
          })
        )
      );
  
      res.status(201).json(orders);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
}

const rateOrder = async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;
  
    try {
        const orders = await prisma.order.findMany({
            where: { order_id: id },
          });
      
          // Update the rating for each order
          await Promise.all(
            orders.map(order =>
              prisma.order.updateMany({
                where: { order_id: order.order_id },
                data: {
                  rating: parseInt(rating),
                },
              })
            )
          );

          const updatedOrder=await prisma.order.findMany({where:{order_id:id}})
  
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error('Error updating order rating:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  const rateAgent = async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;
  
    try {
      const updatedAgent = await prisma.Agent.update({
        where: { agent_id: parseInt(id) },
        data: {
          rating: parseInt(rating),
        },
      });
  
      res.status(200).json(updatedAgent);
    } catch (error) {
      console.error('Error updating agent rating:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

module.exports={createOrder,rateAgent,rateOrder,getAllRestaurants}