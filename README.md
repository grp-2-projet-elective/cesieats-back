# CESI'Eat BACK END
Back END du projet élective logiciel des FISA A4 du CESI de Saint-Nazaire.

## Contexte 

Nous avons développer une application web commande et de livraison, sur le style de UBER EAT ©. 
Dans cette application nous avons plusieurs utilisateurs : 
- Le consommateur
- Le restaurateur
- Le Livreur
- Les différents services (Commercial, technique, et développeur)

Chaque service dispose de ces propres fonctionnalités.

## Comment lancer le projet

* Clone le projet ! 

`git clone https://github.com/grp-2-projet-elective/cesieats-back.git`

* Installe les dépendances ! 

`cd cesieats-front`  
`npm install`

## Commencer à développer 

`npm run serve`

## Compiler une version de production 

`npm run build`

## Comment contribuer au projet ? 

### Créer la branche 

Le nom de la branche doit toujours commencer par son type, c'est à dire : 

* feat/: Si c'est une nouvelle feature
* bug/: Si c'est une correction de bug 
* hotfixe/ : Si c'est une correction sur la dernière version stable 

Voir ce [lien](https://gist.github.com/digitaljhelms/4287848) pour plus d'informations.

### Envoyer la branche 

* Vérifie tes changements !   
`npm run build`

Si ça fonctionne continue, sinon des corrections seront nécessaires.

* Ajoute tes changements !   
`git add .`

* Sauvegarde tes changements !   
`npm run commit`

* Envoie tes changements ! Si c'est la première fois que tu push sur cette branche :   
`git push origin <le nom de ta branche>`

Sinon c'est juste :  
`git push`

