/*
  Warnings:

  - You are about to drop the column `nom` on the `Images` table. All the data in the column will be lost.
  - You are about to drop the `Appartenir` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Contenir` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Domaine` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LiensReseaux` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Publication` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Utilisateur` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Images` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Appartenir" DROP CONSTRAINT "Appartenir_domaine_id_fkey";

-- DropForeignKey
ALTER TABLE "Appartenir" DROP CONSTRAINT "Appartenir_utilisateur_id_fkey";

-- DropForeignKey
ALTER TABLE "Contenir" DROP CONSTRAINT "Contenir_image_id_fkey";

-- DropForeignKey
ALTER TABLE "Contenir" DROP CONSTRAINT "Contenir_publication_id_fkey";

-- DropForeignKey
ALTER TABLE "LiensReseaux" DROP CONSTRAINT "LiensReseaux_utilisateur_id_fkey";

-- DropForeignKey
ALTER TABLE "Publication" DROP CONSTRAINT "Publication_utilisateur_id_fkey";

-- AlterTable
ALTER TABLE "Images" DROP COLUMN "nom",
ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "Appartenir";

-- DropTable
DROP TABLE "Contenir";

-- DropTable
DROP TABLE "Domaine";

-- DropTable
DROP TABLE "LiensReseaux";

-- DropTable
DROP TABLE "Publication";

-- DropTable
DROP TABLE "Utilisateur";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "address" TEXT,
    "role" VARCHAR(50) NOT NULL,
    "hours" VARCHAR(50),
    "description" TEXT,
    "telephone" VARCHAR(20),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Domain" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "date_heure" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Links" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "type" VARCHAR(100) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToBelong" (
    "user_id" INTEGER NOT NULL,
    "domain_id" INTEGER NOT NULL,

    CONSTRAINT "ToBelong_pkey" PRIMARY KEY ("user_id","domain_id")
);

-- CreateTable
CREATE TABLE "toContain" (
    "post_id" INTEGER NOT NULL,
    "image_id" INTEGER NOT NULL,

    CONSTRAINT "toContain_pkey" PRIMARY KEY ("post_id","image_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Links" ADD CONSTRAINT "Links_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToBelong" ADD CONSTRAINT "ToBelong_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToBelong" ADD CONSTRAINT "ToBelong_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "toContain" ADD CONSTRAINT "toContain_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "toContain" ADD CONSTRAINT "toContain_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "Images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
