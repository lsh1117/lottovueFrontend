# 번호 생성 시 발생하는 오류 분석

## 발생한 오류들

### 1. CORS 오류
```
Access to XMLHttpRequest at 'http://localhost:8030/api/recommendations/' 
from origin 'http://localhost:5174' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**원인:**
- 프론트엔드(`http://localhost:5174`)에서 백엔드(`http://localhost:8030`)로 요청 시 브라우저의 CORS 정책에 의해 차단됨
- 백엔드 서버가 실행되지 않았거나, CORS 미들웨어가 제대로 작동하지 않을 수 있음

**해결 방법:**
1. 백엔드 서버가 실행 중인지 확인
   ```bash
   # 백엔드 디렉토리에서
   cd C:\dev\workspace\lottovue\backend\lottovue-backend
   # 서버 실행 확인 (포트 8030)
   ```

2. 백엔드 `main.py`의 CORS 설정 확인
   - `http://localhost:5174`가 `allowed_origins`에 포함되어 있는지 확인 (이미 포함됨)
   - 백엔드 서버 재시작

3. 네트워크 연결 확인
   - 백엔드 서버가 `http://localhost:8030`에서 실행 중인지 확인
   - 방화벽이나 보안 소프트웨어가 차단하지 않는지 확인

### 2. 네트워크 오류
```
API 네트워크 오류: {
  url: '/recommendations/', 
  method: 'post', 
  baseURL: 'http://localhost:8030/api/', 
  message: '서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.'
}
```

**원인:**
- CORS 오류로 인해 실제로는 서버에 연결할 수 없음
- 또는 백엔드 서버가 실행되지 않음

**해결 방법:**
1. 백엔드 서버 실행 확인
2. 백엔드 서버 로그 확인하여 오류 메시지 확인

### 3. 500 Internal Server Error
```
POST http://localhost:8030/api/recommendations/ net::ERR_FAILED 500 (Internal Server Error)
```

**원인:**
- 서버에 연결은 되었지만 서버 내부 오류 발생
- 가능한 원인들:
  1. **인증 토큰 문제**: `get_current_user` 의존성 실패 (토큰이 없거나 유효하지 않음)
  2. **데이터베이스 연결 문제**: DB 연결 실패 또는 쿼리 오류
  3. **스키마 검증 실패**: 요청 데이터 형식이 맞지 않음
  4. **중복 저장 시도**: 같은 회차에 이미 추천번호가 있음 (ValueError → 400 Bad Request로 변환되어야 함)

**해결 방법:**
1. **인증 확인**
   - 사용자가 로그인되어 있는지 확인
   - JWT 토큰이 유효한지 확인
   - `base.js`의 인터셉터에서 토큰이 헤더에 제대로 추가되는지 확인

2. **백엔드 로그 확인**
   - 백엔드 서버 콘솔에서 상세한 오류 메시지 확인
   - 스택 트레이스를 통해 정확한 오류 위치 파악

3. **요청 데이터 확인**
   - `RecommendPopup.vue`의 `saveToHistory` 함수에서 전송하는 데이터 형식 확인
   - `recommendationData` 객체가 올바른 형식인지 확인:
     ```javascript
     {
       drw_no: number,  // 회차 번호
       no1: number,     // 번호 1
       no2: number,     // 번호 2
       no3: number,     // 번호 3
       no4: number,     // 번호 4
       no5: number,     // 번호 5
       no6: number      // 번호 6
     }
     ```

4. **데이터베이스 확인**
   - 데이터베이스 연결 상태 확인
   - `user_recommendations` 테이블이 존재하는지 확인
   - 같은 회차에 이미 추천번호가 있는지 확인

## 디버깅 단계

### 1단계: 백엔드 서버 상태 확인
```bash
# 백엔드 디렉토리로 이동
cd C:\dev\workspace\lottovue\backend\lottovue-backend

# 서버 실행 (이미 실행 중이면 재시작)
# uvicorn main:app --reload --host 0.0.0.0 --port 8030
```

### 2단계: 프론트엔드에서 네트워크 요청 확인
1. 브라우저 개발자 도구 열기 (F12)
2. Network 탭에서 `/recommendations/` 요청 확인
3. Request Headers 확인:
   - `Authorization: Bearer <token>` 헤더가 있는지 확인
   - `Content-Type: application/json` 확인
4. Request Payload 확인:
   - 데이터 형식이 올바른지 확인
5. Response 확인:
   - 상태 코드 (500, 401, 400 등)
   - 응답 본문의 오류 메시지

### 3단계: 백엔드 로그 확인
- 백엔드 서버 콘솔에서 오류 메시지 확인
- 스택 트레이스를 통해 정확한 오류 위치 파악

### 4단계: 인증 확인
```javascript
// 브라우저 콘솔에서 실행
const token = sessionStorage.getItem('lottovue_access_token');
console.log('토큰 존재:', !!token);
console.log('토큰:', token);
```

## 예상되는 해결 방법

가장 가능성 높은 원인은 **인증 토큰 문제**입니다.

1. 사용자가 로그인되어 있지 않거나
2. 토큰이 만료되었거나
3. 토큰이 헤더에 제대로 추가되지 않았을 수 있습니다.

**임시 해결책 (개발 환경):**
- 백엔드에서 인증을 임시로 비활성화하거나
- 로그인 후 다시 시도

**정식 해결책:**
- 사용자 로그인 상태 확인
- 토큰 갱신 로직 구현
- 인증 오류 시 로그인 페이지로 리다이렉트

