# Mon premier projet React.js

Ceci est mon premier projet react.js / node.js / express.js + PostgreSQL.

Apprendre à utiliser chaques languages en même temps à été un challenge difficile mais je suis content du résultat obtenu.

Ci vous souhaitez recuperer mon code, voici les étapes à suivre :

--------
## Setup de psql 

Commencer par installer PostgreSQL si ce n'est pas déja fait puis ouvrer votre cmd PowerShell

1. Pour vous connecter, ecrivez :   

`psql -U postgres -d postgres`  
(le -U représente le nom de l'utilisateur et le -d représente le nom de la base de donnée à laquelle vous souhaitez vous connecter).

2. On va maintenant creer notre propre compte utilisateur, pour cela ecrivez : 

`CREATE USER 'votre nom' WITH PASSWORD 'votre pwd' CREATEDB;`  
(le CREATEDB donne les autorisations à cette utilisateur de créer une base de donnée)

3. Maintenant que votre compte est créé, on va se déconnecter pour pouvoir se reconnecter sur ce nouveau compte :

`/q` (log out du compte actuellement connecter)  

puis,  

`psql -U votre nom -d postgres`  

4. On va maintenant creer notre propre base de donnée et lui inserer une table :  

`CREATE DATABASE 'nom de votre BDD';`  

puis,  

`/c 'nom de votre BDD'` (vous permet de vous connecter dans votre BDD plutot que dans la BDD postgres par défaut)  

enfin,  

`CREATE TABLE 'nom de votre table'`  
`('nom de colonne 1' 'parametre',`  
`'nom de colonne 2' 'parametre',`  
`'nom de colonne 3' 'parametre',`  
`'nom de colonne 4' 'parametre');`  

ici la syntax est du SQL natif, votre creation de table peux donc ressembler a quelques choses comme cela :  

`CREATE TABLE users`  
`(id BIGSERIAL PRIMARY KEY NOT NULL,`  
`name VARCHAR(200) NOT NULL,`  
`email VARCHAR(200) NOT NULL,`  
`password VARCHAR(200) NOT NULL,`  
`UNIQUE (email));`  

--------
## Setup du projet

Maintenant que notre BDD est opérationnel, il nous faut creer le .env avec les données que vous avez renseignez lors de la creation de la BDD.  
( Attention, le .env n'est pas sécurisé car votre mot de passe et nom utilisateur sont accessible, je n'ai pas encore appris à rendre cela sécuriser malheureusement :/, ne mettez pas le dossier .env en ligne !)  

`DB_USER='nom utilsateur psql'`  
`DB_PASSWORD='mot de passe psql'`  
`DB_HOST=localhost`  
`DB_PORT=5432`  
`DB_DATABASE='nom BDD psql'`  

A partir de là, le code devrait fonctionner en localhost sur le port 4000 que j'ai setup, si vous souhaitez utiliser un autre port vous pouvez le modifier dans le fichier server.js ligne 14 :  

`//variable pour le port utilisé`  
`const port = process.env.PORT || 4000;` <- modifier ici  

--------
## Information complémentaire

Pour réaliser ce projet j'ai installer beaucoup de bibliothèque différentes, vous pouvez en retrouver la liste dans package.json mais au cas où les voici :

1. "bcrypt" (permet le cryptage du mot de passe dans la BDD selon le respect des loi en vigueur)  
2. "dotenv"  (permet de gérer les variables environnement en les stockant dans le fichier .env, utiliser pour nos infos psql ici)  
3. "ejs" (permet la visualisation de nos pages contenus dans le dossier views)  
4. "express" (permet la creation des routes, requetes et reponse dans notre projet)  
5. "express-flash" (add on de express, permet l'affichage de message temporaire comme les erreurs ou succès)  
6. "express-session" (add on de express, permet le stockage d'information dans une session)  
7. "passport" (permet la gestion de l'authentification dans une app express)
8. "passport-local" (strategy de passport pour l'authentifaction selon une base de donnée spécifié)
9. "pg" (permet la connexion avec la BDD psql)
10. "nodemon" (permet le refresh automatique de notre page web lors d'un changement de code coté dev)

Pour installer une bibliothèque, aller à la racine de votre projet dans le terminal puis taper :

`npm i 'nom de la bibliothèque'`  

--------
Merci d'avoir lu ce readme, en espérant que le projet vous sera utile !  
Valentin.
