---
title: "LiDAR Filtering — 2D LiDAR Scan 전처리·필터링 최적화"
published: 2026-07-23T10:00:00+09:00
description: "2D LiDAR Scan 전처리 파이프라인 구현 — 장애물 크기·반사율·영역 기반 필터와 Angle Increment 기반 원거리 보정으로 상황별 맞춤 필터링 체계 구축"
image: "/posts/lidar-filtering/cover.jpg"
tags: [Sensor, LiDAR, ROS, Filtering]
category: Project
draft: false
lang: ko
---

## 0️⃣ 프로젝트 개요

- **프로젝트명**: 2D LiDAR Scan Data Filtering 최적화 및 기능 개발
- **프로젝트 기간**: 2022년 5월 - 2022년 8월
- **프로젝트 목적**: 2D LiDAR Scan 전처리 기능 구현 및 용도별 Scan Filtering 적용
- **팀 구성**: 1명 (ROS 개발자, 단독 수행)

## 1️⃣ 역할 및 담당 업무

- **역할**: ROS 개발자
- **담당 업무**:
  - 기존 레거시 코드 및 오픈소스 Scan Filter 비교 분석
  - 장애물 크기/반사율/특정 영역 기반 필터 기능 구현
  - 필터 연산 최적화 및 Raw → 출력 간 지연시간 최소화

## 2️⃣ 기술 스택

| 분류 | 기술 | 활용 내용 |
|------|------|-----------|
| **환경** | ROS1 Kinetic / Ubuntu 16.04 | 로봇 미들웨어 및 개발 환경 구성 |
| **언어** | C++ | Filter 기능 전체 파이프라인 구성 |
| **핵심 패키지** | laser_filters, ira_laser_tools | 오픈소스 기반 Laser Filter 알고리즘 구현 |
| **센서** | 2D LiDAR | 필터링 대상 Scan 데이터 입력 |
| **도구** | CMake, RViz | 빌드 시스템 구성 및 실시간 Scan Data 시각화 검증 |

## 3️⃣ Trouble-Shooting

> [!WARNING]
> **[문제 상황] 원거리에서 Scan Point 간 간격 증가로 인한 필터링 정확도 저하**

- **원인 분석**
  - 2D LiDAR 특성상 Angle Increment가 고정되어, 거리가 멀어질수록 Scan Point 간 간격이 증가
- **해결 방법**
  - Angle Increment와 Range 기반으로 예상 Point 간격 계산
  - 예상 간격과 실제 간격 비교를 통해 정상 여부 판별
- **결과**
  - 원거리에서도 근거리와 동일한 필터링 품질 확보

## 4️⃣ 결과 및 성장

**정량적 성과**

- 장애물 크기/반사율/영역 기반 등 다양한 필터 기능 구현 완료
- 주행/맵핑/도킹 등 상황별 맞춤 필터 적용 체계 구축
- 필터 최적화로 노이즈 제거 연산 리소스 절감

**정성적 성장**

- 2D LiDAR Scan 전처리 파이프라인 설계 경험 습득
- Angle Increment 등 2D LiDAR 센서 특성에 대한 이해 확보

## 5️⃣ 데모 및 자료

**Small Object Filtering Demo**

<video controls muted preload="metadata" style="width:100%; border-radius:8px;">
  <source src="/videos/lidar-filter-demo.webm" type="video/webm" />
  브라우저가 video 태그를 지원하지 않습니다.
</video>

- <span style="color:#22c55e">**GREEN**</span>: Filtering Scan
- <span style="color:#ef4444">**RED**</span>: Origin Scan

**저반사 물질 Filtering Demo**

![저반사(3M 테이프) 물체 필터링 데모](/posts/lidar-filtering/low-reflectance-filtering.gif)
