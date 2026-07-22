---
title: "Lifelong Mapping — 2D Pose Graph 연장·수정 SLAM"
published: 2025-06-05
description: "기존 맵을 고정한 채 수정·확장 구역을 연장 맵핑하는 Lifelong SLAM 개발기 — slam_toolbox 커스터마이징, TBB 병렬화로 TF Lookup 실패 해결"
tags: [SLAM, PoseGraph, slam_toolbox, ROS]
category: PROJECT
draft: false
lang: ko
---

## 0️⃣ 프로젝트 개요

- **프로젝트명**: 2D Pose Graph 연장 및 수정 SLAM
- **프로젝트 기간**: 2023년 11월 - 2024년 1월
- **프로젝트 목적**: 기존 맵의 수정 및 확장 구역 연장 맵핑 기능 개발
- **팀 구성**: 3명 (ROS SLAM 개발자 2명, Field Engineer 1명)

## 1️⃣ 역할 및 담당 업무

- **역할**: ROS SLAM 개발자
- **담당 업무**:
  - Lifelong SLAM 오픈소스 커스터마이징을 통한 맵 연장 및 수정 기능 구현
  - Solver Constant Parameter 활용으로 기존 맵 고정 기능 구현
  - 시뮬레이션 검증 및 실환경 적용 테스트

## 2️⃣ 기술 스택

| 분류 | 기술 | 활용 내용 |
|------|------|-----------|
| **환경** | ROS1 Melodic / Ubuntu 18.04 | 로봇 미들웨어 및 개발 환경 구성 |
| **언어** | C++ | Lifelong SLAM 전체 파이프라인 구현 |
| **핵심 패키지** | slam_toolbox (커스텀) | 오픈소스 기반 커스텀 SLAM 패키지 개발 |
| **센서** | 2D LiDAR, Wheel Odometry | Pose Graph 생성을 위한 스캔 및 이동량 데이터 제공 |
| **도구** | CMake, RViz, CLion | 빌드 시스템 구성 및 Pose Graph 시각화 검증 |

## 3️⃣ Trouble-Shooting

> [!WARNING]
> **[문제 상황] Process 시간 지연으로 인한 Odom TF Lookup 실패**

- **원인 분석**
  - 시각화 처리에서 높은 연산 부하 발생
  - 다중 반복문 및 비최적화 파라미터로 인해 메인 프로세스 지연
- **해결 방법**
  - 다중 반복문에 TBB 병렬 처리 적용으로 지연 시간 최소화
  - 시각화 및 상태 체크 로직을 메인 프로세스에서 분리하여 별도 스레드로 처리
- **결과**
  - Odom TF Lookup 실패 문제 해결
  - 메인 프로세스 지연 해소로 맵핑 품질 향상

## 4️⃣ 결과 및 성장

**정량적 성과**

- 기존 맵핑 실패 현장 2곳 문제 해결 및 이후 현장 적용 시 안정적 동작 확인
- 맵 수정/연장 기능 확보로 현장 유지보수 및 파라미터 튜닝 리소스 절감

**정성적 성장**

- TBB 기반 병렬 처리 기법 습득 및 적용 경험 확보
- 시각화/센서 처리/메인 로직 간 프로세스 분리 설계의 중요성 재확인
