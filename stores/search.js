export const useSearchStore = defineStore('search', () => {
  const searchQuery = ref('')
  
  const clearSearchQuery = () => {
    searchQuery.value = ''
  }

  return {
    searchQuery,
    clearSearchQuery
  }
})