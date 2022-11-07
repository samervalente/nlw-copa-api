import { FastifyInstance } from "fastify";
import { z } from "zod";
import prisma from "../config/prisma";

export async function authRoutes(fastify: FastifyInstance){
    fastify.post('/users', async (req, res) => {
        const createUserBody = z.object({
            token: z.string(),
        })
        const {token} = createUserBody.parse(req.body)
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            method:'GET',
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        const userData = await userResponse.json()
        const userInfosSchema = z.object({
            id: z.string(),
            email:z.string().email(),
            name:z.string(),
            picture:z.string().url()
        })

        const userInfos = userInfosSchema.parse(userData)
        const {id, email, name, picture} = userInfos
        await prisma.user.upsert({
            where:{googleId: id},
            update:{
                googleId: id,
                email, 
                name,
                avatarUrl: picture},
            create:{
                googleId: id, 
                email, 
                name, 
                avatarUrl:picture}
        }
        )

        const sessionToken = fastify.jwt.sign({
            name, 
            avatatarUrl: picture
        }, {
            sub: id,
            expiresIn:'2 days'
        })

        res.status(201).send({sessionToken})
    })
}