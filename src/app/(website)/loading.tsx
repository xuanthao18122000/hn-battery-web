export default function HomeLoading() {
  return (
    <div className="min-h-screen">
      {/* Banner skeleton */}
      <div className="w-full h-[280px] md:h-[400px] bg-gray-200 animate-pulse" />

      {/* Brand section skeleton */}
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-20 bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Product sections skeleton */}
      <div className="container mx-auto px-4 py-6 max-w-7xl space-y-8">
        {Array.from({ length: 2 }).map((_, s) => (
          <div key={s}>
            <div className="h-7 w-56 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-3 animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
