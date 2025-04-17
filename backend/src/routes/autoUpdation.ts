// import express from 'express';
// import { PrismaClient } from "@prisma/client";
// import cron from 'node-cron';
// import dayjs from 'dayjs';

// const prisma = new PrismaClient();
// const app = express();

// // Schedule a task to run every day at 8 PM
// cron.schedule('5 11,13,15,17,19 * * *', async () => {
//     console.log('Running the appointment status update job...');
  
//     const now = dayjs();
  
//     try {
//       // Fetch appointments that are active and have passed the current time
//       const overdueAppointments = await prisma.appointment.findMany({
//         where: {
//           status: 'ACTIVE',
//           date: {
//             lte: now.format('MMMM D, YYYY'), // Check for dates earlier or equal to today
//           },
//           time: {
//             lte: now.format('HH:mm A'),  // Check if the current time has passed for today
//           },
//         },
//       });
  
//       // Update all overdue appointments to 'COMPLETED'
//       for (const appointment of overdueAppointments) {
//         await prisma.appointment.update({
//           where: {
//             id: appointment.id,
//           },
//           data: {
//             status: 'COMPLETED',
//           },
//         });
//       }
  
//       console.log(`Updated ${overdueAppointments.length} appointments to COMPLETED status.`);
//     } catch (error) {
//       console.error('Error running the appointment update job:', error);
//     }
//   });