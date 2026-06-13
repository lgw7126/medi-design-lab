import { useRef, useState } from 'react'
import './UploadScreen.css'

const AGE_GROUPS = ['10대', '20~30대', '40~50대', '60대 이상']
const SKIN_TYPES = ['보통', '민감한 편', '매우 민감']
const SWEATING = ['보통', '땀이 많은 편']
const ALLERGY_OPTIONS = ['라텍스', '금속(니켈)', '실리콘', '아크릴']

export default function UploadScreen({ category, onUpload, onBack }) {
  const cameraInputRef = useRef(null)
  const galleryInputRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [file, setFile] = useState(null)

  const [requirements, setRequirements] = useState({ style: '', color: '', purpose: '' })
  const [wearerInfo, setWearerInfo] = useState({
    ageGroup: '',
    skinType: '',
    sweating: '',
    allergies: [],
  })

  function handleFileChange(event) {
    const selected = event.target.files[0]
    if (!selected) return
    setFile(selected)
    setPreviewUrl(URL.createObjectURL(selected))
  }

  function toggleAllergy(item) {
    setWearerInfo((prev) => ({
      ...prev,
      allergies: prev.allergies.includes(item)
        ? prev.allergies.filter((a) => a !== item)
        : [...prev.allergies, item],
    }))
  }

  function handleSubmit() {
    onUpload(file, requirements, wearerInfo)
  }

  return (
    <div className="upload-screen">
      <h2 className="screen-title">{category.icon} {category.name}</h2>
      <p className="screen-subtitle">{category.photoGuide}</p>

      {/* 사진 영역 */}
      {previewUrl ? (
        <div className="preview-wrap">
          <img src={previewUrl} alt="업로드한 사진" className="preview-image" />
          <button className="change-photo-btn" onClick={() => galleryInputRef.current.click()}>
            사진 바꾸기
          </button>
        </div>
      ) : (
        <div className="photo-buttons">
          <button className="photo-btn" onClick={() => cameraInputRef.current.click()}>
            <span className="photo-btn-icon">📷</span>
            <span className="photo-btn-label">사진 촬영</span>
          </button>
          <button className="photo-btn" onClick={() => galleryInputRef.current.click()}>
            <span className="photo-btn-icon">🖼️</span>
            <span className="photo-btn-label">갤러리에서 선택</span>
          </button>
        </div>
      )}

      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment"
        onChange={handleFileChange} style={{ display: 'none' }} />
      <input ref={galleryInputRef} type="file" accept="image/*"
        onChange={handleFileChange} style={{ display: 'none' }} />

      {previewUrl && (
        <>
          {/* 착용자 정보 */}
          <div className="info-section">
            <h3 className="info-title">착용자 정보 <span className="optional">선택사항</span></h3>

            <div className="chip-field">
              <label>나이대</label>
              <div className="chip-row">
                {AGE_GROUPS.map((g) => (
                  <button key={g}
                    className={`chip ${wearerInfo.ageGroup === g ? 'chip--active' : ''}`}
                    onClick={() => setWearerInfo((p) => ({ ...p, ageGroup: p.ageGroup === g ? '' : g }))}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="chip-field">
              <label>피부 민감도</label>
              <div className="chip-row">
                {SKIN_TYPES.map((s) => (
                  <button key={s}
                    className={`chip ${wearerInfo.skinType === s ? 'chip--active' : ''}`}
                    onClick={() => setWearerInfo((p) => ({ ...p, skinType: p.skinType === s ? '' : s }))}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="chip-field">
              <label>땀 분비</label>
              <div className="chip-row">
                {SWEATING.map((s) => (
                  <button key={s}
                    className={`chip ${wearerInfo.sweating === s ? 'chip--active' : ''}`}
                    onClick={() => setWearerInfo((p) => ({ ...p, sweating: p.sweating === s ? '' : s }))}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="chip-field">
              <label>알레르기 소재 <span className="allergy-note">(해당하는 것 모두 선택)</span></label>
              <div className="chip-row">
                {ALLERGY_OPTIONS.map((a) => (
                  <button key={a}
                    className={`chip chip--allergy ${wearerInfo.allergies.includes(a) ? 'chip--allergy-active' : ''}`}
                    onClick={() => toggleAllergy(a)}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 스타일 요구사항 */}
          <div className="info-section">
            <h3 className="info-title">원하는 스타일 <span className="optional">선택사항</span></h3>

            <div className="req-field">
              <label htmlFor="style">취향 · 스타일</label>
              <input id="style" type="text" placeholder="예: 심플한, 화려한, 자연스러운"
                value={requirements.style}
                onChange={(e) => setRequirements((p) => ({ ...p, style: e.target.value }))} />
            </div>
            <div className="req-field">
              <label htmlFor="color">색상</label>
              <input id="color" type="text" placeholder="예: 베이지, 파스텔 핑크, 무채색"
                value={requirements.color}
                onChange={(e) => setRequirements((p) => ({ ...p, color: e.target.value }))} />
            </div>
            <div className="req-field">
              <label htmlFor="purpose">주요 용도</label>
              <input id="purpose" type="text" placeholder="예: 일상용, 운동용, 특별한 날"
                value={requirements.purpose}
                onChange={(e) => setRequirements((p) => ({ ...p, purpose: e.target.value }))} />
            </div>
          </div>
        </>
      )}

      <div className="button-group" style={{ marginTop: 24 }}>
        {previewUrl && (
          <button className="big-button" onClick={handleSubmit}>
            디자인 시안 받기 →
          </button>
        )}
        <button className="big-button secondary" onClick={onBack}>← 이전으로</button>
      </div>
    </div>
  )
}
