import { useEffect, useState } from 'react'
import { validatePhoto, generateDesigns } from '../services/designApi.js'
import './ResultScreen.css'

export default function ResultScreen({ category, photo, requirements, wearerInfo, onRestart, onGoSaved, saveDesign, isSaved }) {
  const [stage, setStage] = useState('validating') // validating | generating | done | error | invalid
  const [designs, setDesigns] = useState([])
  const [errorMsg, setErrorMsg] = useState('')
  const [invalidReason, setInvalidReason] = useState('')
  const [justSaved, setJustSaved] = useState(null)

  useEffect(() => {
    async function run() {
      try {
        // 1단계: 사진 유효성 검사
        const check = await validatePhoto(photo, category)
        if (!check.valid) {
          setInvalidReason(check.reason)
          setStage('invalid')
          return
        }
        // 2단계: 디자인 시안 생성
        setStage('generating')
        const result = await generateDesigns(photo, requirements, wearerInfo, category)
        setDesigns(result)
        setStage('done')
      } catch (err) {
        setErrorMsg(err.message ?? '알 수 없는 오류가 발생했어요.')
        setStage('error')
      }
    }
    run()
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
        <button className="saved-nav-btn" onClick={onGoSaved}>저장함 🗂️</button>
      </div>
      <p className="screen-subtitle">{category.name}</p>

      {stage === 'validating' && <LoadingState message="사진을 확인하고 있어요..." sub="업로드한 사진이 맞는지 검토 중" />}
      {stage === 'generating' && <LoadingState message="AI가 맞춤 디자인을 만들고 있어요" sub="잠시만 기다려 주세요 (10~20초)" />}
      {stage === 'invalid' && <InvalidState reason={invalidReason} category={category} onBack={onRestart} />}
      {stage === 'error' && <ErrorState message={errorMsg} onRestart={onRestart} />}

      {stage === 'done' && (
        <>
          {justSaved && <div className="save-toast">❤️ "{justSaved}" 저장됨</div>}
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
            <button className="big-button secondary" onClick={onRestart}>처음으로 돌아가기</button>
          </div>
        </>
      )}
    </div>
  )
}

function LoadingState({ message, sub }) {
  return (
    <div className="loading-wrap">
      <div className="loading-spinner" />
      <p className="loading-text">{message}</p>
      <p className="loading-sub">{sub}</p>
    </div>
  )
}

function InvalidState({ reason, category, onBack }) {
  return (
    <div className="invalid-wrap">
      <p className="invalid-icon">🚫</p>
      <h3 className="invalid-title">올바른 사진이 아니에요</h3>
      <p className="invalid-reason">{reason}</p>
      <div className="invalid-guide">
        <p className="invalid-guide-label">📌 올바른 사진 예시</p>
        <p>{category.photoGuide}</p>
      </div>
      <button className="big-button" style={{ marginTop: 24 }} onClick={onBack}>
        사진 다시 올리기
      </button>
    </div>
  )
}

function ErrorState({ message, onRestart }) {
  return (
    <div className="error-wrap">
      <p className="error-icon">⚠️</p>
      <p className="error-message">{message}</p>
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
        <button className={`heart-btn ${saved ? 'heart-btn--saved' : ''}`}
          onClick={onSave} disabled={saved} aria-label={saved ? '저장됨' : '저장하기'}>
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
