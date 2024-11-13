# Plateforme de Mise en Relation

Une plateforme innovante permettant aux prestataires de services dans divers domaines (comme le bâtiment, les voyages, la location de matériel, etc.)  se rendre visibles auprès d'une clientèle élargie. Les clients peuvent accéder aux informations détaillées, consulter les offres, et contacter les prestataires via WhatsApp, e-mail, ou d'autres réseaux sociaux.

## Table des Matières
1. [Aperçu du Projet](#aperçu-du-projet)
2. [Fonctionnalités](#fonctionnalités)
3. [Technologies Utilisées](#technologies-utilisées)
4. [Prise en main](#prise-en-main)
5. [Conformité et Sécurité](#conformité-et-sécurité)
6. [Contact](#contact)

---

## Aperçu du Projet
Cette plateforme vise à offrir une expérience fluide pour les utilisateurs cherchant à découvrir des prestataires de services locaux et les contacter directement. Elle offre aux prestataires la possibilité de créer un profil personnalisé pour attirer plus de clients et augmenter leur visibilité en ligne.

## Fonctionnalités

- Authentification des utilisateurs
- Gestion des utilisateurs (ajout, modification, suppression, affichage)
- Gestion des projets (ajout, modification, suppression, affichage)
- Gestion des services (ajout, modification, suppression, recherche)
- Gestion des domaines (ajout, modification, suppression, affichage)

## Technologies Utilisées
- **Backend** : Node.js, Express
- **Frontend** : Vue.js, Bootstrap pour le design réactif
- **Base de Données** : PostgresSQL
- **Authentification** : JWT 

## Prise en main
1. **Cloner le repository** :
   ```bash
   git clone https://github.com/votre-utilisateur/projet-plateforme-prestataires-API.git
   
   ```
2. **Installer les dépendances** :

    ```bash
    cd projet-plateforme-prestataires
    npm install
    ```
3. **Configurer les variables d'environnement** :

    Créer un fichier .env à la racine du projet.
    Configurer les informations nécessaires : base de données, JWT_SECRET, etc.

4. **Lancer le serveur** :

    ```bash
    npm start
    ```
5. **Accéder à la plateforme** :

    Par défaut, l'application sera accessible à 
    ```bash
    http://localhost:3005.
    ```


6. **Importer la Collection Postman**

    1. **Ouvrir Postman**.
    2. Cliquez sur **Import**.
    3. Sélectionnez **Raw Text**, puis collez le contenu JSON de la collection ci-jointe et cliquez sur **Continue**.
    4. La collection nommée "Plateforme de Services" apparaîtra dans votre espace de travail, avec toutes les requêtes organisées par catégorie.



## Auteur

[Thillo Abdoulaye Seme](https://github.com/semthillo/)