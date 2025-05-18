# 🎟️ Booking App — TP Architecture Logicielle & Cluster SGBD

Application de réservation d’événements (concerts, conférences, expositions) avec cluster MariaDB Galera.

---

## 🚀 Fonctionnalités

- Liste des événements avec taux de remplissage
- Réservation d'une place si l'événement n'est pas complet
- Mise à jour temps réel via API
- Stockage en cluster MariaDB (Galera) pour haute disponibilité

---

## ⚙️ Stack technique

- Next.js (API REST)
- TypeScript
- Prisma ORM
- MariaDB Galera Cluster (Docker)
- Adminer (interface DB)

---

## 🐳 Lancer le projet

### 1. Cloner le repo et installer les dépendances

```bash
npm install
````

### 2. Lancer le cluster Galera

```bash
docker-compose up -d
```

### 3. Vérifier la connexion dans `.env`

```env
DATABASE_URL="mysql://root:rootpass@127.0.0.1:3307/booking"
```

### 4. Migrer la base + seed

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 5. Lancer le serveur Next.js

```bash
npm run dev
```

---

## 🔗 Endpoints API

| Endpoint                    | Méthode | Description                        |
| --------------------------- | ------- | ---------------------------------- |
| `/api/events`               | GET     | Liste des événements               |
| `/api/book`                 | POST    | Réserver une place                 |
| `/api/events/:id/fill-rate` | GET     | Taux de remplissage de l’événement |

---

## 📤 Exemple de requête POST

```http
POST /api/book
Content-Type: application/json

{
  "eventId": 1
}
```

Réponse attendue :

```json
{
  "message": "Réservation confirmée",
  "booking": {
    "id": 1,
    "eventId": 1,
    "createdAt": "..."
  }
}
```
---

## 🛠️ Résilience et gestion d’erreurs

- Les cas d’erreurs sont gérés proprement avec `try/catch` (ex : événement complet, mauvais ID).
- Un message explicite est renvoyé à l’utilisateur (`400`, `404`, `500` selon le cas).
- Un `console.warn` logge les tentatives sur événements pleins pour audit.

---

## 🖼️ Capture d’écran

![Vue Events](./public/screenshot/test-api-events.png)
---

### 📌 Respect des principes d’architecture (KISS, DDD, SOLID)

#### ✅ KISS

* Architecture simple, monolithique mais bien découpée (API, domaine, seed)
* Pas de complexité inutile, logique métier lisible en moins de 100 lignes

#### ✅ DDD (Domain-Driven Design)

* **Ubiquitous Language** : termes métier clairs (event, booking, capacity, fill rate)
* **Bounded Context** : logique de réservation et logique d’événement séparées dans les routes `/api/book` et `/api/events`
* **Eventual consistency** démontrée avec `/fill-rate` calculé dynamiquement

#### ✅ SOLID (focalisé sur le "S")

* **S — Single Responsibility Principle** respecté :

    * Chaque route API ne fait qu’une seule chose (ex: réserver, calculer un taux, retourner une liste)
    * La logique métier est séparée de l’affichage (pas de UI dans l’API)

#### ✅ Choix techniques motivés (cf. `ADR.md`)

* Prisma choisi pour son typage, sa simplicité, son intégration TypeScript et son support natif de MariaDB
* Cluster Galera utilisé pour garantir disponibilité et cohérence

---

## ✅ Contraintes pédagogiques respectées

* [x] Architecture modulaire avec DDD simplifié
* [x] KISS : logique métier minimaliste et claire
* [x] Cluster Galera simulé en local avec bascule testable
* [x] Prisma avec logique métier isolée
* [x] Routes testables facilement

---

## 🧪 Pour aller plus loin (facultatif)

* Ajouter du TDD avec `Vitest`
* Monitoring de l’état du cluster Galera
* UI React pour réserver depuis le navigateur

---

Projet réalisé par : **\OMRI Boubaker** — IPSSI — 2025


