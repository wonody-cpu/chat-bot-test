# 모아 AI 챗봇

HTML, CSS, JavaScript, Node.js, Express로 만든 간단한 AI 챗봇입니다. 브라우저가 현재 대화 목록을 서버로 함께 보내므로 데이터베이스 없이도 이전 대화를 반영합니다. 새로고침하거나 **새 대화**를 누르면 기록은 초기화됩니다.

## 로컬 실행

Node.js 20 이상이 필요합니다.

```bash
npm install
cp .env.example .env
# .env의 OPENAI_API_KEY를 실제 키로 변경
npm run dev
```

브라우저에서 `http://localhost:3000`을 여세요.

## Vercel 배포

1. 이 폴더를 Git 저장소에 올린 뒤 Vercel에서 프로젝트로 가져옵니다.
2. Vercel 프로젝트의 **Settings → Environment Variables**에 `OPENAI_API_KEY`를 추가합니다.
3. 별도 Build Command 없이 배포합니다.

API 키는 프런트엔드로 전달되지 않으며 서버 함수에서만 사용됩니다. 비용과 오남용 방지를 위해 공개 서비스에서는 인증, rate limit, 사용량 모니터링을 추가하는 것이 좋습니다.
