const { PrismaClient } = require("@prisma/client");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "patelhirav2212@gmail.com",
        pass: "oqzb aajk mamu yhyf",
    }
});

const generateOtp = () => crypto.randomInt(1000, 9999).toString();

const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const otp = generateOtp();
        const expire_at = new Date(Date.now() + 10 * 60 * 1000);

        await prisma.oTP.create({ data: { email, otp, expire_at } });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP is: ${otp}.It expires in 10 minutes.`,
        });

        res.json({ message: 'OTP sent successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending OTP' });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

        const otpRecord = await prisma.oTP.findFirst({ where: { email, otp } });

        if (!otpRecord || new Date() > new Date(otpRecord.expire_at)) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        await prisma.oTP.deleteMany({ where: { email } });

        res.json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error verifying OTP' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) return res.status(400).json({ message: 'Email and password required' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({ where: { email }, data: { password: hashedPassword } });

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error resetting password' });
    }
};

module.exports = { sendOtp, verifyOtp, resetPassword };