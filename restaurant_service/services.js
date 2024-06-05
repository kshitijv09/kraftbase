const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const assignAgentToOrder = async () => {
    try {
      // Find the first available agent
      const availableAgent = await prisma.Agent.findFirst({
        where: { availability: true },
      });
  
      if (!availableAgent) {
        throw new Error('No available agents');
      }
  
      return availableAgent;
    } catch (error) {
      throw new Error(`Error assigning agent to order: ${error.message}`);
    }
  }

module.exports = {assignAgentToOrder};