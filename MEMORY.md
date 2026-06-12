# 진행 상황 기록

## 2026-06-12 — 프로젝트 기본 구조 생성 ✅

### 완료한 것
- Vite + React 기반 프로젝트 세팅 (라우터 없이 단순한 단계 전환 방식)
- 3단계 화면 흐름 뼈대 완성:
  1. **카테고리 선택** (`src/screens/CategoryScreen.jsx`) — 보청기 케이스 / 인솔 / 손목 보호대 / 무릎 보호대
  2. **사진 업로드** (`src/screens/UploadScreen.jsx`) — 모바일 카메라·갤러리 지원, 미리보기 포함
  3. **결과 화면** (`src/screens/ResultScreen.jsx`) — 자리만 잡아둠 (AI 연동 전)
- 모바일 우선 디자인: 큰 글씨(기본 18px), 큰 버튼, 부드러운 색감 (라이프스타일 느낌)
- 카테고리 목록은 `src/data/categories.js`에서 관리 (문구 수정이 쉽도록 분리)

### 다음 할 일
- [ ] Anthropic API 연동 → 결과 화면에 실제 디자인 시안 표시
- [ ] 시안 저장 기능
- [ ] 배포 (Vercel 등)

### 로컬 실행 방법
```
npm install
npm run dev
```
브라우저에서 http://localhost:5173 접속
