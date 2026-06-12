import { CATEGORIES } from '../data/categories.js'

// 1단계: 카테고리 선택 화면
export default function CategoryScreen({ onSelect }) {
  return (
    <div>
      <h2 className="screen-title">어떤 제품을 만들까요?</h2>
      <p className="screen-subtitle">원하시는 항목을 눌러주세요</p>

      <div className="category-list">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            className="category-card"
            onClick={() => onSelect(category)}
          >
            <span className="category-icon">{category.icon}</span>
            <span>
              <span className="category-name">{category.name}</span>
              <br />
              <span className="category-desc">{category.desc}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
