const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
require('dotenv').config();

const prisma = new PrismaClient();

async function resetAdmin() {
    console.log('🔧 Script de Reseteo de Administrador\n');
    console.log('━'.repeat(60));

    const ADMIN_EMAIL = 'admin@skillforge.ai';
    const ADMIN_PASSWORD = 'Admin123!';
    const ADMIN_NAME = 'Administrator';

    try {
        // 1. Verificar usuario existente
        console.log('\n1️⃣  Buscando usuario admin existente...');
        const existingUser = await prisma.user.findUnique({
            where: { email: ADMIN_EMAIL }
        });

        if (existingUser) {
            console.log(`   ✅ Usuario encontrado: ${existingUser.email}`);
            console.log(`   📝 Rol actual: ${existingUser.role}`);
            console.log(`   🆔 ID: ${existingUser.id}`);

            // 2. Actualizar contraseña
            console.log('\n2️⃣  Actualizando contraseña...');
            const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

            const updatedUser = await prisma.user.update({
                where: { email: ADMIN_EMAIL },
                data: {
                    password: hashedPassword,
                    role: 'ADMIN',
                    name: ADMIN_NAME
                }
            });

            console.log(`   ✅ Usuario actualizado exitosamente`);
        } else {
            // 3. Crear nuevo usuario admin
            console.log(`   ℹ️  Usuario no encontrado, creando nuevo...\n`);

            console.log('2️⃣  Creando usuario administrador...');
            const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

            const newUser = await prisma.user.create({
                data: {
                    email: ADMIN_EMAIL,
                    password: hashedPassword,
                    name: ADMIN_NAME,
                    role: 'ADMIN',
                    plan: 'ENTERPRISE'
                }
            });

            console.log(`   ✅ Usuario creado exitosamente`);
            console.log(`   🆔 ID: ${newUser.id}`);
        }

        // 4. Verificar configuración final
        console.log('\n3️⃣  Verificando configuración final...');
        const finalUser = await prisma.user.findUnique({
            where: { email: ADMIN_EMAIL }
        });

        console.log(`   ✅ Email: ${finalUser.email}`);
        console.log(`   ✅ Nombre: ${finalUser.name}`);
        console.log(`   ✅ Rol: ${finalUser.role}`);
        console.log(`   ✅ Plan: ${finalUser.plan}`);

        // 5. Test de contraseña
        console.log('\n4️⃣  Probando contraseña...');
        const isPasswordCorrect = await bcrypt.compare(ADMIN_PASSWORD, finalUser.password);

        if (isPasswordCorrect) {
            console.log('   ✅ Contraseña verificada correctamente');
        } else {
            console.log('   ❌ Error: La contraseña no coincide');
        }

        console.log('\n━'.repeat(60));
        console.log('\n✅ PROCESO COMPLETADO EXITOSAMENTE\n');
        console.log('📋 CREDENCIALES DE ADMINISTRADOR:');
        console.log('━'.repeat(60));
        console.log(`   Email:    ${ADMIN_EMAIL}`);
        console.log(`   Password: ${ADMIN_PASSWORD}`);
        console.log('━'.repeat(60));
        console.log('\n💡 Ahora puedes iniciar sesión con estas credenciales\n');

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

resetAdmin();
