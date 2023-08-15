#!/bin/bash

# Créer le fichier .env.production.local s'il n'existe pas
touch .env.production.local

# Parcourir les variables de process.env et les ajouter au fichier
for var in $(compgen -e); do
  # Vérifier si la variable existe déjà dans le fichier
  if ! grep -q "^$var=" .env.production.local; then
    # Ajouter la variable et sa valeur au fichier
    echo "$var=${!var}" >> .env.production.local
  fi
done

# Afficher le contenu du fichier
cat .env.production.local
