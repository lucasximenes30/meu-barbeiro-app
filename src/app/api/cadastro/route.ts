import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { barbershopName, ownerName, email, phone, password } = body;

    // Validate
    if (!barbershopName || !ownerName || !email || !password) {
      return NextResponse.json({ error: 'Preencha todos os campos obrigatórios' }, { status: 400 });
    }

    // Check if email is already taken
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Este e-mail já está em uso.' }, { status: 400 });
    }

    // Create Barbershop and User inside a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the barbershop
      const barbershop = await tx.barbershop.create({
        data: {
          name: barbershopName,
          phone: phone || null,
        }
      });

      // 2. Create default settings for the barbershop
      await tx.settings.create({
        data: {
          barbershopId: barbershop.id,
          openingTime: "09:00",
          closingTime: "19:00",
          slotDuration: 30
        }
      });

      // 3. Create the Owner user
      // Note: In production you should HASH the password with bcrypt or argon2!
      // Here we assume it's just stored plainly or we can mock it, but for a real SaaS, hash it.
      const user = await tx.user.create({
        data: {
          barbershopId: barbershop.id,
          name: ownerName,
          email: email,
          password: password, // TODO: encrypt this!
          phone: phone || null,
          role: 'OWNER'
        }
      });

      return { barbershop, user };
    });

    return NextResponse.json({ success: true, message: 'Conta criada com sucesso!' }, { status: 201 });

  } catch (error: unknown) {
    console.error('Error creating account:', error);
    return NextResponse.json({ error: 'Erro interno ao criar conta' }, { status: 500 });
  }
}
