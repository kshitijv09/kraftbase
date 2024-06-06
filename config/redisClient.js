const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({
 socket:{host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT},
  password: process.env.REDIS_PASSWORD 
});

redisClient.connect().then(()=>{
    console.log('Connected to Redis');
}).catch((err) => {
    console.log(err.message);
}
);

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.on('ready', () => {
  console.log('Redis client ready');
});

redisClient.on('end', () => {
  console.log('Redis client disconnected');
});

redisClient.on('reconnecting', () => {
  console.log('Redis client reconnecting');
});

module.exports = redisClient;
