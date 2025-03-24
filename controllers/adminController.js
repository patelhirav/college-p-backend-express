const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');
const { ObjectId } = require('mongodb');
const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "patelhirav2212@gmail.com",
        pass: "oqzb aajk mamu yhyf",
    }
});

module.exports = {
    async addAdmin(req, res) {
        const { name, email, password, branch } = req.body;

        if (req.user.role !== 'SUPERADMIN') {
            return res.status(403).json({ message: 'Unauthorized: Only Super Admin can add admins' });
        }

        if (!name || !email || !password || !branch) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            const existingAdmin = await prisma.admin.findUnique({ where: { email } });

            if (existingAdmin) {
                return res.status(400).json({ message: 'Admin already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newAdmin = await prisma.admin.create({
                data: { name, email, password: hashedPassword, branch, role: 'ADMIN' }
            });

            await transporter.sendMail({
                from: "patelhirav2212@gmail.com",
                to: email,
                subject: 'Your Admin Account Details',
                text: `Hello ${name},\n\nYou have been added as an Admin for the ${branch} branch.\n\nYour login details:\nEmail: ${email}\nPassword: ${password}\n\nPlease change your password after logging in.\n\nRegards,\nCollege Admin Team`
            });

            res.status(201).json({ message: 'Admin added successfully', admin: newAdmin });
        } catch (error) {
            res.status(500).json({ message: 'Error adding admin', error: error.message });
        }
    },

    async getAdminList(req, res) {
        try {
            let admins;

            if (req.user.role === 'SUPERADMIN') {
                admins = await prisma.admin.findMany();
            } else {
                admins = await prisma.admin.findMany({
                    where: { branch: req.user.branch },
                });
            }

            res.json(admins);
        } catch (error) {
            res.status(500).json({ message: "Error fetching admins", error: error.message });
        }
    },

    async editAdmin(req, res) {
        let { id } = req.params;
        const { name, email, password, branch } = req.body;

        console.log("Admin ID received:", id);
        try {
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ message: "Invalid admin ID format" });
            }

            id = new ObjectId(id);

            const admin = await prisma.admin.findUnique({ where: { id } });

            if (!admin) return res.status(404).json({ message: "Admin not found" });

            const updateData = { name, email, branch };
            if (password) {
                updateData.password = await bcrypt.hash(password, 10);
            }

            const updatedAdmin = await prisma.admin.update({
                where: { id },
                data: updateData,
            });

            res.json({ message: "Admin updated successfully", admin: updatedAdmin });
        }
        catch (error) {
            res.status(500).json({ message: "Error updating admin", error: error.message });
        }
    },


    async deleteAdmin(req, res) {
        const { id } = req.params;

        if (req.user.role !== 'SUPERADMIN') {
            return res.status(403).json({ message: 'Unauthorized: Only Super Admin can delete admins' });
        }

        try {
            const admin = await prisma.admin.findUnique({ where: { id } });
            if (!admin) return res.status(404).json({ message: 'Admin not found' });

            await prisma.admin.delete({ where: { id } });
            res.json({ message: 'Admin deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete admin', error: error.message });
        }
    }
};
