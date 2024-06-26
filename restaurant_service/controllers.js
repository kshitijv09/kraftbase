const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {assignAgentToOrder}=require("./services")

const addRestaurant=async (req,res)=>{
    const {name,address,availability,menus}=req.body
    try {
        const newRestaurant = await prisma.restaurant.create({
          data: {
            name,
            address,
            availability,
            menus: {
              create: menus,
            }
          },
        });
        
        const createdRestaurant = await prisma.restaurant.findUnique({
          where: { restaurant_id: newRestaurant.restaurant_id },
          include: { menus: true }
        });

        res.status(201).json(createdRestaurant);
      } catch (error) {
        console.error('Error adding restaurant:', error);
        res.status(500).json({ error:error.message });
      }
}

const updateRestaurantDetails=async(req,res)=>{
    const { id } = req.params;
    const { availability, menus } = req.body;

    try{
        if(availability){
         await prisma.restaurant.update({
            where: { restaurant_id: parseInt(id) },
            data: { availability },
          });
        }

          if (menus && menus.length > 0) {
            for (const menu of menus) {
              if (menu.menu_id) {
            
                await prisma.menu.update({
                  where: { menu_id: menu.menu_id,restaurant_id:parseInt(id) },
                  data: {
                    item: menu.item,
                    price: menu.price,
                  },
                });
              } else {
                await prisma.menu.create({
                  data: {
                    item: menu.item,
                    price: menu.price,
                    restaurant_id: parseInt(id),
                  },
                });
              }
            }
          }

          const updatedRestaurant=await prisma.restaurant.findUnique({where:{restaurant_id:parseInt(id)},include:{menus:true}})
          res.status(200).json(updatedRestaurant);
    }
    catch(error){
        console.error('Error updating restaurant:', error);
    res.status(500).json({ error: error.message });

    }
}

const approveOrder = async (req, res) => {
  const { id } = req.params;
  const { acceptStatus, deliveryStatus } = req.body;

  try {
    if (acceptStatus === 'reject') {
      return res.status(400).json({ error: 'Order rejected.' });
    }
    
    const {agentId} = await assignAgentToOrder();
    
    await prisma.order.updateMany({
      where: { order_id: id },
      data: {
        accept_status:acceptStatus,
        delivery_status:deliveryStatus,
        agent_id: agentId,
      },
    });

    await prisma.agent.update({
      where: { agent_id: agentId },
      data: {
        availability: false,
      },
    });

    const updatedOrder=await prisma.order.findMany({where:{order_id:id}})
    let totalAmount = updatedOrder.reduce((sum, order) => sum + parseFloat(order.amount), 0);

    res.status(200).json({totalAmount,updatedOrder});
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: error.message });
  }
}



module.exports={addRestaurant,updateRestaurantDetails,approveOrder,assignAgentToOrder}
