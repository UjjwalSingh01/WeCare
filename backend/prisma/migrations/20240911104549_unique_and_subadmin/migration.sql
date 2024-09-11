/*
  Warnings:

  - You are about to drop the column `Allergies` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `FamilyMedicalHistory` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `Gender` on the `Patient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pin` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `removeFacility` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "pin" TEXT NOT NULL,
ADD COLUMN     "removeFacility" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "Allergies",
DROP COLUMN "FamilyMedicalHistory",
DROP COLUMN "Gender",
ADD COLUMN     "allergies" TEXT,
ADD COLUMN     "familyMedicalHistory" TEXT,
ADD COLUMN     "gender" "Gender" NOT NULL;

-- CreateTable
CREATE TABLE "SubAdmin" (
    "id" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "pin" TEXT NOT NULL,

    CONSTRAINT "SubAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubAdmin_email_key" ON "SubAdmin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_email_key" ON "Doctor"("email");
