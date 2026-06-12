import './SavedScreen.css'

export default function SavedScreen({ saved, onRemove, onBack }) {
  return (
    <div className="saved-screen">
      <h2 className="screen-title">저장함</h2>
      <p className="screen-subtitle">마음에 든 시안을 모아봤어요</p>

      {saved.length === 0 ? (
        <div className="saved-empty">
          <p className="saved-empty-icon">🗂️</p>
          <p>저장된 시안이 없어요</p>
          <p className="saved-empty-sub">마음에 드는 시안의 하트를 눌러보세요</p>
        </div>
      ) : (
        <div className="saved-list">
          {saved.map((item) => (
            <SavedCard key={item.id} item={item} onRemove={onRemove} />
          ))}
        </div>
      )}

      <div className="button-group" style={{ marginTop: 24 }}>
        <button className="big-button secondary" onClick={onBack}>
          ← 돌아가기
        </button>
      </div>
    </div>
  )
}

function SavedCard({ item, onRemove }) {
  const date = new Date(item.savedAt).toLocaleDateString('ko-KR', {
    month: 'long', day: 'numeric',
  })

  return (
    <div className="saved-card">
      <div className="saved-card-top">
        <div>
          <span className="saved-category-badge">
            {item.category.icon} {item.category.name}
          </span>
          <h3 className="saved-design-name">{item.design.name}</h3>
          <p className="saved-date">{date} 저장</p>
        </div>
        <button
          className="remove-btn"
          onClick={() => onRemove(item.id)}
          aria-label="저장 취소"
        >
          🗑️
        </button>
      </div>

      <p className="saved-concept">{item.design.concept}</p>

      <div className="saved-detail">
        <span className="design-label">소재</span>
        <p>{item.design.materials}</p>
      </div>

      <div className="saved-detail">
        <span className="design-label">특징</span>
        <ul className="design-features">
          {item.design.features.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
