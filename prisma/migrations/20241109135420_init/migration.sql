/*
  Warnings:

  - You are about to alter the column `address` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(50)`.
  - You are about to drop the `ToBelong` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ToContain` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ToBelong" DROP CONSTRAINT "ToBelong_domain_id_fkey";

-- DropForeignKey
ALTER TABLE "ToBelong" DROP CONSTRAINT "ToBelong_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ToContain" DROP CONSTRAINT "ToContain_image_id_fkey";

-- DropForeignKey
ALTER TABLE "ToContain" DROP CONSTRAINT "ToContain_project_id_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "address" SET DATA TYPE VARCHAR(50);

-- DropTable
DROP TABLE "ToBelong";

-- DropTable
DROP TABLE "ToContain";

-- CreateTable
CREATE TABLE "UserDomain" (
    "user_id" INTEGER NOT NULL,
    "domain_id" INTEGER NOT NULL,

    CONSTRAINT "UserDomain_pkey" PRIMARY KEY ("user_id","domain_id")
);

-- CreateTable
CREATE TABLE "ProjectImage" (
    "project_id" INTEGER NOT NULL,
    "image_id" INTEGER NOT NULL,

    CONSTRAINT "ProjectImage_pkey" PRIMARY KEY ("project_id","image_id")
);

-- AddForeignKey
ALTER TABLE "UserDomain" ADD CONSTRAINT "UserDomain_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDomain" ADD CONSTRAINT "UserDomain_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectImage" ADD CONSTRAINT "ProjectImage_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectImage" ADD CONSTRAINT "ProjectImage_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
