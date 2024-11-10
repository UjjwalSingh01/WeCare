"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const node_cron_1 = __importDefault(require("node-cron"));
const dayjs_1 = __importDefault(require("dayjs"));
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
// Schedule a task to run every day at 8 PM
node_cron_1.default.schedule('5 11,13,15,17,19 * * *', async () => {
    console.log('Running the appointment status update job...');
    const now = (0, dayjs_1.default)();
    try {
        // Fetch appointments that are active and have passed the current time
        const overdueAppointments = await prisma.appointment.findMany({
            where: {
                status: 'ACTIVE',
                date: {
                    lte: now.format('MMMM D, YYYY'), // Check for dates earlier or equal to today
                },
                time: {
                    lte: now.format('HH:mm A'), // Check if the current time has passed for today
                },
            },
        });
        // Update all overdue appointments to 'COMPLETED'
        for (const appointment of overdueAppointments) {
            await prisma.appointment.update({
                where: {
                    id: appointment.id,
                },
                data: {
                    status: 'COMPLETED',
                },
            });
        }
        console.log(`Updated ${overdueAppointments.length} appointments to COMPLETED status.`);
    }
    catch (error) {
        console.error('Error running the appointment update job:', error);
    }
});
// Express server setup
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
