export default function SkeletonCard() {
  return (
    <div className="card flex flex-col relative overflow-hidden animate-pulse">
      {/* Image Container */}
      <div className="relative aspect-[3/4] bg-border" />

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="h-5 bg-border w-3/4 mb-2" />
        <div className="h-3 bg-border w-1/4 mb-4" />
        
        <div className="mt-auto flex items-end justify-between">
          <div className="h-5 bg-border w-16" />
          <div className="h-3 bg-border w-8" />
        </div>
      </div>
    </div>
  );
}
