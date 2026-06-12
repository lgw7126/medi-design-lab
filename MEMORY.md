# 진행 상황 기록

## 2026-06-12 — MVP 1단계 전체 완성 ✅

### 완료한 것

#### 1. React 프로젝트 기본 구조
- Vite + React 세팅
- 3단계 화면 흐름 뼈대: 카테고리 선택 → 사진 업로드 → 결과
- 모바일 우선 반응형, 큰 글씨(18px), 라이프스타일 느낌 색상
- 카테고리 목록 데이터 분리 (`src/data/categories.js`)

#### 2. 업로드 화면 개선
- 사진 촬영(카메라) / 갤러리 선택 버튼 분리
- 취향·색상·용도 선택사항 입력란 (사진 업로드 후 표시)
- "디자인 시안 받기" 버튼

#### 3. Anthropic API 연동
- `@anthropic-ai/sdk` 설치
- 사진(base64) + 요구사항을 API에 전송
- 시안 2~3개 생성: 이름 / 컨셉 / 소재 제안 / 특징 포함
- API 키는 `.env` 파일로 관리 (`.gitignore` 적용)

#### 4. 디자인 카드 + 저장 기능
- 결과 화면: 하트 버튼(🤍/❤️)으로 시안 저장
- 저장 시 카드 테두리 강조 + 토스트 알림
- `localStorage`로 저장 — 브라우저 껐다 켜도 유지
- 헤더에 저장함 버튼 + 저장 개수 뱃지

#### 5. 저장함 화면
- 저장된 시안 카드 목록으로 모아보기
- 카테고리 · 저장 날짜 표시
- 휴지통 버튼으로 개별 삭제

#### 6. GitHub Pages 배포
- `.github/workflows/deploy.yml` 작성
- main 브랜치 푸시 시 자동 빌드 + 배포
- 배포 주소: https://lgw7126.github.io/medi-design-lab/

---

### 파일 구조
```
src/
├── App.jsx / App.css         # 전체 흐름 관리, 헤더
├── index.css                 # 전역 스타일 (색상, 글씨 크기)
├── data/
│   └── categories.js         # 카테고리 목록 (수정하기 쉽게 분리)
├── hooks/
│   └── useSavedDesigns.js    # 저장 기능 (localStorage)
├── screens/
│   ├── CategoryScreen.jsx    # 1단계: 카테고리 선택
│   ├── UploadScreen.jsx      # 2단계: 사진 업로드 + 요구사항
│   ├── ResultScreen.jsx      # 3단계: AI 시안 결과 + 저장
│   └── SavedScreen.jsx       # 저장함: 모아보기
└── services/
    └── designApi.js          # Anthropic API 호출
```

---

### 남은 작업
- [ ] GitHub Secrets에 `VITE_ANTHROPIC_API_KEY` 등록 (AI 기능 활성화)
- [ ] 실제 사용 테스트 후 UI 개선
- [ ] 시안 이미지 생성 기능 (2단계)
- [ ] 3D/CAD 연동 (3단계 이후)
