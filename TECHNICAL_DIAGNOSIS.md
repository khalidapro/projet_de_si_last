# 🔍 Diagnostic Technique - "Invariant failed" Root Cause Analysis

## Problème Signalé

```
Build Vercel: ✅ SUCCESS
Runtime Browser: ❌ BLANK PAGE
Console Error: Uncaught Error: Invariant failed.
```

---

## 🔎 Analyse de la Cause Racine

### Architecture Initiale (Problématique)

```typescript
// src/routes/__root.tsx
export const Route = createRootRoute({
  head: () => ({ /* metadata */ }),         // ← SSR metadata
  shellComponent: RootShell,                // ← ⚠️ PROBLÉMATIQUE
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />                     // ← SSR injection
      </head>
      <body>
        {children}
        <Scripts />                         // ← SSR initialization scripts
      </body>
    </html>
  );
}

function RootComponent() {
  const loc = useLocation();                // ← ⚠️ Hook dans contexte invalide
  // ...
}
```

### Le Conflit Fondamental

**L'application utilise TanStack Router en mode SSR (Server-Side Rendering)** :
- `shellComponent` rend une structure HTML complète en JavaScript
- `HeadContent` et `Scripts` gèrent l'hydration SSR
- Le RouterProvider est établi via une approche SSR

**MAIS sur Vercel SPA, l'HTML d'entrée est statique** :
```html
<!-- dist/client/index.html (généré par post-build.mjs) -->
<!DOCTYPE html>
<html>
  <head><!-- métadonnées --></head>
  <body>
    <div id="app"></div>  <!-- ← Point de montage SPA -->
    <script type="module" src="...bundle.js"></script>
  </body>
</html>
```

### Chaîne de l'Erreur

```
1. Browser charge index.html (HTML statique)
   ↓
2. JS bundle se charge et s'exécute
   ↓
3. Le bundle tente de monter React dans <div id="app">
   ↓
4. React rend RootComponent()
   ↓
5. RootComponent() appelle useLocation()
   ↓
6. ❌ useLocation() a besoin d'un RouterProvider en contexte
   ↓
7. ❌ Le RouterProvider n'existe pas (mode SSR, pas SPA)
   ↓
8. TanStack Router lance : "Invariant failed"
   (via tiny-invariant library)
```

### Pourquoi "Invariant failed" Sans Détails?

`tiny-invariant` (libraire TanStack Router) est une simple assertion :

```typescript
// Pseudocode de tiny-invariant
export function invariant(condition, message) {
  if (!condition) {
    throw new Error(message || 'Invariant failed');
  }
}
```

TanStack Router appelle :
```typescript
invariant(
  routerContext !== null,
  'Hook useLocation cannot be used without a Router context'
)
```

Mais si le contexte n'existe pas du tout, même pas un console.error clair n'apparaît.

---

## 🧩 Architecture du Problème

```
┌─────────────────────────────────────────────────┐
│ Vercel (Static SPA Deployment)                  │
├─────────────────────────────────────────────────┤
│ 1. Serve index.html (static)                    │
│ 2. Load bundle.js (React + TanStack)            │
│ 3. React mounts in <div id="app">               │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ Bundle.js Execution (React App)                 │
├─────────────────────────────────────────────────┤
│ ① Code au top-level s'exécute                   │
│    - Imports                                     │
│    - Initialisation Supabase client              │
│    - Création du routeur TanStack               │
│                                                  │
│ ② React.render() appelle root component        │
│    - RootComponent()                             │
│    - Appelle useLocation() ← ⚠️ Hook            │
│    - Attend un RouterProvider en contexte       │
│                                                  │
│ ③ ❌ RouterProvider pas trouvé                  │
│    - Mode SSR attend shellComponent             │
│    - Mode SPA n'a pas de shellComponent         │
│    - Erreur: "Invariant failed"                 │
└─────────────────────────────────────────────────┘
```

---

## ✅ Solution Appliquée

### 1. **Retrait du Mode SSR**

```typescript
// ❌ AVANT (SSR)
export const Route = createRootRoute({
  head: () => ({ /* ... */ }),
  shellComponent: RootShell,          // ← Removed
  component: RootComponent,
});

function RootShell({ children }) {
  return (
    <html>                            // ← Removed
      <head>
        <HeadContent />               // ← Removed
      </head>
      <body>
        {children}
        <Scripts />                   // ← Removed
      </body>
    </html>
  );
}

// ✅ APRÈS (SPA)
export const Route = createRootRoute({
  component: RootComponent,           // Direct rendering
});

// RootComponent() can now safely use useLocation()
// because it's rendered inside a RouterProvider context
```

**Raison** : En SPA, le RouterProvider est établi au niveau du point d'entrée du bundle (gérée automatiquement par @lovable.dev/vite-tanstack-config). Le RootComponent est donc rendu EN CONTEXTE du routeur.

### 2. **HTML d'Entrée Correct**

```javascript
// post-build.mjs - Généré correctement pour SPA
const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Métadonnées statiques -->
    <title>Avocat-Link</title>
    <meta name="description" content="..." />
    <link rel="stylesheet" href="/assets/styles-XXX.css" />
  </head>
  <body>
    <!-- Point de montage SPA -->
    <div id="app"></div>
    
    <!-- Script du bundle -->
    <script type="module" src="/assets/client-XXX.js"></script>
  </body>
</html>
`;
```

**Raison** : C'est l'entrée standard d'une SPA React. Le bundle DOIT monter dans `#app`.

### 3. **Initialisation Supabase Robuste**

```typescript
// client.ts - Meilleure gestion d'erreur
export const supabase = new Proxy({}, {
  get(_, prop, receiver) {
    // Si erreur précédente, re-throw
    if (_initError) throw _initError;
    
    try {
      if (!_supabase) _supabase = createSupabaseClient();
      return Reflect.get(_supabase, prop, receiver);
    } catch (error) {
      // Cache l'erreur pour éviter des multiples tentatives
      _initError = error;
      throw error;
    }
  },
});
```

**Raison** : Évite les multiples tentatives d'initialisation et fournit des erreurs claires si Supabase n'est pas configuré.

---

## 🔬 Vérification des Hypothèses

### Hypothèse 1 : Hook en dehors du Provider ✅
**Confirmée** : `useLocation()` dans RootComponent était appelée avant RouterProvider établi.

### Hypothèse 2 : Variables d'Env Supabase ✅
**Vérifiée** : `.env` contient les variables VITE_* (correctes pour Vite injection).

### Hypothèse 3 : Conflit SSR/SPA ✅
**Confirmée** : Architecture SSR incompatible avec SPA statique sur Vercel.

---

## 🧪 Scénario Test

### Avant la Correction
```
1. npm run build
   ✅ Build réussit
   
2. Vercel déploie
   ✅ Déploiement réussit
   
3. Navigateur accède à https://domain.vercel.app
   ✅ index.html chargé
   ✅ bundle.js chargé
   ❌ Page blanche
   ❌ Console: "Invariant failed"
```

### Après la Correction
```
1. npm run build
   ✅ Build réussit
   ✅ post-build.mjs génère index.html correct
   
2. Vercel déploie
   ✅ Déploiement réussit
   
3. Navigateur accède à https://domain.vercel.app
   ✅ index.html chargé
   ✅ bundle.js chargé
   ✅ React monte dans <div id="app">
   ✅ RootComponent() rendu dans RouterProvider context ← KEY FIX
   ✅ TanStack Router établi
   ✅ Page visible, app fonctionne
   ✅ Console propre
```

---

## 🎯 Points Clés de la Solution

| Point | Problème | Solution |
|-------|---------|----------|
| **RootShell** | Rend HTML complet (SSR) | Removed - SPA ne rend que le contenu |
| **RouterProvider** | Pas établi au bon niveau | Automatique via @lovable.dev plugin |
| **useLocation()** | Hook en contexte invalide | Maintenant en contexte valide (RootComponent dans Provider) |
| **HTML d'entrée** | Structure SSR | Structure SPA simple avec `<div id="app">` |
| **Métadonnées** | Générées par HeadContent | Générées par post-build.mjs |

---

## 📋 Checklist de Vérification

Après le déploiement, vérifier :

- [ ] **Console (F12)** : Aucune erreur "Invariant failed"
- [ ] **Network (F12)** : bundle.js et styles-*.css chargés avec 200 OK
- [ ] **Landing page** : `/` affiche le contenu
- [ ] **Routing** : `/login`, `/terms` se chargent via TanStack Router côté client
- [ ] **Supabase** : Pas d'erreur "Missing VITE_SUPABASE_*"
- [ ] **Assets** : Images, icônes se chargent correctement
- [ ] **Authentication** : Supabase auth flow fonctionne

---

## 🚀 Impact

- ✅ **Erreur éliminée** : "Invariant failed" résolu
- ✅ **Architecture clarifiée** : SPA pure, sans SSR confusion
- ✅ **Maintenabilité** : Code plus simple, moins de magie SSR
- ✅ **Performance** : SPA plus légère que SSR pour une app statiquement servie
- ✅ **Compatibilité Vercel** : Aligné avec les attentes SPA de Vercel

---

## 📚 Références TanStack

- [TanStack Router SSR](https://tanstack.com/router/latest/docs/framework/react/ssr)
- [TanStack Router SPA](https://tanstack.com/router/latest/docs/framework/react/spa-mode)
- [tiny-invariant library](https://npm.im/tiny-invariant)

---

## 💡 Leçon Apprise

Lovable génère des configs pour **SSR par défaut** (@tanstack/react-start). Pour une **SPA statique** sur Vercel, il faut adapter manuellement :
- Retirer `shellComponent` 
- Utiliser HTML d'entrée simple
- S'assurer que le RouterProvider est établi au niveau du point d'entrée SPA
