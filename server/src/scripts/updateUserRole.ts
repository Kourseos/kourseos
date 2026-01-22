import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'creator@test.com';

    // Check if user exists
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.log(`User ${email} not found. Creating...`);
        // Create user if not exists (password hash for 'password123')
        await prisma.user.create({
            data: {
                email,
                name: 'Creator Test',
                password: '$2b$10$EpIxNwllqG.Wc.Wc.Wc.Wc.Wc.Wc.Wc.Wc.Wc.Wc.Wc.Wc.Wc.Wc', // Mock hash
                role: 'CREATOR',
                plan: 'DESPEGA'
            }
        });
    } else {
        console.log(`User ${email} found. Updating role to CREATOR...`);
        await prisma.user.update({
            where: { email },
            data: {
                role: 'CREATOR',
                plan: 'DESPEGA' // Ensure they have a good plan too
            },
        });
    }

    console.log('User updated successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
