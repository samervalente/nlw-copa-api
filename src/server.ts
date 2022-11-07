import Fastify from "fastify";
import cors from "@fastify/cors";
import { poolRoutes } from "./routers/pool";
import { authRoutes } from "./routers/auth";
import { gameRoutes } from "./routers/game";
import { guessRoutes } from "./routers/guess";
import { userRoutes } from "./routers/user";
import jwt from '@fastify/jwt'
import dotenv from 'dotenv'

dotenv.config()

async function start() {
  const fastify = Fastify({
    logger: true, //errors monitor
  });

  await fastify.register(cors, {
    origin: true,
  });

  await fastify.register(jwt ,{
    secret:'@#872463'
  })

  await fastify.register(authRoutes)
  await fastify.register(userRoutes)
  await fastify.register(poolRoutes)
  await fastify.register(gameRoutes)
  await fastify.register(guessRoutes)

  await fastify.listen({ port: 4000 });
}

start();
