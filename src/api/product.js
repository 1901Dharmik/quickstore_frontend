import qs from "qs"
import api from "@/lib/axios"

export const fetchProducts = async (params = {}) => {
  try {
    const query = qs.stringify(params, { encodeValuesOnly: true })
    const { data } = await api.get(`/products?${query}`)
    return data || { data: [], pagination: { totalPages: 0 } }
  } catch (error) {
    console.error("Error fetching products:", error);
    return { data: [], pagination: { totalPages: 0 } }
  }
}

export const fetchProductById = async (id, params = {}) => {
  try {
    const query = qs.stringify(params, { encodeValuesOnly: true })
    const { data } = await api.get(`/products/${id}?${query}`)
    return data?.data || null
  } catch (error) {
    console.error(`Error fetching product by ID (${id}):`, error);
    return null
  }
}

export const fetchProductBySlug = async (slug, params = {}) => {
  try {
    const query = qs.stringify(params, { encodeValuesOnly: true })
    const { data } = await api.get(`/products/${slug}?${query}`)
    return data?.data || null
  } catch (error) {
    console.error(`Error fetching product by slug (${slug}):`, error);
    return null
  }
}

export const fetchProductBySlugOrId = async (slugOrId, params = {}) => {
  if (!slugOrId) return null
  
  // Since our Adonis backend's show method handles both slug and ID seamlessly
  // we can just call fetchProductById (which hits /products/:id)
  return await fetchProductById(slugOrId, params)
}
