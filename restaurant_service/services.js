const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const redisClient=require('../config/redisClient')

const assignAgentToOrder = async () => {
  try {
    const cacheKey = 'availableAgents';
    const cachedData = await getFromCache(cacheKey);

    if (cachedData) {
      // If cache exists, retrieve and remove the first agent ID
      const availableAgents = JSON.parse(cachedData);
      if (availableAgents.length > 0) {
        const agentId = availableAgents.shift();
        await setInCache(cacheKey, JSON.stringify(availableAgents));
        return { agentId };
      }
    }

    const allAgents = await prisma.agent.findMany({
        where: { availability: true },
        select: { agent_id: true },
      });
  
      if (!allAgents || allAgents.length === 0) {
        throw new Error('No available agents');
      }
  
      const availableAgent = allAgents[0];
      const remainingAgentIds = allAgents.slice(1).map(agent => agent.agent_id);

    await setInCache(cacheKey, JSON.stringify(remainingAgentIds));

    return { agentId: availableAgent.agent_id };
  } catch (error) {
    throw new Error(`Error assigning agent to order: ${error.message}`);
  }
};

const getFromCache = async (key) => {
  try {
    return await redisClient.get(key);
  } catch (error) {
    console.error(`Error fetching data from cache: ${error}`);
    return null;
  }
};

const setInCache = async (key, value) => {
  try {
    await redisClient.set(key, value);
  } catch (error) {
    console.error(`Error setting data in cache: ${error}`);
  }
};


module.exports = {assignAgentToOrder};