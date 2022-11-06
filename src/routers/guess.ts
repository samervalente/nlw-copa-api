import { FastifyInstance } from "fastify";
import prisma from "../config/prisma";


export async function guessRoutes(fastify: FastifyInstance){
    fastify.get("/guesses/count", async () => {
        const count = await prisma.guess.count();
        return { count };
      });
    
}