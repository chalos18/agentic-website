export interface RecipeRequest {
  id: string;
  recipeName: string;
  note: string;
  submitterName: string;
  status: 'open' | 'quoted' | 'dismissed';
  createdAt: string;
}

// Gates the two admin-only actions (quote/dismiss) in /api/recipe-requests/[id] —
// everything else (browsing, submitting a request) stays login-free by design.
// Set RECIPE_ADMIN_KEY in the environment before deploying; this fallback is
// dev-only and not a real secret.
export const RECIPE_ADMIN_KEY = process.env.RECIPE_ADMIN_KEY || 'let-me-cook';
