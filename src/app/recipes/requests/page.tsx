import RequestBoard from '@/components/Recipes/RequestBoard';

export const metadata = { title: 'Recipe Requests' };

export default function RecipeRequestsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="font-display text-4xl font-semibold text-espresso mb-2">Recipe Requests</h1>
      <p className="text-espresso-light mb-8">
        A public board of what family and friends want to see cooked next — and what&apos;s already made it onto the blog.
      </p>
      <RequestBoard />
    </div>
  );
}
