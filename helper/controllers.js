const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createUser = async (req, res) => {
    const { email, name, age } = req.body;
  
    try {
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          age,
        },
      });
  
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  const createAgent = async (req, res) => {
    const { name} = req.body;
  
    try {
      const newAgent = await prisma.agent.create({
        data: {
          name,
        },
      });
  
      res.status(201).json(newAgent);
    } catch (error) {
      console.error('Error creating agent:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
module.exports={createUser,createAgent}
  