---
title: "robot_localization — EKF/UKF 센서 융합 패키지 분석"
published: 2026-07-22T16:10:00+09:00
description: "ROS robot_localization 패키지 분석 — EKF/UKF 상태 추정 이론, Mahalanobis 이상치 제거, navsat_transform GPS 통합, 센서 Config와 TF Tree, 소스 구조까지"
image: "/posts/robot-localization/cover.png"
tags: [robot_localization, EKF, UKF, TF, Sensor Fusion, ROS]
category: ROS
draft: false
lang: ko
---

## 📥 Package Information

**Repository**: [cra-ros-pkg/robot_localization](https://github.com/cra-ros-pkg/robot_localization)

<details>
<summary>파일 구성 (File Tree)</summary>

```bash
├── include/robot_localization/     # 헤더 파일 (12개)
│   ├── filter_common.h
│   ├── filter_base.h
│   ├── filter_utilities.h
│   ├── ekf.h
│   ├── ukf.h
│   ├── ros_filter.h
│   ├── ros_filter_types.h
│   ├── ros_filter_utilities.h
│   ├── navsat_transform.h
│   ├── navsat_conversions.h
│   ├── robot_localization_estimator.h
│   └── ros_robot_localization_listener.h
├── src/                             # 구현 파일 (16개)
│   ├── filter_utilities.cpp
│   ├── filter_base.cpp
│   ├── ekf.cpp
│   ├── ukf.cpp
│   ├── ros_filter_utilities.cpp
│   ├── ros_filter.cpp
│   ├── navsat_transform.cpp
│   ├── robot_localization_estimator.cpp
│   ├── ros_robot_localization_listener.cpp
│   ├── ekf_localization_node.cpp
│   ├── ukf_localization_node.cpp
│   ├── navsat_transform_node.cpp
│   ├── robot_localization_listener_node.cpp
│   ├── ekf_localization_nodelet.cpp
│   ├── ukf_localization_nodelet.cpp
│   └── navsat_transform_nodelet.cpp
├── launch/                          # Launch 파일
├── params/                          # YAML 설정 파일
├── srv/                             # ROS 서비스 정의
├── test/                            # 테스트 코드
├── doc/                             # 문서
├── CMakeLists.txt                   # 빌드 설정
├── package.xml                      # 패키지 메타데이터
└── nodelet_plugins.xml              # Nodelet 플러그인 정의
```

</details>

## 📏 Background

### 1️⃣ EKF : Extended Kalman Filter

> 비선형 시스템에서도 Kalman Filter를 적용하기 위해 선형화를 사용하는 기법

**EKF 개념**

- 비선형 시스템의 상태를 추정하기 위해 **선형화**를 사용한다.
- 예측(Prediction)과 갱신(Update) 단계에서 Jacobian Matrix를 이용해 비선형 함수를 1차 근사한다.
- 선형화 과정에서 정확도가 낮아질 수 있다. → 강한 비선형 시스템에서는 성능이 저하된다.

<details>
<summary>Prediction</summary>

$$
\begin{gathered}
x_k^-=f(x_{k-1},u_k)+w_k \\
P_k^-=F_kP_{k-1}F^T_k+Q_k
\end{gathered}
$$

- $x_k^-$ : 예측된 상태 벡터
- $P_k^-$ : 예측된 공분산 행렬
- $F_k$ : 시스템의 비선형 모델을 선형 근사화한 Jacobian 행렬
- $Q_k$ : 시스템 Noise
- 이전 상태와 로봇의 Motion Model을 사용하여 현재 상태를 예측한다.
- State와 Covariance를 예측한다.

</details>

<details>
<summary>Update</summary>

$$
\begin{gathered}
K_k=P_k^-H_k^T(H_kP_k^-H_k^T+R_k)^{-1} \\
x_k=x_k^-+K_k(z_k-h(x_k^-)) \\
P_k=(I-K_kH_k)P_k^-
\end{gathered}
$$

- $H_k$ : 측정 모델의 Jacobian
- $K_k$ : Kalman Gain, 센서와 예측값을 혼합하는 가중치
- $z_k$ : 센서 측정값
- $R_k$ : 센서 Noise
- 센서의 측정값과 예측된 상태를 비교하여 오차를 보정한다.
- Sensor Model을 사용하여 측정값을 반영한다.

</details>

### 2️⃣ UKF : Unscented Kalman Filter

> EKF의 한계를 보완하기 위해 선형화하지 않고 비선형 시스템을 직접 처리하는 기법

![UKF 시그마 포인트와 Unscented Transform](/posts/robot-localization/ukf-sigma-points.jpeg)

- UKF가 비선형 함수 출력의 Gaussian 분포를 추정하는 방법이다. 타원은 Gaussian 분포를 의미하며, 점들은 UT에 의해 선택된 Sigma Point들이다.
- 이 Sigma Point들을 비선형 함수의 입력으로 사용한다. 비선형 함수이기에 기존의 Sigma Point들이 깨지고 새로운 형태로 Point가 분포하게 된다.
- UT는 이렇게 새로 분포된 Point들의 새로운 Mean, Covariance 값을 계산하여 새로운 Gaussian 분포를 생성한다.

**UKF 개념**

- 비선형 함수의 선형 근사 대신 **시그마 포인트(Sigma Points)** 라는 샘플링 기법을 사용하여 확률 분포를 보존한다.
- 시그마 포인트를 통해 상태를 예측하고, 이를 기반으로 효율적인 상태 추정을 수행한다.
- EKF보다 강한 비선형 시스템에서도 더 나은 성능을 보이는 경향이 있다.

<details>
<summary>Sigma Point 생성</summary>

$$
\chi_k=[\hat x_k,\hat x_k \pm \gamma \sqrt{P_k}]
$$

- Sigma Point $\chi_k$ 를 생성하여 상태 공간을 샘플링한다.
- $\gamma$ : 가중치 계수
- $\sqrt{P_k}$ : 상태 공분산 행렬의 제곱근 (Cholesky Factorization)

</details>

<details>
<summary>Prediction</summary>

Sigma Point를 비선형 함수에 적용:

$$
\chi'_{k|k-1}=f(\chi_k,u_k)
$$

상태 예측:

$$
\hat x_{k|k-1}=\sum W_m \chi'_{k|k-1}
$$

공분산 예측:

$$
P_{k|k-1}=\sum W_c(\chi'_{k|k-1}-\hat x_{k|k-1})(\chi'_{k|k-1}-\hat x_{k|k-1})^T+Q_k
$$

</details>

<details>
<summary>Update</summary>

측정값 변환:

$$
Z_k=h(\chi'_{k|k-1})
$$

측정값 평균 및 공분산:

$$
\begin{gathered}
\hat z_k =\sum W_m Z_k \\
P_{z_k}=\sum W_c(Z_k-\hat z_k)(Z_k-\hat z_k)^T+R_k
\end{gathered}
$$

Kalman 이득 계산 및 상태 업데이트:

$$
\begin{gathered}
K_k=P_{xz_k}P^{-1}_{z_k} \\
\hat x_{k|k}=\hat x_{k|k-1}+K_k(z_k-\hat z_k)
\end{gathered}
$$

</details>

**Sigma Point 생성 Parameter**

> [!WARNING]
> `robot_localization`에서는 웬만하면 해당 파라미터 변경을 권장하지 않는다. alpha·kappa는 시그마 포인트의 spread를, beta는 상태 벡터의 분포를 조절한다. UKF에 익숙하지 않다면 기본값을 두는 것이 좋다.

$$
\begin{gathered}
\chi_k=\left[ x_k,x_k\pm \gamma \sqrt{P_k} \right] \\
\gamma = \sqrt{n+\lambda},\quad \lambda=\alpha^2(n+\kappa)-n
\end{gathered}
$$

- $\alpha,\beta,\kappa$ 세 가지 파라미터를 통해 Sigma Point를 생성한다.
- UKF가 EKF와 다른 점은 이 Sigma Point를 통해 비선형 시스템을 직접 시뮬레이션하여 근사 없이 예측한다는 점이다.

1. **Alpha** — Sigma Points가 중심(평균값)으로부터 얼마나 멀리 퍼질지 조절. 작으면 평균 근처 집중(보수적), 크면 넓게 퍼짐(강한 비선형에 유리). 보통 $0.001 \le \alpha \le 1$, `robot_localization`은 **0.001** 로 설정.
2. **Kappa** — 추가 시그마 포인트 배치 계수. 보통 $\kappa = 0$ 또는 $\kappa = 3 - n$($n$은 상태 변수 개수). `robot_localization`은 **0** 으로 설정.
3. **Beta** — 상태 벡터가 가우시안 분포를 얼마나 잘 따르는지 반영. $\beta = 2$ 이면 완벽한 가우시안을 가정하여 최적화. `robot_localization`은 **2** 로 설정.

### 3️⃣ Mahalanobis

> 다변량 데이터에서 데이터 간 거리를 측정하는 방법

$$
D_M(x,\mu,S)=\sqrt{(x-\mu)^TS^{-1}(x-\mu)}
$$

- $D_M(x,\mu,S)$ : Mahalanobis 거리
- $x$ : 측정된 데이터 벡터(센서 측정값)
- $\mu$ : 예상되는 평균 벡터(UKF가 예측한 상태값)
- $S$ : 공분산 행렬(측정값의 Noise) — 역행렬은 신뢰도를 의미
- Euclidean Distance와 다르게 Covariance를 고려하여 거리를 계산한다. → 센서 Noise와 Correlation을 반영할 수 있어 Outlier 검출에 유용하다.

활용:

1. **Sensor Fusion Outlier 제거** — GPS가 순간적으로 튀거나 LiDAR 노이즈가 심한 경우 감지·제거
2. **Sensor Data Weight 조정** — 거리가 크면 신뢰하지 않음(가중치↓), 작으면 신뢰(가중치↑)
3. **Invalid 측정값 Filtering** — Update 단계에서 거리를 계산해 특정 센서 데이터 무시 여부 결정

## 🔍 Package Analysis

### 🔀 전체 흐름

![robot_localization 전체 워크플로우](/posts/robot-localization/navsat-workflow.png)

- node 2개 → `estimation_node`, `navsat_transform_node`

### 🔎 Wiki

**`robot_localization`**

> 3D 공간에서 움직이는 로봇을 위한 Non-Linear State Estimation. 2개의 State Estimation(EKF, UKF)이 포함되어 있으며, GPS 데이터 통합을 지원하는 `navsat_transform`도 제공한다.

- 임의의 수의 센서를 융합한다. 여러 개의 IMU 혹은 Odometry 정보를 융합할 수 있다.
- 다양한 ROS 메시지 타입 지원: `nav_msgs/Odometry`, `sensor_msgs/Imu`, `geometry_msgs/PoseWithCovarianceStamped`, `geometry_msgs/TwistWithCovarianceStamped` (커스터마이징 가능).
- Continuous Estimation. 센서 데이터를 수신하는 즉시 상태 추정을 시작하며, 센서가 없을 경우 내부 Motion Model로 계속 추정한다.

**State Estimation Node** — EKF, UKF로 나뉜다.

- **EKF** : Extended Kalman Filter로 시간을 앞당겨 상태를 예측하고, 센서 데이터로 예측치를 수정한다.
- **UKF** : Sigma Point 세트로 EKF와 동일한 모션 모델을 통해 상태를 투영한 뒤, 투영된 Sigma Point로 상태 추정치·공분산을 복구한다. **Jacobian이 필요 없어** 더 안정적이지만 계산 비용이 EKF보다 크다.

**`navsat_transform` Node** — NAVSAT을 관리하는 노드

- 입력 : `nav_msgs/Odometry`(from EKF/UKF), `sensor_msgs/Imu`, `sensor_msgs/NavSatFix`
- 출력 : 로봇의 World Frame과 일치하는 좌표로 Odometry를 생성

> [!WARNING]
> 이 Node의 출력을 `robot_localization`에서 융합할 경우, `odomN_differential`이 **False**인지 확인!

**Prepare Data** — `robot_localization`에 사용될 데이터 준비

- **IMU** — Wiki 기준으로 **ENU** 프레임을 가정!

<details>
<summary>ENU(East North Up) & NED(North East Down)</summary>

**ENU**

![ENU 좌표계](/posts/robot-localization/enu.png)

**NED**

![NED 좌표계](/posts/robot-localization/ned.png)

</details>

- ROS 표준 규격(REP-103)을 따른다. Yaw 반시계 방향 회전 양수, X 방향 전진 양수, Z 중력 가속도 $+9.81\,m/s^2$.
- 특정 변수 무시를 위해 **공분산을 매우 큰 값으로 설정하는 것은 성능 저하**를 유발한다. → `imu0_config`에서 `[false, false, false, true, true, true, ...]`로 설정.

  | 센서 배치 | 예상 가속도 값 (m/s²) |
  |------|------|
  | 기본 자세 (수평) | Z = +9.81 |
  | 왼쪽이 위 (+90° Roll) | Y = +9.81 |
  | 앞쪽이 아래 (+90° Pitch) | X = -9.81 |

- **Odometry** — Velocity와 Pose를 융합. 가능하면 Linear Velocity, Orientation 데이터를 쓰는 것이 가장 안정적. Z값을 안 써서 Covariance를 크게 주는 경우(예: `robot_pose_ekf`)가 `robot_localization`에서는 **오히려 성능 저하**를 유발할 수 있다. REP-103을 따른다. `world_frame = odom_frame`인 경우 `odom_frame → base_link_frame` TF가 Broadcast된다.

**Configuring** — Sensor 데이터 Configure 방법

1. **Sensor Config** — 센서마다 제공 데이터가 달라 사용할 변수를 설정 벡터로 지정한다.

   ```bash
   "twist0_config" [false, false, false,   # X,    Y,    Z
                    false, false, false,   # roll, pitch, yaw
                    true,  false, false,   # dX,   dY,   dZ
                    false, false, false,   # droll, dpitch, dyaw
                    false, false, false]   # ddX,  ddY,  ddZ
   ```

2. **2D Mode** — `two_d_mode`를 True로 설정하면 3D를 2D로 변환 처리한다. Roll, Pitch, Z축 관련 데이터가 모두 0.0으로 처리된다.

3. **Multiple Sensor** — 다중 센서 처리 시 공분산이 비슷하면 어떤 데이터를 처리할지 모호해질 수 있다(Oscillation).

<details>
<summary>① 신뢰성 높은 센서에 낮은 공분산 부여</summary>

```bash
imu0: imu/data0
imu0_config: [false, false, false,
              true,  true,  true,
              false, false, false,
              false, false, false,
              false, false, false]
imu0_covariance: [0.01, 0, 0,  0, 0.01, 0,  0, 0, 0.01] # Low Cov -> High reliability

imu1: imu/data1
imu1_config: [false, false, false,
              true,  true,  true,
              false, false, false,
              false, false, false,
              false, false, false]
imu1_covariance: [0.1, 0, 0,  0, 0.1, 0,  0, 0, 0.1]   # High Cov -> Low reliability
```

⇒ 신뢰성이 높은 센서에 대한 선택이 필요

</details>

<details>
<summary>② differential 파라미터 이용</summary>

```bash
imu0: imu/data0
imu0_config: [false, false, false,
              true,  true,  true,
              false, false, false,
              false, false, false,
              false, false, false]
imu0_differential: false

imu1: imu/data1
imu1_config: [false, false, false,
              true,  true,  true,
              false, false, false,
              false, false, false,
              false, false, false]
imu1_differential: true
```

- `differential`을 False로 세팅하면 절대값으로 필터링, True면 데이터를 속도값으로 변환하여 필터링한다.
- 즉, 고정 센서(`differential` = False) 하나를 두고 나머지 센서를 변화량으로 융합·보정한다.
- IMU의 Yaw를 고정(False), Encoder의 Yaw를 속도로 변환(True)하여 함께 쓸 수도 있다.

⇒ 변화량으로 설정된 센서는 시간이 지날수록 누적 오차가 쌓일 수 있다.

</details>

**Integrating GPS** — GPS를 로봇 좌표계로 변환하기 위해 `navsat_transform_node`를 사용

![navsat_transform GPS 통합 워크플로우](/posts/robot-localization/navsat-workflow.png)

GPS 데이터는 **Jump할 수 있어 직접 네비게이션에 사용하지 않고 별도로 필터링**한다.

- `navsat_transform_node` : GPS 데이터를 로봇 좌표 프레임과 일치하게 변환. UTM 또는 ENU 좌표계로 변환하고, 로봇 초기 위치·방향 기준 상대 좌표로 변환.

<details>
<summary>직접 GPS 데이터를 Navigation에 사용하지 않는 이유</summary>

1. GPS는 위도(Latitude)·경도(Longitude) 기반이라 로봇 좌표계와 맞지 않는다.
2. GPS 데이터는 순간적으로 점프할 수 있어 좌표 정보가 불안정하다.

</details>

- **UTM 좌표계를 더 이상 사용하지 않는다.** 파라미터를 사용하면 자동으로 `broadcast_cartesian_transform`으로 변경된다.

<details>
<summary>UTM vs Cartesian</summary>

| 비교 항목 | UTM 변환 | Cartesian Transform |
|------|------|------|
| 좌표 기준 | UTM Zone (60개) | 로봇의 초기 위치 |
| Zone 문제 | Zone이 바뀌면 좌표 불연속성 발생 | Zone 개념 없이 연속 좌표 유지 |
| 지형 왜곡 | 투영 방식에 따라 왜곡 가능 | 지형과 무관 |
| 3D 좌표 지원 | 어렵고 비일관적 | X, Y, Z 모두 일관 변환 |
| 실내/실외 이동 | 실외(GPS 가능 지역)만 | 경계 넘어도 좌표 일관 |

- UTM : 지구를 60개 Zone으로 분할하여 Zone별로 다른 Transform 적용
- Cartesian : 로봇 초기 위치를 원점으로 좌표 변환 수행

</details>

**Mode**

1. **Default** — EKF 데이터를 활용해 GPS 변환 (GPS, IMU, Odometry(EKF) 필요). `wait_for_datum: false`
2. **수동 Datum 설정** — 좌표 원점을 특정 GPS 좌표로 고정

   ```bash
   navsat_transform:
     wait_for_datum: true   # Manual
     datum: [55.944904, -3.186693, 0.0, map, base_link]  # Latitude, Longitude
     publish_filtered_gps: true
   ```

3. **`set_datum` 동적 기준점** — 서비스로 위치 정보 설정

   ```bash
   rosservice call /set_datum "latitude: 55.944904
   longitude: -3.186693
   yaw: 0.0
   world_frame: 'map'
   base_link_frame: 'base_link'"
   ```

<details>
<summary>navsat_transform Main Option</summary>

| 옵션 | 설명 | 예제 값 |
|------|------|------|
| `magnetic_declination_radians` | 자기 편차(지자기 오차) 보정 값 | `0.0429351` |
| `yaw_offset` | IMU의 북쪽 기준을 동쪽 기준으로 변환 | `1.5707963` (π/2) |
| `zero_altitude` | GPS 고도(Altitude) 값을 0으로 설정 | `true` |
| `use_odometry_yaw` | IMU 대신 오도메트리에서 Yaw 사용 | `true` |
| `publish_filtered_gps` | 변환된 GPS를 `/gps/filtered`로 발행 | `true` |

</details>

### 🌲 TF Tree

- **EKF Local** : `world_frame = odom` → TF Output : `odom_frame → base_link_frame`
- **EKF Global** : `world_frame = map` → TF Output : `map_frame → odom_frame`
- **Filtering Pose 산출물** : `frame_id = world_frame`, `child_frame_id = base_link_frame_output`

## 📁 Code

### 📝 소스 파일 목록

**핵심 라이브러리 파일**

| 파일명 | 목적 | 주요 클래스/함수 |
|------|------|------|
| `filter_utilities.cpp` | 필터 유틸리티 함수 | clampRotation(), appendPrefix() |
| `filter_base.cpp` | 기본 필터 클래스 | FilterBase |
| `ekf.cpp` | 확장 칼만 필터 | Ekf |
| `ukf.cpp` | 무향 칼만 필터 | Ukf |
| `ros_filter_utilities.cpp` | ROS 유틸리티 | debugStream(), quatToRPY() |
| `ros_filter.cpp` | ROS 통합 레이어 | RosFilter\<T\> |
| `navsat_transform.cpp` | GPS 변환 | NavSatTransform |
| `robot_localization_estimator.cpp` | 상태 추정 히스토리 | RobotLocalizationEstimator |
| `ros_robot_localization_listener.cpp` | 측정치 리스너 | RosRobotLocalizationListener |

**실행 노드 파일**

| 파일명 | 노드명 | 기능 |
|------|------|------|
| `ekf_localization_node.cpp` | ekf_localization_node | EKF 기반 로컬라이제이션 |
| `ukf_localization_node.cpp` | ukf_localization_node | UKF 기반 로컬라이제이션 |
| `navsat_transform_node.cpp` | navsat_transform_node | GPS → 로컬 좌표 변환 |
| `robot_localization_listener_node.cpp` | robot_localization_listener_node | 필터 히스토리 추적 |

**Nodelet**

| 파일명 | Nodelet 클래스 |
|------|------|
| `ekf_localization_nodelet.cpp` | robot_localization/EkfNodelet |
| `ukf_localization_nodelet.cpp` | robot_localization/UkfNodelet |
| `navsat_transform_nodelet.cpp` | robot_localization/NavSatTransformNodelet |

### 🏨 Class Architecture

<!-- IMAGE_PENDING: class-architecture (robot_localization_histogram.jpg) -->

<details>
<summary>State Vector (15차원)</summary>

| 인덱스 | 상태 변수 | 기호 | 설명 |
|------|------|------|------|
| 0 | StateMemberX | X | X 위치 (m) |
| 1 | StateMemberY | Y | Y 위치 (m) |
| 2 | StateMemberZ | Z | Z 위치 (m) |
| 3 | StateMemberRoll | Roll | 롤 각도 (rad) |
| 4 | StateMemberPitch | Pitch | 피치 각도 (rad) |
| 5 | StateMemberYaw | Yaw | 요 각도 (rad) |
| 6 | StateMemberVx | Vx | X 선속도 (m/s) |
| 7 | StateMemberVy | Vy | Y 선속도 (m/s) |
| 8 | StateMemberVz | Vz | Z 선속도 (m/s) |
| 9 | StateMemberVroll | Vroll | 롤 각속도 (rad/s) |
| 10 | StateMemberVpitch | Vpitch | 피치 각속도 (rad/s) |
| 11 | StateMemberVyaw | Vyaw | 요 각속도 (rad/s) |
| 12 | StateMemberAx | Ax | X 선가속도 (m/s²) |
| 13 | StateMemberAy | Ay | Y 선가속도 (m/s²) |
| 14 | StateMemberAz | Az | Z 선가속도 (m/s²) |

</details>

<details>
<summary>Control Vector (6차원)</summary>

| 인덱스 | 제어 변수 | 설명 |
|------|------|------|
| 0 | ControlMemberVx | 명령 X 선속도 |
| 1 | ControlMemberVy | 명령 Y 선속도 |
| 2 | ControlMemberVz | 명령 Z 선속도 |
| 3 | ControlMemberVroll | 명령 롤 각속도 |
| 4 | ControlMemberVpitch | 명령 피치 각속도 |
| 5 | ControlMemberVyaw | 명령 요 각속도 |

</details>

### 🏗️ Data Structure

```cpp
struct Measurement {
    ros::Time time_;                    // 타임스탬프
    Eigen::VectorXd measurement_;       // 측정 벡터
    Eigen::MatrixXd covariance_;        // 측정 공분산
    std::vector<int> updateVector_;     // 업데이트할 상태 인덱스
    double mahalanobisThresh_;          // 이상치 검출 임계값
    std::string topicName_;             // 소스 토픽명
};

struct FilterState {
    Eigen::VectorXd state_;                    // 현재 상태 추정치
    Eigen::MatrixXd estimateErrorCovariance_;  // 공분산 행렬
    ros::Time lastMeasurementTime_;            // 마지막 측정 시간
    Eigen::VectorXd latestControl_;            // 최근 제어 입력
};

struct CallbackData {
    std::string topicName_;          // 토픽명
    std::vector<int> updateVector_;  // 업데이트 마스크
    bool differential_;              // 차분 모드 플래그
    bool relative_;                  // 상대 측정 플래그
    double rejectionThreshold_;      // 마할라노비스 거리 임계값
};
```

### 💻 Filter Algorithm

**EKF (Extended Kalman Filter)**

```markdown
[Predict]
1. 상태 전이 함수 적용:
   x̂ₖ|ₖ₋₁ = f(x̂ₖ₋₁|ₖ₋₁, uₖ₋₁)
2. 야코비안 계산:
   Fₖ = ∂f/∂x |x̂ₖ₋₁|ₖ₋₁
3. 공분산 예측:
   Pₖ|ₖ₋₁ = Fₖ Pₖ₋₁|ₖ₋₁ Fₖᵀ + Qₖ

[Correct]
1. 칼만 이득 계산:
   Kₖ = Pₖ|ₖ₋₁ Hₖᵀ (Hₖ Pₖ|ₖ₋₁ Hₖᵀ + Rₖ)⁻¹
2. 상태 업데이트:
   x̂ₖ|ₖ = x̂ₖ|ₖ₋₁ + Kₖ (zₖ - Hₖ x̂ₖ|ₖ₋₁)
3. 공분산 업데이트:
   Pₖ|ₖ = (I - Kₖ Hₖ) Pₖ|ₖ₋₁
```

**UKF (Unscented Kalman Filter)**

```markdown
[Sigma Point]
λ = α² (n + κ) - n
χ₀ = x̂
χᵢ   = x̂ + (√((n + λ)P))ᵢ    (i = 1, ..., n)
χᵢ₊ₙ = x̂ - (√((n + λ)P))ᵢ    (i = 1, ..., n)

가중치:
Wₘ⁰ = λ / (n + λ)
Wc⁰ = λ / (n + λ) + (1 - α² + β)
Wᵢ  = 1 / (2(n + λ))          (i = 1, ..., 2n)

[Predict]
1. 시그마 포인트 전파:  χₖ|ₖ₋₁ = f(χₖ₋₁)
2. 예측 평균:          x̂ₖ|ₖ₋₁ = Σᵢ Wₘⁱ χₖ|ₖ₋₁ⁱ
3. 예측 공분산:        Pₖ|ₖ₋₁ = Σᵢ Wcⁱ (χⁱ - x̂)(χⁱ - x̂)ᵀ + Q

[Correct]
1. 측정 시그마 포인트:  Zₖ|ₖ₋₁ = h(χₖ|ₖ₋₁)
2. 예측 측정:          ẑₖ = Σᵢ Wₘⁱ Zₖ|ₖ₋₁ⁱ
3. 혁신 공분산:        Pzz = Σᵢ Wcⁱ (Zⁱ - ẑ)(Zⁱ - ẑ)ᵀ + R
4. 교차 공분산:        Pxz = Σᵢ Wcⁱ (χⁱ - x̂)(Zⁱ - ẑ)ᵀ
5. 칼만 이득 & 업데이트:
   K = Pxz Pzz⁻¹
   x̂ₖ|ₖ = x̂ₖ|ₖ₋₁ + K(zₖ - ẑₖ)
   Pₖ|ₖ = Pₖ|ₖ₋₁ - K Pzz Kᵀ
```

## 🔗 References

- [cra-ros-pkg/robot_localization (GitHub)](https://github.com/cra-ros-pkg/robot_localization)
- [robot_localization 공식 문서](https://docs.ros.org/en/melodic/api/robot_localization/html/index.html)
