# Plateforme de Mise en Relation

Une plateforme innovante permettant aux prestataires de services dans divers domaines (comme le bâtiment, les voyages, la location de matériel, etc.)  se rendre visibles auprès d'une clientèle élargie. Les clients peuvent accéder aux informations détaillées, consulter les offres, et contacter les prestataires via WhatsApp, e-mail, ou d'autres réseaux sociaux.



## Aperçu du Projet
Cette plateforme vise à offrir une expérience fluide pour les utilisateurs cherchant à découvrir des prestataires de services locaux et les contacter directement. Elle offre aux prestataires la possibilité de créer un profil personnalisé pour attirer plus de clients et augmenter leur visibilité en ligne.

## Fonctionnalités

- Authentification des utilisateurs
- Gestion des utilisateurs (ajout, modification, suppression, affichage)
- Gestion des projets (ajout, modification, suppression, affichage)
- Gestion des services (ajout, modification, suppression, recherche)
- Gestion des domaines (ajout, modification, suppression, affichage)

## Technologies Utilisées
-  Node.js, Express
-  PostgresSQL
-  JWT 
-  Prisma

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants :

- **Node.js**
- **PostgreSQL**
- **Postman** (pour tester l'API)


## Prise en main
1. **Cloner le repository** :
```bash
   git clone https://github.com/semthillo/projet-plateforme-prestataires-API.git
   
   ```
    Accédez au répertoire du projet :

```bash
    cd projet-plateforme-prestataires-API

```
2. **Installer les dépendances** :

```bash
    npm install

```
        

3. **Configurer la base de données** :

    1. Assurez-vous que **postgresql** est en cours d'exécution sur votre machine.
    2. Créez une base de données pour le projet.
    3. Modifiez le fichier `.env.example` dans la racine du projet en le nommant `.env` pour y insérer les informations de connexion à la base de données.


4. **Lancer le serveur** :
pour lancer le servuer exécutez la commande suivant :

```bash
    npm start
```
5. **Accéder à la plateforme** :

    l'application sera accessible à 

```bash
    http://localhost:3005/api.
```
## Utilisation de Prisma
Prisma est utilisé pour gérer la base de données et faciliter les migrations ainsi que la génération des modèles. Vous devez exécuter les commandes suivantes pour préparer Prisma dans votre projet.

### Générer les fichiers Prisma

Après avoir configuré votre base de données et modifiez le fichier `.env`, vous devez générer les fichiers nécessaires à Prisma en utilisant la commande suivante :

```bash
npx prisma generate
```

```bash
npx prisma migrate dev
```

## Documentation et teste avec Collection Postman

6. **Importer la Collection Postman**

    Pour tester les différents endpoints de l'API, vous pouvez utiliser la collection Postman à la racine du projet. Elle contient toutes les requêtes configurées pour interagir avec l'API.



## Auteur

[Thillo Abdoulaye Seme](https://github.com/semthillo/)