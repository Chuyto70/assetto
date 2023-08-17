#!/bin/bash

# Créer le fichier .env.development.local s'il n'existe pas
touch .env.development.local

# Parcourir les variables de process.env et les ajouter au fichier
for var in $(compgen -e); do
  # Vérifier si la variable existe déjà dans le fichier
  if ! grep -q "^$var=" .env.development.local; then
    # Vérifier si la variable a une valeur non vide
    if [ -n "${!var}" ]; then
      # Ajouter la variable et sa valeur au fichier
      echo "$var=${!var}" >> .env.development.local
    fi
  fi
done

# Afficher le contenu du fichier
cat .env.development.local
