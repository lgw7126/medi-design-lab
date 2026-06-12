import { useRef, useState } from 'react'
import './UploadScreen.css'

// 2단계: 사진 업로드 + 요구사항 입력 화면
export default function UploadScreen({ category, onUpload, onBack }) {
  const cameraInputRef = useRef(null)
  const galleryInputRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [file, setFile] = useState(null)
  const [requirements, setRequirements] = useState({
    style: '',
    color: '',
    purpose: '',
  })

  function handleFileChange(event) {
    const selected = event.target.files[0]
    if (!selected) return
    setFile(selected)
    setPreviewUrl(URL.createObjectURL(selected))
  }

  function handleSubmit() {
    onUpload(file, requirements)
  }

  return (
    <div className="upload-screen">
      <h2 className="screen-title">{category.icon} {category.name}</h2>
      <p className="screen-subtitle">사진을 올리고 원하는 스타일을 알려주세요</p>

      {/* 사진 영역 */}
      {previewUrl ? (
        <div className="preview-wrap">
          <img src={previewUrl} alt="업로드한 사진" className="preview-image" />
          <button
            className="change-photo-btn"
            onClick={() => galleryInputRef.current.click()}
          >
            사진 바꾸기
          </button>
        </div>
      ) : (
        <div className="photo-buttons">
          <button
            className="photo-btn"
            onClick={() => cameraInputRef.current.click()}
          >
            <span className="photo-btn-icon">📷</span>
            <span className="photo-btn-label">사진 촬영</span>
          </button>
          <button
            className="photo-btn"
            onClick={() => galleryInputRef.current.click()}
          >
            <span className="photo-btn-icon">🖼️</span>
            <span className="photo-btn-label">갤러리에서 선택</span>
          </button>
        </div>
      )}

      {/* capture="environment": 후면 카메라로 바로 촬영 */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      {/* capture 없음: 카메라·갤러리 모두 선택 가능 */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* 요구사항 입력 — 사진 업로드 후 표시 */}
      {previewUrl && (
        <div className="requirements">
          <h3 className="req-title">원하는 스타일을 알려주세요 <span className="optional">선택사항</span></h3>

          <div className="req-field">
            <label htmlFor="style">취향 · 스타일</label>
            <input
              id="style"
              type="text"
              placeholder="예: 심플한, 화려한, 자연스러운"
              value={requirements.style}
              onChange={(e) => setRequirements((prev) => ({ ...prev, style: e.target.value }))}
            />
          </div>

          <div className="req-field">
            <label htmlFor="color">색상</label>
            <input
              id="color"
              type="text"
              placeholder="예: 베이지, 파스텔 핑크, 무채색"
              value={requirements.color}
              onChange={(e) => setRequirements((prev) => ({ ...prev, color: e.target.value }))}
            />
          </div>

          <div className="req-field">
            <label htmlFor="purpose">주요 용도</label>
            <input
              id="purpose"
              type="text"
              placeholder="예: 일상용, 운동용, 특별한 날"
              value={requirements.purpose}
              onChange={(e) => setRequirements((prev) => ({ ...prev, purpose: e.target.value }))}
            />
          </div>
        </div>
      )}

      {/* 하단 버튼 */}
      <div className="button-group" style={{ marginTop: 24 }}>
        {previewUrl && (
          <button className="big-button" onClick={handleSubmit}>
            디자인 시안 받기 →
          </button>
        )}
        <button className="big-button secondary" onClick={onBack}>
          ← 이전으로
        </button>
      </div>
    </div>
  )
}
