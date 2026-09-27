import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();


async function main() {

  // Limpia datos anteriores para evitar duplicados
  await prisma.task.deleteMany();


  // Datos iniciales reproducibles
  await prisma.task.createMany({

    data: [

      {
        text: "Estudiar Node.js",
        completed: false
      },

      {
        text: "Configurar Prisma con PostgreSQL",
        completed: true
      },

      {
        text: "Ejecutar pipeline CI/CD",
        completed: false
      }

    ]

  });


  console.log("✅ Seed ejecutado correctamente");

}


main()

  .catch((error) => {

    console.error(error);

    process.exit(1);

  })

  .finally(async () => {

    await prisma.$disconnect();

  });