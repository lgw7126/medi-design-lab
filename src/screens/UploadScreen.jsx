import { useRef, useState } from 'react'

// 2단계: 사진 업로드 화면
export default function UploadScreen({ category, onUpload, onBack }) {
  const fileInputRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [file, setFile] = useState(null)

  function handleFileChange(event) {
    const selected = event.target.files[0]
    if (!selected) return
    setFile(selected)
    setPreviewUrl(URL.createObjectURL(selected))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <h2 className="screen-title">{category.name}</h2>
      <p className="screen-subtitle">
        해당 부위 사진을 올려주시면
        <br />
        맞춤 디자인을 만들어드려요
      </p>

      {previewUrl ? (
        <img src={previewUrl} alt="업로드한 사진" className="preview-image" />
      ) : (
        <div className="upload-box" onClick={() => fileInputRef.current.click()}>
          <span className="upload-icon">📷</span>
          <span>사진 올리기</span>
          <span className="upload-hint">눌러서 촬영하거나 사진을 선택하세요</span>
        </div>
      )}

      {/* capture 없이 accept만 지정: 모바일에서 카메라/갤러리 모두 선택 가능 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <div className="button-group">
        {previewUrl && (
          <>
            <button className="big-button" onClick={() => onUpload(file)}>
              이 사진으로 디자인 만들기
            </button>
            <button
              className="big-button secondary"
              onClick={() => fileInputRef.current.click()}
            >
              다른 사진 선택
            </button>
          </>
        )}
        <button className="big-button secondary" onClick={onBack}>
          ← 이전으로
        </button>
      </div>
    </div>
  )
}
