import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const users = [
        {
            email: 'admin@skillforge.ai',
            password: 'Admin123!',
            name: 'SkillForge Admin',
            role: 'ADMIN',
        },
        {
            email: 'student@skillforge.ai',
            password: 'student',
            name: 'SkillForge Student',
            role: 'STUDENT',
        }
    ];

    console.log('-----------------------------------------');
    console.log('ACTUALIZANDO CREDENCIALES DEL SISTEMA...');

    for (const userData of users) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        await prisma.user.upsert({
            where: { email: userData.email },
            update: {
                password: hashedPassword,
                role: userData.role as any,
                name: userData.name,
            },
            create: {
                email: userData.email,
                password: hashedPassword,
                name: userData.name,
                role: userData.role as any,
            },
        });

        console.log(`✅ ${userData.role}: ${userData.email} | Pass: ${userData.password}`);
    }

    console.log('-----------------------------------------');
    console.log('¡SISTEMA LISTO PARA ACCESO!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
