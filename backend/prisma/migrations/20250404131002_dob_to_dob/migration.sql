/*
  Warnings:

  - You are about to drop the column `DOB` on the `Patient` table. All the data in the column will be lost.
  - Added the required column `dob` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "DOB",
ADD COLUMN     "dob" TIMESTAMP(3) NOT NULL;
