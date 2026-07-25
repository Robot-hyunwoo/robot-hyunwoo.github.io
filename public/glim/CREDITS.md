# GLIM 시각화 자료 — 출처 및 라이선스

이 디렉토리의 이미지 출처를 정리합니다.

## 공식 이미지 (외부 출처)

### glim_modules_official.png
- **출처**: GLIM — koide3, `docs/assets/module.png`
- **저장소**: https://github.com/koide3/glim
- **라이선스**: MIT License (Copyright (c) 2024 koide3)
- **내용**: GLIM 모듈 변종 맵 (Odometry / Sub mapping / Global mapping 각 변종 + GPU 가속 표시)

### scancontext_scmaking.gif
- **출처**: Scan Context — G. Kim & A. Kim, *"Scan Context: Egocentric Spatial Descriptor for Place Recognition within 3D Point Cloud Map"*, IROS 2018
- **저장소**: https://github.com/gisbi-kim/scancontext (`example/basic/scmaking.gif`)
- **저작권**: KAIST and Naver Labs
- **라이선스**: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 (CC BY-NC-SA 4.0)
  - 비상업(NonCommercial) 목적에 한함 · 출처 표기 필수 · 2차 저작물은 동일 라이선스(ShareAlike)
  - http://creativecommons.org/licenses/by-nc-sa/4.0/

## 자체 제작 이미지 (원저작물)

`glim_scancontext.png`, `glim_pipeline.png` 등 접미어 없는 파일은 이 프로젝트에서 직접 제작한 설명용 시각화입니다.
알고리즘/플로우는 GLIM·glim_ext 소스 코드와 Scan Context 논문에 기반하며, descriptor heatmap 등 일부 그림은 합성(예시) 데이터로 생성한 삽화입니다. 공식 자료가 아닙니다.
생성 스크립트: `~/glim_ws/viz/gen_*.py`
