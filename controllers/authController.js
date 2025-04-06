const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

exports.signup = async (req, res) => {
    try {
        const { name, email, password, year, semester, enr_no, branch, role } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use. Please use a different email." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                year: year || null,
                semester: semester || null,
                enr_no: enr_no || null,
                branch: role === "USER" ? branch.toUpperCase() : null, 
                role: role || "USER",
            },
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (error) {
        console.error("🔥 Signup Error:", error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await prisma.user.findUnique({ where: { email } });
        let admin = await prisma.admin.findUnique({ where: { email } });

        if (!user && !admin) {
            return res.status(404).json({ message: 'User not found' });
        }

        const account = user || admin;

        const isPasswordValid = await bcrypt.compare(password, account.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // ✅ Use actual role from DB instead of hardcoding
        const role = account.role;

        const token = jwt.sign({ id: account.id, role }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        return res.json({
            message: 'Login successful',
            token,
            user: {
                id: account.id,
                name: account.name,
                email: account.email,
                role,
            },
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
};
