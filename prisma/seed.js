const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function seedSuperAdmin() {
    const email = 'superadmin@gmail.com';
    const password = '12345';

    try {
        // Check if Super Admin already exists
        const existingSuperAdmin = await prisma.user.findUnique({
            where: { email },
        });

        if (existingSuperAdmin) {
            console.log('⚠️ Super Admin already exists!');
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create Super Admin in the User table
        await prisma.user.create({
            data: {
                name: 'Super Admin',
                email,
                password: hashedPassword,
                role: 'SUPERADMIN', // MUST match the enum exactly (uppercase)
            }
        });
        console.log('✅ Super Admin seeded successfully!');
    } catch (error) {
        console.error('❌ Error seeding Super Admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedSuperAdmin();
