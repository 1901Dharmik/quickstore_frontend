import ProductPage from "../../collections/product-page";
import { fetchProductBySlugOrId } from "@/api/product";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;
  
  const productData = await fetchProductBySlugOrId(productId);
  
  // Log the data in metadata generation as well to help track down the mapping issue
  // console.log("generateMetadata API Data for", productId, ":", productData ? "Data found" : "No data");
  
  if (!productData) {
    
    return {
      title: 'Product Not Found | QuickStore',
      description: 'The requested product could not be found.',
    };
  }

  const title = productData.title || "Product Details";
  const desc = productData.description || "";
  
  let imageUrl = "";
  if (productData.images && productData.images.length > 0) {
    const rawUrl = productData.images[0].url;
    if (rawUrl) {
      imageUrl = rawUrl;
    }
  }

  return {
    title: `${title} | QuickStore`,
    description: desc,
    openGraph: {
      title: title,
      description: desc,
      images: imageUrl ? [imageUrl] : [],
      url: `https://quickstore.com/product/${productId}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: desc,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;
  const productData = await fetchProductBySlugOrId(productId);
  
  // Log the raw API data to help debug mapping issues
  // console.log("Product API Data for", productId, ":", JSON.stringify(productData, null, 2));

  return <ProductPage productId={productId} initialData={productData} />;
}
