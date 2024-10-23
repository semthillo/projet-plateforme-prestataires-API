-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "adresse" TEXT,
    "role" VARCHAR(50) NOT NULL,
    "heures_travail" VARCHAR(50),
    "description" TEXT,
    "telephone" VARCHAR(20),
    "statut" BOOLEAN NOT NULL DEFAULT false,
    "profil" TEXT,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Domaine" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(100) NOT NULL,

    CONSTRAINT "Domaine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Publication" (
    "id" SERIAL NOT NULL,
    "titre" VARCHAR(100) NOT NULL,
    "date_heure" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "utilisateur_id" INTEGER NOT NULL,

    CONSTRAINT "Publication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Images" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "Images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiensReseaux" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "type" VARCHAR(100) NOT NULL,
    "utilisateur_id" INTEGER NOT NULL,

    CONSTRAINT "LiensReseaux_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appartenir" (
    "utilisateur_id" INTEGER NOT NULL,
    "domaine_id" INTEGER NOT NULL,

    CONSTRAINT "Appartenir_pkey" PRIMARY KEY ("utilisateur_id","domaine_id")
);

-- CreateTable
CREATE TABLE "Contenir" (
    "publication_id" INTEGER NOT NULL,
    "image_id" INTEGER NOT NULL,

    CONSTRAINT "Contenir_pkey" PRIMARY KEY ("publication_id","image_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- AddForeignKey
ALTER TABLE "Publication" ADD CONSTRAINT "Publication_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiensReseaux" ADD CONSTRAINT "LiensReseaux_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appartenir" ADD CONSTRAINT "Appartenir_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appartenir" ADD CONSTRAINT "Appartenir_domaine_id_fkey" FOREIGN KEY ("domaine_id") REFERENCES "Domaine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contenir" ADD CONSTRAINT "Contenir_publication_id_fkey" FOREIGN KEY ("publication_id") REFERENCES "Publication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contenir" ADD CONSTRAINT "Contenir_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "Images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
