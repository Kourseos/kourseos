import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function testLogin() {
    const email = 'admin@skillforge.ai';
    const password = 'admin';

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        console.log('Error: Usuario no encontrado');
        return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`¿Pasa el login de ${email}? -> ${isMatch ? 'SÍ ✅' : 'NO ❌'}`);

    // Si no pasa, vamos a intentar ver qué hay guardado
    if (!isMatch) {
        console.log('Hash en DB:', user.password);
    }
}

testLogin()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
