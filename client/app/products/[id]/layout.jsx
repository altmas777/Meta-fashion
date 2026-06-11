export async function generateMetadata({ params }) {
  try {
    // We use standard fetch here for the server-side metadata generation
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products/${params.id}`, { cache: 'no-store' });
    const data = await res.json();
    const product = data?.data;

    if (!product) {
      return { title: 'Product Not Found' };
    }

    return {
      title: product.name,
      description: product.description.substring(0, 160),
      openGraph: {
        title: `${product.name} | Meta Fashion`,
        description: product.description.substring(0, 160),
        images: product.images?.[0] ? [{ url: product.images[0].url }] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description: product.description.substring(0, 160),
        images: product.images?.[0] ? [product.images[0].url] : [],
      }
    };
  } catch (error) {
    return { title: 'Product | Meta Fashion' };
  }
}

export default function ProductLayout({ children }) {
  return <>{children}</>;
}
