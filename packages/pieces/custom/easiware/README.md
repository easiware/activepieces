# pieces-easiware

Pièce (piece) Activepieces pour l'intégration avec [easiware](https://www.easiware.com), logiciel de support client.

Cette bibliothèque a été générée avec [Nx](https://nx.dev) et est packagée sous le nom
`@activepieces/piece-easiware`.

- **Package** : `@activepieces/piece-easiware`
- **Catégorie** : Customer Support
- **Auteur** : stefapi
- **Release Activepieces minimale** : `0.36.1`

## Présentation

La pièce `easiware` expose un ensemble d'actions et de triggers permettant de piloter
easiware depuis un flow Activepieces : gestion des contacts, des tickets, des messages,
des événements de ticket, des catégories et des utilisateurs, ainsi que des champs
personnalisés (contacts et tickets).

Une action **Custom API Call** est également fournie pour appeler n'importe quel
endpoint de l'API easiware non couvert par les actions dédiées.

## Authentification

La pièce utilise une authentification personnalisée (Custom Auth) composée de deux champs :

| Champ      | Libellé    | Description                          | Valeur par défaut        |
|------------|------------|--------------------------------------|--------------------------|
| `appUrl`   | Api URL    | URL de base de l'API easiware        | `https://api.easiware.com` |
| `apiKey`   | API Key    | Clé d'API easiware (Bearer token)    | —                        |

### Activer la clé d'API dans easiware

1. Se connecter à votre compte easiware.
2. En bas à gauche, cliquer sur **Parameters**.
3. Sélectionner **General**.
4. Sélectionner **API key management**.
5. Dans le panneau de droite, cliquer sur **+ Generate a new key**.
6. Renseigner le **API key Label** pour nommer la clé.
7. Cliquer sur **Generate a new key**.
8. Copier la clé d'API et la coller dans le champ **API Key** de la connexion Activepieces.

> **APP URL** : l'URL de l'API easiware. Pour l'instance cloud, il s'agit de
> `https://app.easiware.com`.

La validation de l'authentification est effectuée via un appel `GET {appUrl}/v1/auth/info`
avec le header `Authorization: Bearer <apiKey>`.

## Actions

### Contacts

| Action                       | Description                                              |
|------------------------------|----------------------------------------------------------|
| `getContactFromID`           | Récupère un contact à partir de son identifiant.         |
| `searchContact`              | Recherche des contacts selon des critères.               |
| `createContact`              | Crée un nouveau contact.                                |
| `updateContact`              | Met à jour un contact existant.                          |
| `listContactCustomFields`    | Liste les champs personnalisés des contacts.            |
| `getContactCustomFieldChoices` | Récupère les choix d'un champ personnalisé de contact. |

### Tickets

| Action                       | Description                                              |
|------------------------------|----------------------------------------------------------|
| `getTicketFromID`            | Récupère un ticket à partir de son identifiant.          |
| `searchTickets`              | Recherche des tickets avec tous les filtres disponibles. |
| `createTicket`               | Crée un nouveau ticket.                                  |
| `updateTicket`               | Met à jour un ticket existant.                           |
| `getTicketMessages`          | Liste les messages d'un ticket.                          |
| `addMessageToTicket`         | Ajoute un message à un ticket.                           |
| `searchTicketEvents`         | Recherche les événements d'un ticket.                    |
| `getTicketEventFromID`       | Récupère un événement de ticket à partir de son ID.      |
| `listTicketCustomFields`     | Liste les champs personnalisés des tickets.             |
| `getTicketCustomFieldChoices`| Récupère les choix d'un champ personnalisé de ticket.   |
| `findTicketsByBody`          | Recherche des tickets à partir du contenu (body).        |

### Messages de ticket

| Action                   | Description                                                        |
|--------------------------|--------------------------------------------------------------------|
| `searchTicketMessages`  | Recherche des messages de ticket avec filtres et pagination.       |
| `getTicketMessage`      | Récupère un message de ticket à partir de son ID numérique.        |

### Groupes de compétence

| Action                    | Description                                              |
|---------------------------|----------------------------------------------------------|
| `searchCompetenceGroups`  | Recherche les groupes de compétence de l'organisation.  |
| `getCompetenceGroup`      | Récupère un groupe de compétence à partir de son ID.    |

### Webhooks

| Action            | Description                                                       |
|-------------------|-------------------------------------------------------------------|
| `listWebhooks`    | Liste tous les webhooks configurés.                               |
| `getWebhook`      | Récupère un webhook à partir de son ID.                           |
| `createWebhook`   | Crée un nouveau webhook (catégorie, eventType, URL).             |
| `updateWebhook`   | Met à jour partiellement un webhook existant.                     |
| `detachWebhook`   | Détache un webhook (arrête la réception des événements).          |
| `deleteWebhook`   | Supprime définitivement un webhook.                               |

### Modèles (templates)

| Action          | Description                                              |
|-----------------|----------------------------------------------------------|
| `listTemplates` | Liste les modèles disponibles (filtre par langue).       |
| `getTemplate`   | Récupère un modèle à partir de son ID (filtre par langue).|

### Base de connaissances

| Action                 | Description                                                          |
|------------------------|---------------------------------------------------------------------|
| `searchKnowledgeBase`  | Recherche des articles avec filtres et pagination.                  |
| `createKnowledgeBase` | Crée un nouvel article (statut, catégories, traductions).           |
| `getKnowledgeBase`     | Récupère un article à partir de son ID.                            |
| `updateKnowledgeBase`  | Met à jour partiellement un article existant.                       |

### Layouts

| Action       | Description                                              |
|--------------|----------------------------------------------------------|
| `listLayouts`| Liste les layouts disponibles (filtre par langue).       |
| `getLayout`  | Récupère un layout à partir de son ID (filtre par langue).|

### JSON Forms

| Action             | Description                                                       |
|--------------------|-------------------------------------------------------------------|
| `createJsonForm`   | Crée un modèle de formulaire JSON.                                |
| `getJsonForm`      | Récupère un modèle de formulaire JSON à partir de son ID.         |
| `updateJsonForm`   | Met à jour partiellement un modèle de formulaire JSON.           |
| `deleteJsonForm`   | Supprime définitivement un modèle de formulaire JSON.             |
| `listJsonForms`    | Liste les modèles de formulaires JSON (filtre par moduleType).   |
| `createJsonData`   | Soumet des données pour un formulaire JSON.                      |
| `getJsonData`      | Récupère une entrée de données de formulaire JSON.               |
| `updateJsonData`   | Met à jour partiellement une entrée de données de formulaire.    |
| `deleteJsonData`   | Supprime définitivement une entrée de données de formulaire.      |
| `listAllJsonData`  | Liste toutes les entrées de données de formulaires JSON.         |

### CSAT (endpoints publics)

| Action           | Description                                                              |
|------------------|--------------------------------------------------------------------------|
| `getCsatForm`    | Récupère un formulaire CSAT public (orgId + token).                     |
| `submitCsatForm` | Soumet une réponse CSAT (rating 1–5, commentaire optionnel).            |

## Canaux custom (custom channels)

- **Création de tickets sur un canal custom** : l'action *Create Ticket* expose un
  champ **« Custom Channel Source »**. Lorsqu'il est renseigné (par exemple
  `twitter_dm`), cet identifiant est utilisé comme `source` du ticket à la place
  du menu déroulant *Source*. Le canal doit **déjà exister** dans easiware (créé
  depuis l'interface web) — l'API publique ne permet pas de créer des canaux.
- **Filtres de recherche** : les actions *Search Tickets* et *Find Tickets (POST
  body)* exposent un champ **« Custom Sources »**. Les identifiants saisis
  (séparés par des virgules) sont fusionnés avec les sources sélectionnées dans
  le menu déroulant *Source* pour filtrer les résultats.
- **Limites de l'API publique** : la gestion des canaux custom (création,
  modification, suppression — CRUD) ainsi que l'endpoint `/ticket-source` **ne
  sont pas exposés** par l'API publique easiware. Ces endpoints sont réservés à
  l'application web et ne peuvent donc pas être intégrés dans la piece.

### Divers (misc)

| Action            | Description                                  |
|-------------------|----------------------------------------------|
| `getApiStatus`    | Récupère le statut de l'API easiware.       |
| `getAuthInfo`     | Récupère les informations d'authentification.|
| `searchCategories`| Recherche des catégories.                   |
| `getCategoryFromID` | Récupère une catégorie à partir de son ID. |
| `searchUsers`      | Recherche des utilisateurs.                 |
| `getUserFromID`    | Récupère un utilisateur à partir de son ID.|

### Custom API Call

Action générique permettant d'appeler n'importe quel endpoint de l'API easiware.
L'URL de base est dérivée de `appUrl` et l'authentification (`Authorization: Bearer <apiKey>`)
est appliquée automatiquement.

## Triggers

Les triggers reposent sur des webhooks easiware (`POST {appUrl}/v1/webhooks` à l'activation,
`POST {appUrl}/v1/webhooks/{id}/detach` à la désactivation).

| Trigger           | Événement                                  | Description                                              |
|-------------------|--------------------------------------------|----------------------------------------------------------|
| `ticket_created`  | `create` (catégorie `ticket`)              | Déclenché à la création d'un nouveau ticket.             |
| `contact_created` | `create` (catégorie `contact`)             | Déclenché à la création d'un nouveau contact.            |
| `ticket_event`    | Au choix via liste déroulante (catégorie `ticket`) | Déclenché à la réception d'un événement ticket. Types disponibles : `create`, `note`, `subject`, `status`, `category`, `priority`, `agent`, `currentChannel`, `contact`, `message`, `solicitation`, `delete`, `restore`, `competence_group`, `ai_request_summary`, `ai_summary`, `ai_request_terminated`, `ai_auto_categorized`, `ticket_link`, `ticket_unlink`, `ticket_suggestion`, `average_handling_time`, `csat_rating`, `csat_comment`, `csat_email_sent`. |

## Développement et déploiement

### Prérequis

- Se positionner à la racine du monorepo Activepieces.
- Avoir installé les dépendances via `npm install` (repo npm workspaces).
- Disposer de `npx`, `ts-node`, `tsconfig-paths` et `pnpm` (pour l'upload).

### 1. Build (compilation TypeScript)

Compile la pièce via Nx :

```bash
npx nx build pieces-easiware
```

### 2. Packaging (génération de l'archive `.tgz`)

Génère l'archive npm de la pièce à l'aide de la CLI Activepieces :

```bash
npx ts-node -r tsconfig-paths/register --project packages/cli/tsconfig.json packages/cli/src/index.ts pieces build easiware
```

**Résultat** : l'archive est générée dans

```
dist/packages/pieces/custom/easiware/activepieces-piece-easiware-<version>.tgz
```

Elle contient le JS compilé, les source maps, les fichiers `.d.ts`, le `package.json`
et le `README.md`.

### 3. Upload vers le serveur Activepieces

#### Récupérer le token

1. Ouvrir https://activepieces.easiware-workbench.fr/
2. Ouvrir les outils développeur (F12) → onglet **Application** → **Stockage local** (Local Storage).
3. Copier la valeur de la clé `token` (JWT).

#### Lancer l'upload

Depuis la racine du repo :

```bash
pnpm run publish-piece-to-api
```

Répondre aux 3 prompts :

| Prompt                          | Réponse                                              |
|---------------------------------|------------------------------------------------------|
| `Enter the piece folder name`   | `easiware`                                           |
| `Enter the API URL`             | `https://activepieces.easiware-workbench.fr/api`     |
| `Select the API Key source`     | `Manually` → coller le token                         |

> **Note** : cette commande rebuild la pièce automatiquement
> (`nx build --skip-cache` + `npm pack`) puis envoie l'archive en multipart vers
> `POST {API_URL}/v1/pieces` avec le header `Authorization: Bearer <token>` (scope PLATFORM).

### Dépannage / remarques

- **Erreur HTTP 409** : la version existe déjà sur le serveur. Incrémenter le champ
  `version` dans [`packages/pieces/custom/easiware/package.json`](packages/pieces/custom/easiware/package.json)
  puis relancer l'upload.
- **Alternative au prompt manuel** : définir `AP_API_KEY=<token>` dans
  [`packages/server/api/.env`](packages/server/api/.env) (chargé automatiquement) et
  choisir `Env Variable (AP_API_KEY)` au prompt.
- Après upload, la pièce apparaît dans l'onglet **Pieces** de l'instance et est
  immédiatement utilisable dans les flows.
- Référence : notes de dev dans [`easiware_dev.md`](easiware_dev.md) à la racine du repo.

## Lint

Pour exécuter le lint via [ESLint](https://eslint.org/) :

```bash
npx nx lint pieces-easiware
```
