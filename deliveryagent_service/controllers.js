const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updateDeliveryStatus = async (req, res) => {
    const { id } = req.params;
    const { deliveryStatus } = req.body;
  
    try {
        const orders = await prisma.order.findMany({
            where: { order_id: id },
          });
      
          if (orders.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
          }
      
          await prisma.order.updateMany({
            where: { order_id: id},
            data: {
              delivery_status:deliveryStatus,
            },
          });
      
          const updatedOrders = await prisma.order.findMany({
            where: { order_id: id },
          });
  
      res.status(200).json({updatedOrders});
    } catch (error) {
      console.error('Error updating delivery status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  module.exports={updateDeliveryStatus}