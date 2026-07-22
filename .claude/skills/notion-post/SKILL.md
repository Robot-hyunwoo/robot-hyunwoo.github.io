---
name: notion-post
description: 노션 글을 가져와 Fuwari 마크다운으로 변환하고, 카테고리를 확인한 뒤 커밋·배포·배포 확인까지 수행하는 블로그 발행 파이프라인
---

# 노션 → 블로그 발행 파이프라인

사용자가 `/notion-post <노션 페이지 제목 또는 URL>`을 실행하면 아래 단계를 순서대로 수행한다.
인자가 없으면 먼저 어떤 노션 글을 발행할지 물어본다.

## 전제 조건

- 이 저장소는 Fuwari(Astro) 블로그다. 글은 `src/content/posts/*.md`에 위치한다.
- 노션 접근은 claude.ai Notion MCP 커넥터를 사용한다 (`notion-search`, `notion-fetch`).
  MCP가 연결되어 있지 않으면 사용자에게 Notion 커넥터 연결을 요청하고 중단한다.
- 배포는 main에 push하면 GitHub Actions가 자동 수행한다 (2~3분 소요).
- 블로그 주소: https://robot-hyunwoo.github.io/hyunwoo_blog/

## 1단계 — 노션 글 가져오기

1. 인자가 URL이면 `notion-fetch`로 직접 가져온다. 제목이면 `notion-search`로 찾은 뒤
   후보가 여러 개면 사용자에게 확인한다.
2. 본문이 비어 있으면(blank page) 사용자에게 알리고 중단한다.
3. 페이지 속성(Tag, 생성일, 한 줄 요약 등)과 본문 블록을 모두 확보한다.

## 2단계 — Fuwari 마크다운 변환

frontmatter는 반드시 이 스키마를 따른다 (그 외 필드는 넣지 않는다):

```yaml
---
title: "노션 페이지 제목"
published: YYYY-MM-DD        # 노션 생성일 (없으면 오늘)
description: "한 줄 요약"     # 노션 '한 줄 요약' 속성 또는 본문 첫 문단 요약
tags: [태그1, 태그2]          # 노션 Tag 속성
category: 카테고리            # 3단계에서 확정
draft: false
lang: ko
---
```

본문 변환 규칙:
- 콜아웃 → `> [!NOTE]` / `> [!TIP]` 등 admonition 또는 인용 블록
- 토글 → `<details><summary>제목</summary>내용</details>`
- 수식: 인라인 `$...$`, 블록 `$$...$$` (KaTeX가 렌더링)
- mermaid 코드 블록은 ```mermaid 펜스 그대로 유지
- 코드 블록의 주석은 영어로 유지/번역한다 (프로젝트 규칙)
- 노션 이미지는 다운로드해서 `src/assets/images/posts/<슬러그>/`에 저장하고
  상대 경로로 참조한다. 다운로드 실패 시 사용자에게 알린다.
- 이모지·한글은 그대로 유지한다.

파일명(슬러그)은 영문 소문자-하이픈으로 만든다 (예: `visual-odometry-vs-visual-slam.md`).

## 3단계 — 카테고리/메타 질의응답

1. 기존 카테고리 수집: `grep -h "^category:" src/content/posts/*.md | sort -u`
2. AskUserQuestion으로 확인한다:
   - **카테고리**: 기존 카테고리 + 노션 상위 DB에서 추정한 카테고리를 선택지로 제시
     (기본 카테고리 후보: SLAM, ROS, Sensor, Code, AI, Autonomous, Project, System, Book)
   - 변환 결과 요약(제목/태그/설명)을 보여주고 수정할 부분이 있는지 확인
3. 확정되면 `src/content/posts/<슬러그>.md`로 저장한다.

## 4단계 — 빌드 검증

```bash
pnpm install --frozen-lockfile   # node_modules 없을 때만
pnpm build
```

빌드 실패 시 push하지 말고 에러를 고친 뒤 다시 빌드한다.

## 5단계 — 커밋 및 배포

```bash
git add src/content/posts/<슬러그>.md src/assets/images/posts/<슬러그>/ 2>/dev/null
git commit -m "New post: <제목>"
git push origin main
```

## 6단계 — 배포 확인

1. GitHub Actions 완료 대기 (public API, 인증 불필요):
   ```bash
   until [ "$(curl -s 'https://api.github.com/repos/Robot-hyunwoo/hyunwoo_blog/actions/runs?per_page=1' \
     | python3 -c "import json,sys; r=json.load(sys.stdin)['workflow_runs'][0]; print(r['status'])")" = "completed" ]; do sleep 20; done
   ```
2. conclusion이 `success`인지 확인하고, 실패면 로그를 분석해 수정한다.
3. 글 URL 접속 확인:
   ```bash
   curl -s -o /dev/null -w "%{http_code}" "https://robot-hyunwoo.github.io/hyunwoo_blog/posts/<슬러그>/"
   ```
4. 사용자에게 최종 글 URL을 알려준다.

## 주의사항

- push 전 반드시 로컬 빌드가 성공해야 한다.
- 같은 슬러그의 파일이 이미 있으면 덮어쓰기 전에 사용자에게 확인한다.
- 노션 원문은 수정하지 않는다 (읽기 전용).
