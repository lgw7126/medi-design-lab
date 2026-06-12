import { useEffect, useState } from 'react'
import { generateDesigns } from '../services/designApi.js'
import './ResultScreen.css'

export default function ResultScreen({ category, photo, requirements, onRestart, onGoSaved, saveDesign, isSaved }) {
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [justSaved, setJustSaved] = useState(null)

  useEffect(() => {
    generateDesigns(photo, requirements, category)
      .then(setDesigns)
      .catch((err) => setError(err.message ?? '알 수 없는 오류가 발생했어요.'))
      .finally(() => setLoading(false))
  }, [])

  function handleSave(design) {
    saveDesign(design, category)
    setJustSaved(design.name)
    setTimeout(() => setJustSaved(null), 2000)
  }

  return (
    <div className="result-screen">
      <div className="result-header">
        <h2 className="screen-title">{category.icon} 맞춤 디자인 시안</h2>
        <button className="saved-nav-btn" onClick={onGoSaved}>
          저장함 🗂️
        </button>
      </div>
      <p className="screen-subtitle">{category.name}</p>

      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRestart={onRestart} />}

      {!loading && !error && designs.length > 0 && (
        <>
          {justSaved && (
            <div className="save-toast">❤️ "{justSaved}" 저장됨</div>
          )}
          <div className="design-list">
            {designs.map((design, i) => (
              <DesignCard
                key={i}
                design={design}
                index={i}
                saved={isSaved(design.name, category.id)}
                onSave={() => handleSave(design)}
              />
            ))}
          </div>
          <div className="button-group" style={{ marginTop: 16 }}>
            <button className="big-button secondary" onClick={onRestart}>
              처음으로 돌아가기
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function LoadingState() {
  return (
    <div className="loading-wrap">
      <div className="loading-spinner" />
      <p className="loading-text">AI가 맞춤 디자인을 만들고 있어요</p>
      <p className="loading-sub">잠시만 기다려 주세요 (10~20초)</p>
    </div>
  )
}

function ErrorState({ message, onRestart }) {
  return (
    <div className="error-wrap">
      <p className="error-icon">⚠️</p>
      <p className="error-message">{message}</p>
      <p className="error-hint">
        API 키가 올바르게 설정되어 있는지 확인해 주세요.
      </p>
      <button className="big-button secondary" style={{ marginTop: 24 }} onClick={onRestart}>
        처음으로 돌아가기
      </button>
    </div>
  )
}

function DesignCard({ design, index, saved, onSave }) {
  const labels = ['1안', '2안', '3안']
  return (
    <div className={`design-card ${saved ? 'design-card--saved' : ''}`}>
      <div className="design-card-header">
        <div className="design-card-title-row">
          <span className="design-badge">{labels[index] ?? `${index + 1}안`}</span>
          <h3 className="design-name">{design.name}</h3>
        </div>
        <button
          className={`heart-btn ${saved ? 'heart-btn--saved' : ''}`}
          onClick={onSave}
          disabled={saved}
          aria-label={saved ? '저장됨' : '저장하기'}
        >
          {saved ? '❤️' : '🤍'}
        </button>
      </div>

      <p className="design-concept">{design.concept}</p>

      <div className="design-section">
        <span className="design-label">소재 제안</span>
        <p className="design-materials">{design.materials}</p>
      </div>

      <div className="design-section">
        <span className="design-label">주요 특징</span>
        <ul className="design-features">
          {design.features.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
