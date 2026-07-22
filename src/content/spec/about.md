# About

안녕하세요, 자율주행·로봇 소프트웨어 엔지니어 **정현우**입니다. 👋

5년간 자율주행 및 로봇 소프트웨어 분야에서 경력을 쌓아왔습니다.
LiDAR·IMU·Encoder/Odometry 기반 센서 처리와 Sensor Fusion, Map 기반 Localization,
Lifelong SLAM 및 3D LiDAR SLAM을 개발해 왔고, 현재는 실외 차량 데이터 기반 SLAM과
HD Map 지도 변환을 다루고 있습니다.

현장에서 마주친 문제와 공부한 내용을 이 블로그에 기록합니다.

## 경력 히스토리

### ㈜오토노머스에이투지 · 정밀지도개발팀

**매니저 / R&D** · 2026.03 ~ 재직 중

- HD Map 지도 변환 및 기능 개발
- 실외 차량 데이터 기반 SLAM 개발
- IMU·GPS 센서 데이터 후처리 개발

### ㈜시스콘로보틱스 · Localization Part

**선임연구원 / 파트장** · 2021.01 ~ 2026.02 (5년 2개월)

- LiDAR·IMU·Encoder/Odometry 기반 센서 데이터 처리 및 Sensor Fusion
- Map 기반 Localization 개발
- Lifelong SLAM 및 3D LiDAR SLAM 개발
- Linux ROS1/C++ 기반 로봇 소프트웨어 개발

## 주요 프로젝트

- **3D LiDAR SLAM** (2024.02~08) — Wheel Odometry·IMU Factor를 통합한 Factor Graph 시스템, IMU-Wheel 비교 기반 Slip 감지. 2D SLAM 대비 평균 위치 오차 약 54% 감소
- **Lifelong SLAM** (2023.11~2024.01) — 오픈소스 커스터마이징을 통한 맵 연장·수정, 기존 맵 고정 기능. 맵핑 실패 현장 2곳 문제 해결 → [블로그 글](/posts/lifelong-mapping/)
- **2D Pose Graph SLAM Optimization** (2023.06~11) — Scan Match Score 기반 Node Optimization, 비동기 처리 구조 설계. 200m × 200m 대규모 영역 맵핑 성공
- **Landmark SLAM** (2023.06~11) — AprilTag/QR 기반 Landmark 인식과 Loop Closure, 2D LiDAR 실패 구간의 위치 복구
- **Localization Fusion Module** (2025.01~04) — robot_localization 기반 센서 융합 아키텍처 재설계, AMCL 통합. TF 출력 12Hz → 30Hz (약 2.5배)
- **Encoder Odometry** (2022.01~03) — Encoder 기반 Odometry 설계, Optitrack 검증. 평균 위치 오차 약 80% 감소 (5.2cm → 1.1cm)

## 특허

그래프 기반 SLAM 및 로봇 자율주행 관련 등록 특허 (한국)

- 그래프 기반 SLAM에서 생성되는 포즈 그래프의 **노드 최적화** — [KIPRIS](https://doi.org/10.8080/1020240118789)
- **부분 매핑**으로부터 기 구축된 공간 정보와의 통합이 구현된 로봇 — [KIPRIS](https://doi.org/10.8080/1020240118790)
- 그래프 기반 SLAM에서 생성되는 포즈 그래프의 **시각화** — [KIPRIS](https://doi.org/10.8080/1020240118791)
- 포즈 그래프 상의 노드와 연계된 **observation 편집** — [KIPRIS](https://doi.org/10.8080/1020240118792)
- **랜드마크**로부터 강건한 포즈 추정이 구현된 로봇의 자율 주행 — [KIPRIS](https://doi.org/10.8080/1020240118793)
- 로봇의 주행 상태 및 주변 환경에 따라 **적응적으로 조정되는** SLAM — [KIPRIS](https://doi.org/10.8080/1020240118794)

## 학력

- **한양대학교(ERICA)** 로봇공학과 (2015.03 ~ 2021.08)
  - 졸업작품: 스워브 드라이브와 ROS를 활용한 모바일 로봇 플랫폼

## 연락처

- Email: [mine5264@gmail.com](mailto:mine5264@gmail.com)
- LinkedIn: [linkedin.com/in/hyunwoo-jung](https://www.linkedin.com/in/hyunwoo-jung-339720182/)

::github{repo="Robot-hyunwoo/robot-hyunwoo.github.io"}
