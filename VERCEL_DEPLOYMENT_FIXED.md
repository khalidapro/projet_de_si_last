# 🚀 Vercel Deployment Guide - Fixed "Invariant failed" Issue

## ✅ Problème Résolu

**Erreur Précédente**: `Uncaught Error: Invariant failed` sur page blanche  
**Cause Racine**: Configuration SSR incompatible avec SPA statique  
**Solution**: Adaptation complète pour SPA pure sans SSR

---

## 📝 Changements Effectués

### 1. **`src/routes/__root.tsx`** ✅
- ❌ **Retiré** : `shellComponent: RootShell` (conçu pour SSR)
- ❌ **Retiré** : `head()` avec métadonnées (gérées par HTML d'entrée)
- ❌ **Retiré** : `HeadContent` et `Scripts` (imports SSR)
- ✅ **Simplifié** : RootComponent se rend directement dans le contexte routeur établi

**Raison** : Pour une SPA, TanStack Router crée le RouterProvider au niveau du point d'entrée. Le RootComponent (qui utilise `useLocation()`) peut alors l'utiliser en toute sécurité.

### 2. **`scripts/post-build.mjs`** ✅
- ✅ Génère un HTML propre avec `<div id="app"></div>`
- ✅ Ajoute les métadonnées OG/Twitter
- ✅ Charge le bundle comme `<script type="module">`
- ✅ Logs améliorés pour debug

### 3. **`src/integrations/supabase/client.ts`** ✅
- ✅ Meilleur message d'erreur si variables manquantes
- ✅ Cache les erreurs d'initialisation pour éviter les multiples tentatives
- ✅ Noms de variables corrigés : `VITE_SUPABASE_*` (pour Vite injection)

---

## 🔧 Étapes de Déploiement

### Étape 1 : Vérifier Localement

```bash
# Build complet avec post-build
npm run build

# Vérifier la structure SPA
ls -la dist/client/
# Should show:
# - index.html (généré)
# - assets/ (JS/CSS bundles)
```

**✅ Vérifications** :
- [ ] `dist/client/index.html` existe
- [ ] `dist/client/assets/` contient JS et CSS
- [ ] Pas d'erreurs dans la console du build

### Étape 2 : Tester Localement en SPA

```bash
# Servir le build SPA localement
npx http-server dist/client -p 8080 -c-1

# Accéder à http://localhost:8080
# Vérifier :
# - Landing page se charge
# - /login route fonctionne
# - Pas d'erreur "Invariant failed" dans la console (F12)
```

### Étape 3 : Configurer Vercel

**A. Environment Variables** (Vercel Dashboard → Settings → Environment Variables)

```
VITE_SUPABASE_URL=https://schjybcanjisfmntodta.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_iuMklIByHpf3M_Vk88Qzgg_niEgUIIu
```

⚠️ **IMPORTANT** :
- Préfixe `VITE_` **obligatoire** pour que Vite les injecte dans le bundle
- Sans ce préfixe, Supabase ne pourra pas s'initialiser

**B. Build Settings** (Vercel Dashboard → Settings → Build & Deployment)

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist/client
```

⚠️ La configuration `vercel.json` gère déjà cela, mais vérifiez dans le dashboard.

**C. File Rewrites** (dans `vercel.json`)

```json
{
  "outputDirectory": "dist/client",
  "rewrites": [
    { "source": "/assets/:path*", "destination": "/assets/:path*" },
    { "source": "/:path*", "destination": "/index.html" }
  ]
}
```

Cela garantit que toutes les routes SPA vont à `/index.html` et TanStack Router gère le routing côté client.

### Étape 4 : Déployer

```bash
# Commit et push
git add .
git commit -m "Fix: Adapt SPA for Vercel deployment (remove SSR shellComponent)"
git push origin main

# Vercel détecte le push et construit automatiquement
```

---

## ✅ Validation du Déploiement

Après le déploiement sur Vercel, vérifier ces points :

### 1. **Landing Page Charges** ✅
```
https://your-domain.vercel.app/
→ Page visible, logo Avocat-Link, pas de 404
→ Console : Aucune erreur "Invariant failed"
```

### 2. **Routing SPA Fonctionne** ✅
```
https://your-domain.vercel.app/login
https://your-domain.vercel.app/terms
https://your-domain.vercel.app/privacy
→ Pages se chargent (Router côté client fonctionne)
→ F12 Console : Aucune erreur
```

### 3. **Supabase Initialisation** ✅
```javascript
// F12 Console (après rechargement)
// Vérifier qu'il n'y a PAS d'erreur :
// "Missing Supabase environment variable(s)"
// Si cette erreur apparaît → Variables mal configurées sur Vercel
```

### 4. **Fonctionnalité d'Authentification** ✅
```
1. Aller à /login
2. Essayer de se connecter
3. Vérifier que Supabase auth fonctionne
4. Console (F12) : Aucune erreur CORS ou Supabase
```

---

## 🐛 Troubleshooting

### Erreur : "Cannot find module '@lovable.dev/vite-tanstack-config'"

**Solution** : Cette dépendance doit être dans `node_modules`. Faire :
```bash
npm install
# ou
bun install
```

### Erreur : "VITE_SUPABASE_URL is undefined"

**Solution** : Variables d'environnement non configurées sur Vercel
1. Aller à Vercel Dashboard → Votre projet
2. Settings → Environment Variables
3. Ajouter `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Redéployer

### Page Blanche Après Déploiement

**Debug** :
1. Ouvrir F12 (DevTools) → Console
2. Vérifier les erreurs exactes
3. Vérifier l'onglet Network que les ressources se chargent

**Causes communes** :
- Variables d'env non configurées → Erreur Supabase
- Assets chemin incorrect → Erreur 404 JS/CSS
- Erreur build → Post-build.mjs n'a pas généré index.html

### Erreur "Invariant failed" Persiste

**Debug supplémentaire** :
1. S'assurer que `__root.tsx` n'utilise PAS `shellComponent`
2. Vérifier dans `dist/client/index.html` qu'il contient `<div id="app"></div>`
3. Vérifier que le bundle se charge (Network tab → JS file)
4. Regarder la stack trace complète en F12

---

## 📚 Architecture Finale

```
Landing → TanStack Router
           ├─ /              (Landing Page)
           ├─ /login         (Login Form)
           ├─ /terms, /privacy
           └─ Protected Routes (après auth Supabase)
               ├─ /dashboard    (Clients)
               ├─ /workspace    (Lawyers)
               ├─ /directory
               ├─ /messages
               ├─ /audit
               └─ /settings
                
Supabase:
  - Auth (email/password)
  - Profiles table (role, name, specialty, etc.)
  - RLS Policies pour sécurité

SPA Delivery:
  - Vercel sert dist/client/ (static)
  - index.html pour toutes les routes
  - React + TanStack Router côté client
```

---

## ✨ Résumé des Bénéfices

| Aspect | SSR (Avant) | SPA (Après) |
|--------|-----------|-----------|
| **Initialisation** | Complexe (ShellComponent) | Simple (SPA classique) |
| **RouterProvider** | Unclear context setup | Clear, client-side mounting |
| **"Invariant failed"** | ❌ Erreur due au contexte | ✅ Contexte valide |
| **Vercel Compat** | ❌ Conflit | ✅ Native SPA support |
| **Performance** | SSR overhead | Lightweight client-side |

---

## 🚀 C'est Parti!

1. ✅ Code adapté localement
2. ✅ Build test : `npm run build`
3. ✅ Variables Vercel configurées
4. ✅ Redéployer et tester
5. ✅ Console propre, app fonctionne!

**Questions?** Vérifiez les étapes de troubleshooting ou contactez support Supabase/Vercel.
