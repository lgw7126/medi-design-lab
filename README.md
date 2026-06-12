# MediDesign Lab

사진을 업로드하면 AI가 맞춤형 의료 액세서리 디자인 시안을 생성해주는 웹앱.
보청기 케이스, 인솔, 손목·무릎 보호대를 심미성과 착용감 모두 고려해 제안합니다.

<br>

[![앱 바로 열기](https://img.shields.io/badge/앱%20바로%20열기-4a7c6f?style=for-the-badge&logo=googlechrome&logoColor=white)](https://lgw7126.github.io/medi-design-lab/)

<br>

---

## 현재 상태

**MVP 1단계 진행 중** — 기본 기능 구현 완료, 실사용 테스트 단계

- 🟢 카테고리 선택 → 사진 업로드 → AI 디자인 시안 생성
- 🟢 마음에 드는 시안 저장 및 모아보기
- 🟡 이미지 생성 기능 (2단계 예정)
- ⚪ 3D/CAD 연동 (3단계 이후)

---

## 로컬 실행

```bash
git clone https://github.com/lgw7126/medi-design-lab.git
cd medi-design-lab
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속
> `.env` 파일에 `VITE_ANTHROPIC_API_KEY=발급받은키` 를 입력해야 AI 기능이 작동합니다.

---

## 기술 스택

- **프론트엔드** React + Vite
- **AI** Anthropic Claude API
- **배포** GitHub Pages

---

자세한 기획 의도 및 작업 규칙은 [CLAUDE.md](./CLAUDE.md)를 참고하세요.
