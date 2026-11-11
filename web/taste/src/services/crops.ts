export interface Crop {
  id: string
  name: string
  price: number
  unit: string
  location: string
  quantity: number
  farmer: string
  image: string
  description: string
}

const crops: Crop[] = [
  { id: 'mango', name: 'Mango', price: 3, unit: 'kg', location: 'Phnom Penh, Cambodia', quantity: 20, farmer: 'John', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1000&q=85', description: 'Sweet, sun-ripened mangoes harvested at peak freshness.' },
  { id: 'kiwi', name: 'Kiwi', price: 5, unit: 'kg', location: 'Kampong Cham, Cambodia', quantity: 14, farmer: 'Sophea', image: 'https://images.unsplash.com/photo-1585059895524-72359e06133a?auto=format&fit=crop&w=1000&q=85', description: 'Fresh green kiwi with a bright, tangy flavor.' },
  { id: 'avocado', name: 'Avocado', price: 4, unit: 'kg', location: 'Kandal, Cambodia', quantity: 32, farmer: 'Dara', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=1000&q=85', description: 'Creamy avocados grown with care on a family farm.' },
]

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const cropService = {
  async list(): Promise<Crop[]> {
    await delay(350)
    return [...crops]
  },
  async get(id: string): Promise<Crop | undefined> {
    await delay(250)
    return crops.find((crop) => crop.id === id)
  },
  async submit(input: Pick<Crop, 'name' | 'price' | 'quantity' | 'location' | 'farmer'>): Promise<Crop> {
    await delay(350)
    const crop: Crop = { ...input, id: `${input.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`, unit: 'kg', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=85', description: `${input.name} freshly listed by ${input.farmer}.` }
    crops.unshift(crop)
    return crop
  },
}
