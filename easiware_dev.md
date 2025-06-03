# 🚀 Procédure de build & publication d'un plugin Activepieces (`easiware`)

📂 **Localisation du plugin :**
`packages/pieces/custom/easiware`

---

## 🛠️ 1. Préparation initiale de l’environnement Activepieces

> À faire uniquement la première fois

### Étapes :

1. Sélectionner la bonne version de Node.js :

   ```bash
   nvm install 20
   nvm use 20
   ```

2. Installer les outils nécessaires :

   ```bash
   npm install -g pnpm
   npm install -g nx@20.0.1
   pnpm install
   ```

✅ L’environnement est prêt à l’emploi.

---

## 🔁 2. Préparation à chaque session (login shell)

> À répéter à chaque nouvelle session dans l’environnement

```bash
nvm use 20
```

---

## 🧱 3. Builder le plugin `easiware`

### ⚠️ Avant tout :

➡️ **Modifier le numéro de version dans :**
`packages/pieces/custom/easiware/package.json`

> Suivre le versionnage sémantique :

* Patch (`x.x.1`) = correction de bug
* Minor (`x.1.0`) = ajout de fonctionnalités
* Major (`1.0.0`) = changement majeur ou breaking change

---

### 🧪 Test du build (dry run)

1. Se placer à la **racine du repo `activepieces`** :

   ```bash
   nx build pieces-easiware
   ```

2. Si tout va bien, ce message doit s’afficher :

   ```
   NX   Successfully ran target build for project pieces-easiware and 3 tasks it depends on
   ```

3. Pour un build plus verbeux :

   ```bash
   nx --verbose build pieces-easiware
   ```

### ❌ En cas d’erreur :

```
error TS5090: Non-relative paths are not allowed when 'baseUrl' is not set.
```

* Vous n’êtes **pas à la racine** du projet
* Ou vous avez **une mauvaise version de `nx`**

---

## 📆 4. Génération du binaire téléchargeable

```bash
pnpm run build-piece
```

🔎 Lorsque demandé `Enter the piece folder name`, tapez :

```bash
easiware
```

✅ Le chemin du fichier généré sera affiché à la fin du processus.

---

## ☁️ 5. Publication du plugin sur Activepieces (en ligne)

### 🌍 URL de votre instance :

`https://activepieces.easiware-workbench.fr/`

### Étapes :

1. Ouvrir l’URL dans un navigateur, se connecter.
2. Ouvrir l’outil développeur (`F12`) → Onglet **"Application"**.
3. Aller dans :

   ```
   Stockage → Stockage local → https://activepieces.easiware-workbench.fr/
   ```
4. 📋 **Copier la valeur de la clé `token`**.

---

### 📤 Upload via la CLI

Depuis la **racine du projet** :

```bash
pnpm run publish-piece-to-api
```

Répondez aux invites :

* `Enter the piece folder name` → `easiware`
* `Enter the API URL` → `https://activepieces.easiware-workbench.fr/api`
* `Enter the API Key` → collez le **token** récupéré du navigateur

---

### ✅ Si tout se passe bien :

```
uploading ...
Piece '@activepieces/piece-easiware' published.
```

🎉 Votre plugin est maintenant mis à jour sur l’instance Activepieces !

