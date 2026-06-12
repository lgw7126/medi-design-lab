import { useState, useEffect } from 'react'

const STORAGE_KEY = 'medi_saved_designs'

export function useSavedDesigns() {
  const [saved, setSaved] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
  }, [saved])

  function saveDesign(design, category) {
    const item = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
      savedAt: new Date().toISOString(),
      category,
      design,
    }
    setSaved((prev) => [item, ...prev])
    return item.id
  }

  function removeDesign(id) {
    setSaved((prev) => prev.filter((d) => d.id !== id))
  }

  function isSaved(designName, categoryId) {
    return saved.some(
      (d) => d.design.name === designName && d.category.id === categoryId
    )
  }

  return { saved, saveDesign, removeDesign, isSaved }
}
