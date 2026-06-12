import { useState } from 'react'
import CategoryScreen from './screens/CategoryScreen.jsx'
import UploadScreen from './screens/UploadScreen.jsx'
import ResultScreen from './screens/ResultScreen.jsx'
import './App.css'

// 화면 흐름: 카테고리 선택 → 사진 업로드 → 디자인 시안 결과
export default function App() {
  const [step, setStep] = useState('category')
  const [category, setCategory] = useState(null)
  const [photo, setPhoto] = useState(null)

  function handleCategorySelect(selected) {
    setCategory(selected)
    setStep('upload')
  }

  function handlePhotoUpload(file) {
    setPhoto(file)
    setStep('result')
  }

  function handleRestart() {
    setCategory(null)
    setPhoto(null)
    setStep('category')
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>MediDesign Lab</h1>
        <p className="app-tagline">나에게 꼭 맞는 디자인을 찾아드려요</p>
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
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  )
}
