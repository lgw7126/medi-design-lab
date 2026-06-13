import { useState } from 'react'
import CategoryScreen from './screens/CategoryScreen.jsx'
import UploadScreen from './screens/UploadScreen.jsx'
import ResultScreen from './screens/ResultScreen.jsx'
import SavedScreen from './screens/SavedScreen.jsx'
import { useSavedDesigns } from './hooks/useSavedDesigns.js'
import './App.css'

export default function App() {
  const [step, setStep] = useState('category')
  const [category, setCategory] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [requirements, setRequirements] = useState(null)
  const [wearerInfo, setWearerInfo] = useState(null)
  const { saved, saveDesign, removeDesign, isSaved } = useSavedDesigns()

  function handleCategorySelect(selected) {
    setCategory(selected)
    setStep('upload')
  }

  function handlePhotoUpload(file, reqs, wearer) {
    setPhoto(file)
    setRequirements(reqs)
    setWearerInfo(wearer)
    setStep('result')
  }

  function handleRestart() {
    setCategory(null)
    setPhoto(null)
    setRequirements(null)
    setWearerInfo(null)
    setStep('category')
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-row">
          <div>
            <h1>MediDesign Lab</h1>
            <p className="app-tagline">나에게 꼭 맞는 디자인을 찾아드려요</p>
          </div>
          {step !== 'saved' && (
            <button className="header-saved-btn" onClick={() => setStep('saved')}>
              저장함
              {saved.length > 0 && (
                <span className="header-saved-count">{saved.length}</span>
              )}
            </button>
          )}
        </div>
      </header>

      <main className="app-main">
        {step === 'category' && (
          <CategoryScreen onSelect={handleCategorySelect} />
        )}
        {step === 'upload' && (
          <UploadScreen
            category={category}
            onUpload={handlePhotoUpload}
            onBack={() => setStep('category')}
          />
        )}
        {step === 'result' && (
          <ResultScreen
            category={category}
            photo={photo}
            requirements={requirements}
            wearerInfo={wearerInfo}
            onRestart={handleRestart}
            onGoSaved={() => setStep('saved')}
            saveDesign={saveDesign}
            isSaved={isSaved}
          />
        )}
        {step === 'saved' && (
          <SavedScreen
            saved={saved}
            onRemove={removeDesign}
            onBack={() => setStep(category ? 'result' : 'category')}
          />
        )}
      </main>
    </div>
  )
}
