---
title: "3D LiDAR SLAM — Factor Graph 기반 3D 맵핑"
published: 2026-07-22
description: "동적 환경에 취약한 2D SLAM의 한계를 3D LiDAR로 극복 — LIO-SAM 기반 커스텀 Factor Graph, Wheel·IMU Factor 융합과 Slip 감지로 정지 안정성 확보"
tags: [SLAM, LIO-SAM, FactorGraph, LiDAR, IMU]
category: Project
draft: false
lang: ko
---

## 0️⃣ 프로젝트 개요

- **프로젝트명**: 3D LiDAR를 활용한 SLAM 개발
- **프로젝트 기간**: 2024년 2월 - 2024년 8월
- **프로젝트 목적**: 3D LiDAR를 활용하여 동적 환경에 취약한 2D LiDAR SLAM의 한계 극복
- **팀 구성**: 2명 (ROS SLAM 개발자 2명)

## 1️⃣ 역할 및 담당 업무

- **역할**: ROS SLAM 개발자
- **담당 업무**:
  - Wheel Odometry 및 IMU Factor를 통합한 Factor Graph 시스템 구현
  - IMU-Wheel 데이터 비교 기반 Slip 감지 로직 구현
  - 3D LiDAR 입력 인터페이스 통일화로 다중 LiDAR 센서 호환 지원

## 2️⃣ 기술 스택

| 분류 | 기술 | 활용 내용 |
|------|------|-----------|
| **환경** | ROS1 Melodic / Ubuntu 18.04 | 로봇 미들웨어 및 개발 환경 구성 |
| **언어** | C++ | Factor Graph SLAM 구현 및 커스텀 |
| **핵심 패키지** | LIO-SAM | LIO-SAM 기반 커스텀 Factor Graph SLAM 개발 |
| **센서** | 3D LiDAR, Wheel Odometry, IMU | Factor Graph 생성을 위한 Point Cloud 및 이동량 데이터 제공 |
| **도구** | CMake, RViz, CLion | 빌드 시스템 구성 및 3D Map 시각화 |

## 3️⃣ Trouble-Shooting

> [!WARNING]
> **[문제 상황] 정지 상태에서 위치 추정 안정성 저하**

- **원인 분석**
  - Calibration 이후에도 IMU 데이터에 미세한 떨림 존재
  - Drift 누적으로 인해 정지 중에도 IMU Factor가 생성되어 위치 이동 발생
- **해결 방법**
  - Wheel Odometry Factor를 추가하여 IMU 단독 의존도 감소
  - Wheel-IMU 데이터 비교를 통해 정지/주행 상태를 판별하고, 상태별 가중치를 적용하여 위치 산출
- **결과**
  - 정지 상태에서 안정적인 TF 산출
  - 주행 시 IMU 가중치 조정으로 안정적인 위치 추정 유지

## 4️⃣ 결과 및 성장

**정량적 성과**

- 2D SLAM 대비 평균 위치 오차 약 54% 감소
- 최대 오차 58% 감소, X축 정밀도 69% 개선
- 동적 환경에서 2D SLAM이 실패하던 구간에서도 안정적인 위치 추정 가능

**정성적 성장**

- Factor Graph 구조 설계 및 IMU Preintegration 원리에 대한 이해 습득
- 정지/주행 상태 판별 기반 센서 가중치 조정 기법 습득

## 5️⃣ 데모

<video controls muted preload="metadata" style="width:100%; border-radius:8px;">
  <source src="/videos/lio-sam-demo.webm" type="video/webm" />
  브라우저가 video 태그를 지원하지 않습니다.
</video>

3D LiDAR를 이용한 실시간 Factor Graph SLAM 맵핑 데모.
