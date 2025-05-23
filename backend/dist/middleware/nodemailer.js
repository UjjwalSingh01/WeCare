"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPromotionEmail = exports.sendOtpEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: 'smtpout.secureserver.net',
    secure: true,
    tls: {
        ciphers: 'SSLv3'
    },
    requireTLS: true, // Forces the connection to use TLS, even if the server advertises that it can accept non-encrypted connections. ensures that your emails are transmitted securely
    port: 465,
    debug: true, // Enables detailed logging of the SMTP communication between your server and the SMTP server.
    auth: {
        user: process.env.SECRET_EMAIL,
        pass: process.env.SECRET_PASSWORD,
    },
});
const sendOtpEmail = async (to, otp) => {
    try {
        await transporter.sendMail({
            from: process.env.SECRET_EMAIL,
            to: to,
            subject: 'Please verify you email.',
            html: `<p>Your OTP is <strong>${otp}</strong></p>. This otp is only valid for 10 mins.`,
        });
        return "OTP sent successfully";
    }
    catch (error) {
        return "Something went wrong";
    }
};
exports.sendOtpEmail = sendOtpEmail;
const sendPromotionEmail = async (to, message) => {
    try {
        await transporter.sendMail({
            from: process.env.SECRET_EMAIL,
            to: to,
            subject: 'Congratulation',
            html: `${message}`,
        });
        return 'Promotion sent successfully';
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send promotion email');
    }
};
exports.sendPromotionEmail = sendPromotionEmail;
