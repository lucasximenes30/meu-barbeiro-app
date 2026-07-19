import 'dotenv/config';
async function main() {
  const { prisma } = await import('./src/lib/prisma.js');
  console.log('Barbershops:', await prisma.barbershop.findMany());
  console.log('Users:', await prisma.user.findMany());
}
main();
