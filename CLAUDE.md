# CLAUDE.md

이 저장소는 Fuwari(Astro) 테마 기반 개인 기술 블로그다.
배포 주소: https://robot-hyunwoo.github.io/hyunwoo_blog/

## 명령어

```bash
corepack enable                  # pnpm 활성화 (최초 1회)
pnpm install --frozen-lockfile   # 의존성 설치
pnpm dev                         # 개발 서버 → http://localhost:4321/hyunwoo_blog/
pnpm build                       # 프로덕션 빌드 (dist/) — push 전 반드시 통과 확인
```

## 구조

- `src/content/posts/*.md` — 블로그 글 (Fuwari frontmatter 스키마 필수)
- `src/content/spec/about.md` — About 페이지
- `src/config.ts` — 사이트/프로필/내비바 설정
- `src/assets/images/` — 아바타·배너·글 이미지
- `.github/workflows/deploy.yml` — main push 시 GitHub Pages 자동 배포
- `design/` — 초기 디자인 시안 (참고용 HTML)
- `.claude/skills/notion-post/` — 노션 글 발행 파이프라인 스킬 (`/notion-post`)

## 글 frontmatter 스키마

```yaml
---
title: "제목"
published: 2026-07-22
description: "한 줄 요약"
tags: [SLAM, ROS]
category: SLAM        # SLAM | ROS | Sensor | Code | AI | Autonomous | Project | System | Book
draft: false          # true면 프로덕션에서 숨김
lang: ko
---
```

## 글 발행 흐름

노션에서 글을 가져와 발행할 때는 `/notion-post <제목 또는 URL>` 스킬을 사용한다
(노션 MCP 커넥터 필요). 수동 발행은: 마크다운 작성 → `pnpm build` 통과 확인 →
commit → push → GitHub Actions가 자동 배포 (2~3분).

## 규칙

- 코드 주석은 영어로 작성한다.
- push 전 로컬 `pnpm build`가 성공해야 한다 (빌드 실패 상태로 push 금지).
- 업스트림 Fuwari 대비 커스텀 패치가 있다 (README "업스트림 관련 메모" 참고):
  - `src/styles/markdown.css` 상단 `@import "./main.css";` — 삭제 금지
  - `src/components/widget/Profile.astro` — bio의 `\n` 줄바꿈 렌더링
- Fuwari 테마 업데이트 시 위 패치가 유지되는지 확인한다.
