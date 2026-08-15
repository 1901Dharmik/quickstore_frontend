import qs from "qs"
import api from "@/lib/axios"

export const fetchBrands = async (params = {}) => {
  try {
    const query = qs.stringify(params, { encodeValuesOnly: true })
    const { data } = await api.get(`/brands?${query}`)
    // The Adonis backend might return data inside a data object or pagination payload
    return data?.data || data || []
  } catch (error) {
    console.error("Error fetching brands:", error);
    return []
  }
}
