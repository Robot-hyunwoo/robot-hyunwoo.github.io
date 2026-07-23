---
title: "2D Pose Graph Based SLAM Optimization — 대규모 맵핑·리소스 최적화"
published: 2026-07-23T11:00:00+09:00
description: "Scan Match Score 기반 Node 최적화와 비동기 처리 구조로 2D Pose Graph SLAM 강건화 — 200m×200m 대규모 영역 맵핑 성공 및 Vertex 생성 안정화"
image: ""
tags: [SLAM, PoseGraph, Optimization, LiDAR]
category: Project
draft: false
lang: ko
---

## 0️⃣ 프로젝트 개요

- **프로젝트명**: 2D Pose Graph 기반 SLAM 최적화
- **프로젝트 기간**: 2023년 6월 - 2023년 11월
- **프로젝트 목적**: 2D Pose Graph SLAM 최적화 및 맵핑 추가 기능 개발을 통해 강건한 성능 확보
- **팀 구성**: 3명 (ROS SLAM 개발자 2명, QA 1명)

## 1️⃣ 역할 및 담당 업무

- **역할**: ROS SLAM 개발자
- **담당 업무**:
  - Scan Match Score 기반 Node Optimization 기능 개발
  - Main Process와 Data Callback 분리를 통한 비동기 처리 구조 설계
  - 현장 운용 및 디버깅을 위한 Pose Graph 시각화 노드 개발
  - 시뮬레이션 검증 및 실환경 적용 테스트

## 2️⃣ 기술 스택

| 분류 | 기술 | 활용 내용 |
|------|------|-----------|
| **환경** | ROS1 Melodic / Ubuntu 18.04 | 로봇 미들웨어 및 개발 환경 구성 |
| **언어** | C++ | SLAM 전체 파이프라인 구현 |
| **핵심 패키지** | SR-SLAM | slam_toolbox 기반 커스텀 SLAM 패키지 개발 |
| **센서** | 2D LiDAR, Wheel Odometry | Pose Graph 생성을 위한 스캔 및 이동량 데이터 제공 |
| **도구** | CMake, RViz, CLion | 빌드 시스템 구성 및 Pose Graph 시각화 검증 |

## 3️⃣ Trouble-Shooting

> [!WARNING]
> **[문제 상황] Vertex(Node) 제거 시 Pose Graph 연결 구조 단절**

- **원인 분석**
  - 시뮬레이션 및 현장 rosbag 데이터로 문제 상황 재현
  - Vertex 삭제 시 연결된 Edge가 함께 제거되면서, 특정 조건에서 Graph 연결이 단절되는 것 확인
- **해결 방법**
  - Scan Match Score 기준으로 삭제 대상 Vertex 선정
  - Vertex 삭제 후 인접 Node 간 Edge를 재연결하는 로직 개발
- **결과**
  - Graph 연결 구조가 끊어지지 않고 정상 유지
  - Loop Closure 및 Vertex 후보군 탐색 기능 정상 동작 확인

## 4️⃣ 결과 및 성장

**정량적 성과**

- 기존 알고리즘으로 맵핑 불가했던 대규모 영역(**200m × 200m**) 맵핑 성공
- 비동기 구조 적용으로 데이터 누락 없이 Vertex 생성 안정화 (**동일 환경 기준 1,353개 → 1,478개, 약 9% 증가**)
- Pose Graph 시각화 도구 개발로 원격 디버깅 체계 구축, 개발자 현장 방문 불필요

**정성적 성장**

- Pose Graph SLAM의 내부 구조를 분석하고 프로젝트 요구사항에 맞게 커스터마이징하는 역량 확보
- Multi-thread 및 TBB 적용에 따른 프로세스 부하 차이를 실측하고, 최적 병렬 처리 구조를 선정하는 경험 습득
- GDB를 활용하여 segfault 에러 등 메모리 오류 디버깅 방법 습득

## 5️⃣ 데모 및 자료

**Pose Graph Optimization Simulation**

<!-- VIDEO_PENDING: /videos/pose-graph-optimization-demo.webm (노션 첨부 sr-slam-pose-graph-optimization.webm) -->
> 데모 영상 준비 중입니다.
