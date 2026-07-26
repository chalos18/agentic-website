import Doodle from '@/components/motifs/Doodle';
import RecipeList from '@/components/Recipes/RecipeList';
import { getAllRecipes } from '@/lib/content';

export const metadata = { title: 'Recipes' };

export default function RecipesPage() {
  const recipes = getAllRecipes();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="font-display text-4xl font-semibold text-espresso mb-8 flex items-center gap-3">
        <Doodle variant="burger" className="w-8 h-8 text-mustard-dark" />
        Recipes
      </h1>
      <RecipeList posts={recipes} />
    </div>
  );
}
