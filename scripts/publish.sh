#!/bin/bash

set -e

echo ""
read -p "📁 Nom du dossier : " DOSSIER

CHEMIN="public/images/$DOSSIER"
echo "🔎 Vérification des photos..."

NB=$(find "$CHEMIN" -maxdepth 1 \( -iname "*.jpeg" -o -iname "*.jpg" \) | wc -l | tr -d ' ')

for ((i=1;i<=NB;i++)); do
    NUM=$(printf "%02d" "$i")

    if [ ! -f "$CHEMIN/$NUM.jpeg" ] && [ ! -f "$CHEMIN/$NUM.jpg" ]; then
        echo ""
        echo "❌ Il manque $NUM.jpeg"
        exit 1
    fi
done

echo "✅ Numérotation correcte."

if [ ! -d "$CHEMIN" ]; then
  echo "❌ Dossier introuvable : $CHEMIN"
  exit 1
fi

echo ""
echo "📷 Conversion des JPEG..."
find "$CHEMIN" -name "*.DS_Store" -delete

for img in "$CHEMIN"/*.jpeg; do
  [ -f "$img" ] || continue
  AVIF="${img%.*}.avif"

if [ ! -f "$AVIF" ]; then
    magick "$img" -auto-orient -quality 90 "$AVIF"
fi
done

echo "✅ Conversion terminée."
echo ""
echo "☁️ Envoi vers Cloudflare R2..."

rclone copy \
"$CHEMIN" \
"r2:eglise-images/images/$DOSSIER" \
--include "*.avif" \
--progress

echo "✅ Upload terminé."
echo ""
echo "📦 Préparation de Git..."

git add .

DATE=$(date "+%d/%m/%Y %H:%M")

git commit -m "Ajout de $DOSSIER ($DATE)" || echo "ℹ️ Aucun changement à valider."

echo ""
echo "🚀 Envoi vers GitHub..."

git push

echo ""
echo "🎉 Publication terminée !"
echo ""
echo "✅ Photos converties en AVIF"
echo "✅ Uploadées sur Cloudflare R2"
echo "✅ GitHub mis à jour"
echo "✅ Cloudflare va redéployer automatiquement le site."