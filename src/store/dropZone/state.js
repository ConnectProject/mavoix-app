export default {
  tab: {
    id: '', // Parse id
    slug: '', // Slug
    color: '', // Color
    speed: '',
    language: '',
    imageSize: 'medium' // small | medium | large — matches panel grid
  },
  deviceImageScale: null, // 0 (smallest) to 100 (largest) chosen for this device in the panel; null = follow the tab's imageSize
  items: [], // Items
  activeItems: [], // Active items
  subscription: null // Parse subscription
}
