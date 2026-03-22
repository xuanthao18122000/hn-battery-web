export default function SlugLoading() {
  return (
    <main className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Product detail skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="aspect-square bg-gray-200 rounded-lg mb-6" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-6" />
              <div className="h-12 bg-gray-200 rounded-lg w-full mb-3" />
              <div className="h-12 bg-gray-200 rounded-lg w-full" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
