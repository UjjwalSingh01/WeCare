-- AlterTable
ALTER TABLE "Patient" ALTER COLUMN "currentMedications" DROP NOT NULL,
ALTER COLUMN "currentMedications" SET DATA TYPE TEXT,
ALTER COLUMN "allergies" DROP NOT NULL,
ALTER COLUMN "allergies" SET DATA TYPE TEXT;
