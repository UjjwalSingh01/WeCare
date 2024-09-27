-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "admin" TEXT;

-- AlterTable
ALTER TABLE "SubAdmin" ADD COLUMN     "doctors" TEXT[];
