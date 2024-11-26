/*
  Warnings:

  - You are about to drop the column `date_heure` on the `Project` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserDomain" DROP CONSTRAINT "UserDomain_domain_id_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "date_heure",
ADD COLUMN     "domain_id" INTEGER,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "Domain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDomain" ADD CONSTRAINT "UserDomain_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
