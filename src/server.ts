import Fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import shortUniqueId from 'short-unique-id'

const prisma = new PrismaClient({
  log: ["query"],
});

async function start() {
  const fastify = Fastify({
    logger: true, //errors monitor
  });

  await fastify.register(cors, {
    origin: true,
  });

  fastify.post("/pools", async (request, response) => {
    const createPoolBody = z.object({
      title: z.string(),
    });
    const { title } = createPoolBody.parse(request.body);
    const generate = new shortUniqueId({length:6})
    const code = String(generate()).toUpperCase()

    await prisma.pool.create({
        data:{
            title,
            code, 
        }
    })

    response.status(201).send({ code });
  });

  fastify.get("/pools/count", async () => {
    const count = await prisma.pool.count();
    return { count };
  });

  fastify.get("/users/count", async () => {
    const count = await prisma.user.count();
    return { count };
  });

  fastify.get("/guesses/count", async () => {
    const count = await prisma.guess.count();
    return { count };
  });


  await fastify.listen({ port: 4000 });
}

start();
