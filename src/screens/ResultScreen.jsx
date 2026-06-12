// 3단계: 디자인 시안 결과 화면
// 지금은 자리만 잡아둔 상태이며, 다음 작업에서 Anthropic API를 연동해
// 실제 디자인 시안을 생성합니다.
export default function ResultScreen({ category, photo, onRestart }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <h2 className="screen-title">디자인 시안</h2>
      <p className="screen-subtitle">{category.name} 맞춤 디자인</p>

      <div className="result-card">
        <p>
          🎨 AI 디자인 시안이 여기에 표시됩니다.
        </p>
        <p style={{ marginTop: 12, color: 'var(--color-sub)' }}>
          (다음 단계에서 AI 연동 기능을 추가할 예정이에요)
        </p>
        {photo && (
          <p style={{ marginTop: 12, color: 'var(--color-sub)' }}>
            업로드한 사진: {photo.name}
          </p>
        )}
      </div>

      <div className="button-group">
        <button className="big-button" onClick={onRestart}>
          처음으로 돌아가기
        </button>
      </div>
    </div>
  )
}
