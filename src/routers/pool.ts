import { FastifyInstance } from "fastify";
import prisma from "../config/prisma";
import { z } from "zod";
import shortUniqueId from 'short-unique-id'


export async function poolRoutes(fastify: FastifyInstance){
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
}