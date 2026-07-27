---
title: "로보틱스 비전 학습 로드맵"
published: 2026-07-27T14:00:00+09:00
description: "로보틱스 배경에서 컴퓨터 비전을 학문적으로 처음부터 익혀가는 로드맵. 수학 기반부터 이미지 형성·특징·다중뷰 SLAM·딥러닝 비전을 거쳐 Visual Servoing까지, 각 주제를 '왜 필요한가' 중심으로 정리한다."
tags: [Vision, ComputerVision, RoadMap, Study]
category: Vision
draft: false
lang: ko
---

> 로보틱스 배경을 가진 사람이 컴퓨터 비전을 처음부터 학문적으로 익혀가는 기록입니다. 외부 공개 겸 학습용으로, 각 주제를 **"왜 필요한가"** 중심으로 정리합니다.

## 이 로드맵을 읽는 법

전체는 하나의 질문으로 꿰어집니다 — **"3차원 세계를 2차원 이미지에 담을 때 잃어버린 정보를, 어떻게 되찾아 로봇을 움직이는가?"**

- **Part 0** 은 모든 것의 언어가 되는 수학(선형대수·기하)입니다. 비전은 결국 기하의 문제라, 여기가 흔들리면 뒤가 전부 흔들립니다.
- **Part 1 → 2 → 3** 은 정보의 흐름을 따라갑니다. 이미지가 어떻게 만들어지고(형성), 거기서 무엇을 뽑아내고(특징), 그것으로 사라진 3D를 어떻게 복원하는지(다중뷰·SLAM).
- **Part 4** 는 학습 기반 인식으로, 기하만으로 풀기 어려운 "이것이 무엇인가"에 답합니다.
- **Part 5** 는 비전을 로봇의 움직임으로 잇는 종착점입니다.

각 주제는 **순서**대로 따라가며, 개별 주제 페이지를 열어 내용을 정리하고 진도를 관리합니다.

## 핵심 표준 교재

- Szeliski, *Computer Vision: Algorithms and Applications* (2nd ed., 무료 공개): [szeliski.org/Book](https://szeliski.org/Book/)
- Hartley & Zisserman, *Multiple View Geometry in Computer Vision*: [robots.ox.ac.uk/~vgg/hzbook](https://www.robots.ox.ac.uk/~vgg/hzbook/)
- Corke, *Robotics, Vision and Control*: [petercorke.com/rvc](https://petercorke.com/rvc/)

---

## Part 0. 수학 기반 (선형대수·기하)

비전은 결국 기하의 문제. 모든 파트의 언어가 되는 토대다.

| # | 주제 | 난이도 | 핵심 레퍼런스 |
|---|------|:------:|---------------|
| 1 | 벡터·행렬·좌표계의 기초 | 기초 | Szeliski 2nd ed. Ch.2 / 3Blue1Brown 선형대수 시리즈 |
| 2 | 행렬 분해 (고유분해·SVD)와 최소제곱 | 중급 | Hartley & Zisserman Appendix A4-A5 (SVD·최소제곱) |
| 3 | 사영기하와 동차좌표 (Homogeneous coordinates) | 중급 | Hartley & Zisserman Ch.2 (Projective Geometry 2D) |
| 4 | 강체 변환과 회전 표현 (SO(3)·SE(3)·쿼터니언) | 중급 | Corke RVC Ch.2 / Modern Robotics Ch.3 |
| 5 | 확률·추정·최적화 기초 (가우시안·Gauss-Newton) | 중급 | Probabilistic Robotics Ch.2-3 / Szeliski Appendix B |

## Part 1. 이미지 형성·카메라

3D 세계가 어떻게 2D 픽셀로 투영되는가 — 정보가 사라지는 지점.

| # | 주제 | 난이도 | 핵심 레퍼런스 |
|---|------|:------:|---------------|
| 6 | 이미지 형성과 핀홀 카메라 모델 | 기초 | Szeliski Ch.2.1 / Hartley & Zisserman Ch.6 |
| 7 | 카메라 내부·외부 파라미터와 투영행렬 | 중급 | Hartley & Zisserman Ch.6 (Camera Models) |
| 8 | 렌즈 왜곡과 카메라 캘리브레이션 | 중급 | Zhang 2000 캘리브레이션 논문 / OpenCV Calibration 문서 |
| 9 | 카메라 종류 (모노·스테레오·RGB-D·LiDAR·이벤트) | 기초 | Corke RVC Ch.13 / 각 센서 공식 문서 |

## Part 2. 특징·저수준 비전

이미지에서 무엇을 뽑아낼 것인가 — 매칭과 복원의 재료.

| # | 주제 | 난이도 | 핵심 레퍼런스 |
|---|------|:------:|---------------|
| 10 | 이미지 필터링과 컨볼루션 | 기초 | Szeliski Ch.3 (Image Processing) |
| 11 | 엣지·코너 검출 (Harris) | 중급 | Szeliski Ch.7.1 / Harris & Stephens 1988 |
| 12 | 특징점 기술자와 매칭 (SIFT·ORB) | 중급 | Lowe 2004 (SIFT) / Rublee 2011 (ORB) |

## Part 3. 3D 복원 수학·다중뷰·SLAM

사라진 3D를 여러 뷰로부터 되찾는다 — 로드맵의 심장.

| # | 주제 | 난이도 | 핵심 레퍼런스 |
|---|------|:------:|---------------|
| 13 | 에피폴라 기하 (Fundamental·Essential 행렬) | 심화 | Hartley & Zisserman Ch.9 (Epipolar Geometry) |
| 14 | 스테레오 정합과 깊이 추정 | 중급 | Szeliski Ch.12 (Stereo Correspondence) |
| 15 | 삼각측량·PnP·번들 조정 | 심화 | Hartley & Zisserman Ch.12 / Triggs 2000 (Bundle Adjustment) |
| 16 | Visual Odometry와 Visual SLAM | 심화 | Mur-Artal 2015 (ORB-SLAM) / Scaramuzza VO 튜토리얼 |

## Part 4. 딥러닝 비전

기하만으로 풀기 어려운 "이것이 무엇인가"에 답한다.

| # | 주제 | 난이도 | 핵심 레퍼런스 |
|---|------|:------:|---------------|
| 17 | CNN 기초와 이미지 분류 | 기초 | Stanford CS231n / Goodfellow Deep Learning Ch.9 |
| 18 | 객체 검출과 분할 (YOLO·DETR·Mask R-CNN) | 중급 | Redmon 2016 (YOLO) / Carion 2020 (DETR) |
| 19 | 깊이 추정·6D 자세 추정 | 심화 | Eigen 2014 (Depth) / PoseCNN 2018 |

## Part 5. Visual Servoing·로봇 통합

비전을 로봇의 움직임으로 잇는 종착점.

| # | 주제 | 난이도 | 핵심 레퍼런스 |
|---|------|:------:|---------------|
| 20 | Visual Servoing 기초 (IBVS·PBVS) | 심화 | Chaumette & Hutchinson 2006 (Visual Servo Control 튜토리얼) |
| 21 | 학습 기반 visuomotor policy | 심화 | Levine 2016 (End-to-End Visuomotor) / 최신 VLA 논문 |

---

각 주제의 상세 정리는 학습을 진행하며 별도 글로 채워 나갈 예정입니다.
