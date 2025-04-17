/*
  Warnings:

  - You are about to drop the column `date` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Appointment` table. All the data in the column will be lost.
  - The `status` column on the `Appointment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `admin` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `fullname` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `hospitals` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `specializations` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `fullname` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `primaryPhysician` on the `Patient` table. All the data in the column will be lost.
  - The `currentMedications` column on the `Patient` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `allergies` column on the `Patient` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Otp` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubAdmin` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[licenseNumber]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `DOB` on the `Patient` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'FACILITY_ADMIN');

-- CreateEnum
CREATE TYPE "AdminPermission" AS ENUM ('FULL_ACCESS', 'READ_WRITE', 'READ_ONLY');

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "date",
DROP COLUMN "note",
DROP COLUMN "time",
ADD COLUMN     "cancellationReason" TEXT,
ADD COLUMN     "clinicalNotes" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "duration" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "scheduledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "admin",
DROP COLUMN "fullname",
DROP COLUMN "hospitals",
DROP COLUMN "phoneNumber",
DROP COLUMN "specializations",
ADD COLUMN     "availability" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fullName" TEXT NOT NULL DEFAULT 'TBD',
ADD COLUMN     "hospitalAffiliations" TEXT[],
ADD COLUMN     "licenseNumber" TEXT,
ADD COLUMN     "managedById" TEXT,
ADD COLUMN     "mobilePhone" TEXT,
ADD COLUMN     "officePhone" TEXT NOT NULL DEFAULT '+000-0000-0000',
ADD COLUMN     "specialties" TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "rating" SET DEFAULT 0.0,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "latitude" DROP NOT NULL,
ALTER COLUMN "longitude" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "fullname",
DROP COLUMN "primaryPhysician",
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "insuranceProvider" TEXT,
ADD COLUMN     "policyNumber" TEXT,
DROP COLUMN "DOB",
ADD COLUMN     "DOB" TIMESTAMP(3) NOT NULL,
DROP COLUMN "currentMedications",
ADD COLUMN     "currentMedications" TEXT[],
DROP COLUMN "allergies",
ADD COLUMN     "allergies" TEXT[];

-- DropTable
DROP TABLE "Admin";

-- DropTable
DROP TABLE "Otp";

-- DropTable
DROP TABLE "SubAdmin";

-- DropEnum
DROP TYPE "Status";

-- CreateTable
CREATE TABLE "HealthcareAdmin" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'FACILITY_ADMIN',
    "hashedPin" TEXT NOT NULL,
    "permissions" "AdminPermission"[],
    "verifiedById" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastAccess" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HealthcareAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OTP" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OTP_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HealthcareAdmin_email_key" ON "HealthcareAdmin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "OTP_email_key" ON "OTP"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_licenseNumber_key" ON "Doctor"("licenseNumber");

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_managedById_fkey" FOREIGN KEY ("managedById") REFERENCES "HealthcareAdmin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthcareAdmin" ADD CONSTRAINT "HealthcareAdmin_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "HealthcareAdmin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
