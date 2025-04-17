/*
  Warnings:

  - The values [READ_ONLY] on the enum `AdminPermission` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `hashedPin` on the `HealthcareAdmin` table. All the data in the column will be lost.
  - Added the required column `pin` to the `HealthcareAdmin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AdminPermission_new" AS ENUM ('FULL_ACCESS', 'READ_WRITE');
ALTER TABLE "HealthcareAdmin" ALTER COLUMN "permissions" TYPE "AdminPermission_new" USING ("permissions"::text::"AdminPermission_new");
ALTER TYPE "AdminPermission" RENAME TO "AdminPermission_old";
ALTER TYPE "AdminPermission_new" RENAME TO "AdminPermission";
DROP TYPE "AdminPermission_old";
COMMIT;

-- AlterTable
ALTER TABLE "HealthcareAdmin" DROP COLUMN "hashedPin",
ADD COLUMN     "pin" TEXT NOT NULL,
ALTER COLUMN "permissions" SET NOT NULL,
ALTER COLUMN "permissions" SET DATA TYPE "AdminPermission";
