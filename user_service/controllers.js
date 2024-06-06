const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {fetchMenuDetails, validateOrder}=require("./services")
const { v4: uuidv4 } = require('uuid');

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
        res.status(500).json({ error: error.message });
      }
}

const placeOrder = async (req, res) => {
    const { restaurantId, menuItems, userId, deliveryAddress } = req.body;
    let totalAmount = 0;
  
    try {
      await validateOrder(restaurantId, menuItems);
      const order_id = uuidv4();
  
      // Create an order for each menu item and calculate the total amount
      
      const orders = await Promise.all(
        menuItems.map(async (menu) => {
          const  price  = await fetchMenuDetails(menu.menuId);
          const amount = parseInt(menu.quantity * price);
          totalAmount += parseInt(amount);
  
          return prisma.order.create({
            data: {
              order_id,
              restaurant_id: parseInt(restaurantId),
              menu_id: parseInt(menu.menuId),
              user_id: parseInt(userId),
              quantity: parseInt(menu.quantity),
              delivery_address: deliveryAddress,
              amount: parseFloat(amount),
            },
          });
        })
      );
  
      res.status(201).json({ orderId:orders[0].order_id,orders, totalAmount: totalAmount.toFixed(2) });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: error.message });
    }
  };

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
      res.status(500).json({ error: error.message });
    }
  }

  const rateAgent = async (req, res) => {
    const { id } = req.params;
    const { newRating } = req.body;
  
    try {
        const agent = await prisma.agent.findUnique({
            where: { agent_id: parseInt(id) },
            select: { rating: true, deliveryCount: true },
          });
      
          if (!agent) {
            throw new Error('Agent not found');
          }
          
          const { rating, deliveryCount } = agent;
      
          // Calculate the new rating and update completed deliveries
          const updatedRating = (parseInt(rating) * parseInt(deliveryCount) + parseInt(newRating)) / (deliveryCount + 1);
      
          // Update the agent with the new rating and increment completed deliveries
          const updatedAgent = await prisma.agent.update({
            where: { agent_id: parseInt(id) },
            data: {
              rating: (parseFloat(updatedRating)).toFixed(2),
              deliveryCount: {
                increment: 1,
              },
            },
          });
      
         
  
      res.status(200).json(updatedAgent);
    } catch (error) {
      console.error('Error updating agent rating:', error);
      res.status(500).json({ error: error.message });
    }
  }

module.exports={placeOrder,rateAgent,rateOrder,getAllRestaurants}