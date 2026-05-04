# 🚀 Vercel Deployment Guide - Avocat-Link

## Architecture Overview

Cette application est une **SPA (Single Page Application)** React générée par Lovable avec Vite et TanStack Router, déployée sur Vercel avec Supabase comme backend.

### Stack
- **Frontend**: React 19 + TanStack Router
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Backend**: Supabase (PostgreSQL + Auth)
- **Build Tool**: Vite
- **Deployment**: Vercel

---

## 🔧 Pre-Deployment Setup

### 1. Supabase Configuration

Assurez-vous que votre projet Supabase a:

#### Tables créées
- `profiles` - Profils utilisateur (clients & avocats)
- `consultations` - Consultations entre clients et avocats
- `messages` - Messages entre utilisateurs
- `audit_logs` - Logs d'audit pour conformité

#### RLS (Row Level Security) Policies
Les policies RLS DOIVENT être activées pour sécuriser les données:

```sql
-- Exemple: Chaque utilisateur ne peut voir que ses propres données
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);
```

#### Environment Variables (Supabase)
Vérifiez dans votre fichier `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxx
```

### 2. Local Build Verification

Avant de déployer, testez localement:

```bash
# Build complet
npm run build

# Vérifier la structure SPA
npm run build:check
```

Vous devez voir:
- ✅ `dist/client/index.html` généré
- ✅ `dist/client/assets/` avec les fichiers JS/CSS
- ✅ `vercel.json` configuré correctement

---

## 📦 Vercel Configuration

### Structure des fichiers critiques

```
projet_de_si_last/
├── vercel.json                 # Configuration Vercel (SPA routing)
├── vite.config.ts             # Lovable config (NE PAS MODIFIER)
├── package.json               # Build scripts avec post-build
├── dist/
│   ├── client/                # SPA assets (servies par Vercel)
│   │   ├── index.html
│   │   └── assets/
│   └── server/                # Cloudflare Workers (ignoré par Vercel)
└── scripts/
    └── post-build.mjs         # Génère index.html après build
```

### Configuration vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/client",
  "framework": "vite",
  "env": {
    "VITE_SUPABASE_URL": "@vite_supabase_url",
    "VITE_SUPABASE_PUBLISHABLE_KEY": "@vite_supabase_publishable_key"
  },
  "rewrites": [
    {
      "source": "/assets/:path*",
      "destination": "/assets/:path*"
    },
    {
      "source": "/:path*",
      "destination": "/index.html"
    }
  ]
}
```

**Explications:**
- `buildCommand`: Lance Vite build + post-build script
- `outputDirectory`: Vercel sert depuis `dist/client` (pas `dist/server`)
- `rewrites`: Les routes non-trouvées vont à `index.html` (TanStack Router côté client prend la relève)
- `env`: Variables d'env mappées aux secrets Vercel

---

## 🌐 Déploiement sur Vercel

### Étape 1: Créer un projet Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez votre repo GitHub
3. Créez un nouveau projet
4. Sélectionnez le framework: **Vite** (ou laissez auto-detect)

### Étape 2: Configurer les Environment Variables

Dans le dashboard Vercel, allez à **Settings → Environment Variables** et ajoutez:

| Variable | Valeur | Scope |
|----------|--------|-------|
| `VITE_SUPABASE_URL` | Votre URL Supabase | Production, Preview, Development |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Votre clé publique | Production, Preview, Development |

**⚠️ Critique**: Assurez-vous que les variables commencent par `VITE_` pour être exposées au client.

### Étape 3: Déployer

```bash
# Commit et push vers GitHub
git add .
git commit -m "Configure Vercel deployment for SPA"
git push origin main

# Vercel détecte le push et construit automatiquement
```

### Étape 4: Vérifier le déploiement

1. Attendez que Vercel finisse le build (logs disponibles dans dashboard)
2. Cliquez sur le lien de preview
3. Vous devez voir la landing page
4. Testez la navigation:
   - `/login` - Page de connexion
   - `/directory` - Annuaire avocats (après connexion)
   - `/workspace` - Portal avocat (après connexion)

---

## 🔐 Sécurité Supabase + Frontend

### CORS Configuration

Supabase accepte les requêtes depuis n'importe quel domaine (CORS), mais vous devez sécuriser via RLS:

```sql
-- Dans Supabase SQL Editor
-- Exemple RLS pour consultations
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own consultations"
  ON consultations FOR SELECT
  USING (auth.uid() = client_id OR auth.uid() = lawyer_id);

CREATE POLICY "Users can update own consultations"
  ON consultations FOR UPDATE
  USING (auth.uid() = client_id OR auth.uid() = lawyer_id);
```

### Authentication Flow

1. Utilisateur se connecte via Supabase Auth
2. `supabase.auth.signInWithPassword()` retourne un JWT
3. JWT est stocké dans `localStorage` par Supabase
4. Toutes les requêtes utilisent le JWT automatiquement
5. Supabase RLS policies valident l'accès côté serveur

---

## 🧪 Troubleshooting

### Problème: 404 Page Not Found

**Cause**: Les routes ne sont pas rewritées vers `index.html`

**Solution**:
1. Vérifiez `vercel.json` - rewrites doivent rediriger `/:path*` → `/index.html`
2. Redéployez après modification
3. Videz le cache du navigateur

### Problème: Variables d'environnement non trouvées

**Cause**: Variables d'env non ajoutées à Vercel ou ne commencent pas par `VITE_`

**Solution**:
1. Vercel Dashboard → Settings → Environment Variables
2. Assurez-vous que les variables commencent par `VITE_`
3. Redéployez

### Problème: "Cannot read properties of undefined (reading 'auth')"

**Cause**: Supabase n'est pas initialisé correctement

**Solution**:
1. Vérifiez que `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY` sont correctes
2. Vérifiez dans le navigateur que les variables sont présentes: `console.log(import.meta.env.VITE_SUPABASE_URL)`

### Problème: CORS Error lors de requêtes Supabase

**Cause**: Domaine Vercel n'est pas autorisé ou RLS policies bloquent l'accès

**Solution**:
1. Vérifiez les RLS policies dans Supabase
2. Testez avec une policy permissive: `CREATE POLICY "Allow all" ... USING (true);`
3. Cherchez les erreurs dans Supabase logs

---

## 📊 Monitoring & Logs

### Vercel Logs

Dashboard → Deployments → Voir les logs du build et runtime

### Supabase Logs

Dashboard Supabase → Logs → Voir les requêtes API et RLS violations

### Browser Console

Dans le navigateur (F12):
- Erreurs React
- Requêtes Supabase
- Logs applicatifs

---

## 🔄 CI/CD Pipeline

Chaque push à `main` déclenche automatiquement:

1. **Build** (`npm run build`):
   - Vite bundle le client
   - Post-build génère `dist/client/index.html`
   
2. **Deploy** (Vercel):
   - Copie `dist/client` vers CDN + edge functions
   - Cache assets immuables
   - Rewrite des routes SPA

3. **Test** (optionnel):
   - `npm run test` (Vitest)
   - Linting: `npm run lint`

---

## 📝 Checklist de Déploiement

- [ ] `.env` contient `VITE_SUPABASE_*` variables
- [ ] `npm run build` réussit localement
- [ ] `npm run build:check` valide la structure SPA
- [ ] `vercel.json` est présent et correct
- [ ] Supabase RLS policies sont configurées
- [ ] Vercel Environment Variables sont définies
- [ ] Git repo est à jour et pushed
- [ ] Build Vercel réussit (vérifier les logs)
- [ ] Déploiement accessible (vérifier le domaine Vercel)
- [ ] Auth Supabase fonctionne (tester login)
- [ ] Requêtes Supabase fonctionnent (tester une page protégée)

---

## 🚨 Points Critiques

### ⚠️ NE MODIFIEZ PAS vite.config.ts
Le fichier `vite.config.ts` est contrôlé par `@lovable.dev/vite-tanstack-config`. Toute modification cassera le build.

### ⚠️ Post-build est OBLIGATOIRE
Sans `scripts/post-build.mjs`, Vercel n'aura pas `index.html` et affichera 404.

### ⚠️ RLS Policies DOIVENT être configurées
Sans RLS, n'importe quel utilisateur peut accéder aux données de tout le monde.

### ⚠️ Secrets Supabase NE DOIVENT PAS être dans le code
Utilisez TOUJOURS les environment variables Vercel.

---

## 📞 Support

- **Vercel Issues**: https://vercel.com/support
- **Supabase Issues**: https://supabase.com/docs
- **TanStack Router**: https://tanstack.com/router/latest
- **Vite Issues**: https://vitejs.dev
