# hyunwoo_blog

Robot-Hyunwoo's BLOG Web Page — https://robot-hyunwoo.github.io/hyunwoo_blog/

[Fuwari](https://github.com/saicaca/fuwari) (Astro) 테마 기반 개인 기술 블로그.
글은 Notion에서 작성 후 마크다운으로 변환해 `src/content/posts/`에 추가한다.

## 개발

```bash
corepack enable        # pnpm 활성화 (최초 1회)
pnpm install
pnpm dev               # http://localhost:4321/hyunwoo_blog/
pnpm build             # 프로덕션 빌드 (dist/)
```

## 글 작성

`src/content/posts/*.md`, frontmatter는 Fuwari 스키마:

```yaml
---
title: "제목"
published: 2026-07-22
description: "한 줄 요약"
tags: [SLAM, ROS]
category: SLAM
draft: false        # true면 프로덕션에서 숨김
lang: ko
---
```

## 배포

`main` 브랜치에 push하면 GitHub Actions가 자동으로 빌드해 GitHub Pages로 배포한다.
(저장소 Settings → Pages → Source를 "GitHub Actions"로 설정 필요)

## 업스트림 관련 메모

- Fuwari `main`의 415fb97 커밋 기준 (HEAD 6d39b0d는 빌드 깨짐).
- `src/styles/markdown.css`에 `@import "./main.css";` 패치 적용 — 크로스 파일
  `@apply`가 CSS 처리 순서에 따라 실패하는 문제(NTFS에서 재현) 우회.
- 디자인 시안: `design/` 폴더 참고.
