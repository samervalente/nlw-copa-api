import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Samer Valente",
      email: "samervalente@gmail.com",
      avatarUrl: "http://github.com/samervalente.png"
    },
  });

  const pool = await prisma.pool.create({
    data:{
      title:"Family Pool",
      code:"FAPOOL01",
      ownerId:user.id,

      participants:{
        create:{
          userId:user.id
        }
      }
    }
  })

  await prisma.game.create({
    data:{
      date: '2022-11-02T12:30:00.403Z', //new Date().toISOString()
      firstTeamCountryCode: 'BR',
      secondTeamCountryCode:'RS'
    }
  })

  await prisma.game.create({
    data:{
      date: '2022-11-03T12:30:00.403Z', //new Date().toISOString()
      firstTeamCountryCode: 'BR',
      secondTeamCountryCode:'CH',

      guesses:{
        create:{
          firstTeamGoals:3,
          secondTeamGoals:1,

          participant:{
            connect:{
              userId_poolId:{
                userId:user.id,
                poolId:pool.id  
              }
            }
          }
        }
      }
    }
  })
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
