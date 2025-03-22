const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function seedSuperAdmin() {
    const email = 'superadmin@gmail.com';
    const password = '12345';

    const existingSuperAdmin = await prisma.user.findUnique({
        where: { email },
    });

    if (existingSuperAdmin) {
        console.log('Super Admin already exists!');
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            name: 'Super Admin',
            email,
            password: hashedPassword,
            role: 'SUPERADMIN',
        },
    });

    console.log('✅ Super Admin seeded successfully!');
}

seedSuperAdmin()
    .catch((error) => console.error(error))
    .finally(() => prisma.$disconnect());
