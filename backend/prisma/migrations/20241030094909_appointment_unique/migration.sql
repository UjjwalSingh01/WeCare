/*
  Warnings:

  - A unique constraint covering the columns `[doctorId,date,time,status]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Appointment_doctorId_date_time_key";

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_doctorId_date_time_status_key" ON "Appointment"("doctorId", "date", "time", "status");
