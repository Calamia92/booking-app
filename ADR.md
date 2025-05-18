# 🧠 Architectural Decision Record

## 🧱 Choix 1 — Architecture Monolithique modulaire

Nous avons choisi une architecture monolithique modulaire en couches pour les raisons suivantes :

- Le périmètre de l’application est simple et bien délimité (réservation événementielle).
- Permet de structurer proprement le code (domain / application / api).
- Plus rapide à mettre en œuvre que des microservices.
- Favorise la simplicité (KISS), tout en autorisant une future évolution vers DDD ou microservices si besoin.

## 🐬 Choix 2 — Base de données MariaDB Galera en cluster

Un cluster Galera a été mis en place avec 2 nœuds pour répondre à la contrainte métier :

- Affichage du taux de remplissage en temps réel nécessite une base haute disponibilité.
- Galera permet une réplication synchrone et tolérance aux pannes.
- Le cluster a été testé avec `docker-compose`, chaque nœud écoutant sur un port différent (`3307`, `3308`).
- L'utilisation de Prisma avec `DATABASE_URL` adaptée permet de se connecter via un nœud du cluster.

## 🛠️ Choix 3 — Utilisation de Prisma comme ORM

Nous avons choisi **Prisma** pour les raisons suivantes :

- Typage TypeScript automatique (meilleure DX que Sequelize ou TypeORM)
- Intégration rapide avec Next.js (pas de config complexe)
- Génération automatique de client fortement typé (`prisma.event.findMany()` autocomplété)
- Support natif de `seed`, `migrate`, `generate` en CLI
- Compatible avec MariaDB sans surcoût

🆚 Alternatives comme Sequelize sont plus flexibles côté requêtes brutes, mais plus verbeuses, moins typées, et moins adaptées à un projet TypeScript moderne.

## ✅ Résumé

Ce choix d’architecture garantit un bon équilibre entre simplicité, évolutivité et robustesse pour une application événementielle.

---
