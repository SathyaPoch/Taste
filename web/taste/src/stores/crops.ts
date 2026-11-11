import { defineStore } from 'pinia'
import { ref } from 'vue'
import { cropService, type Crop } from '../services/crops'

export const useCropsStore = defineStore('crops', () => {
  const items = ref<Crop[]>([])
  const loading = ref(false)
  const error = ref('')
  const loaded = ref(false)

  async function load() {
    if (loaded.value || loading.value) return
    loading.value = true
    error.value = ''
    try {
      items.value = await cropService.list()
      loaded.value = true
    } catch {
      error.value = 'We could not load the crop listings. Please try again.'
    } finally {
      loading.value = false
    }
  }

  async function add(input: Pick<Crop, 'name' | 'price' | 'quantity' | 'location' | 'farmer'>) {
    const crop = await cropService.submit(input)
    items.value.unshift(crop)
    loaded.value = true
    return crop
  }

  return { items, loading, error, loaded, load, add }
})
