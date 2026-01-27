# 에디터 타입 에러 해결 가이드

에디터(VS Code, WebStorm 등)에서 표시되는 TypeScript 에러를 해결하는 방법입니다.

---

## 🔍 발견된 문제

### 1. ✅ 수정 완료: BreakerStats 타입 에러

**문제:**
```
apps/api-gateway/src/app.controller.ts(27,3): error TS4053:
Return type of public method from exported class has or is using name 'BreakerStats'
from external module but cannot be named.
```

**원인:**
- `BreakerStats` 인터페이스가 export되지 않음

**해결:**
```typescript
// apps/api-gateway/src/common/circuit-breaker.service.ts
// Before
interface BreakerStats { ... }

// After
export interface BreakerStats { ... }
```

**상태:** ✅ 수정 완료 - 빌드 성공 확인

---

### 2. ⚠️ OpenTelemetry Import 에러 (에디터 문제)

**증상:**
- 에디터에서 `@opentelemetry/*` import에 빨간 줄 표시
- 하지만 **빌드는 성공** (`pnpm build` 정상 작동)

**원인:**
OpenTelemetry 패키지 버전 불일치로 인한 타입 정의 충돌:

```
@opentelemetry/api: 1.9.0
@opentelemetry/sdk-node: 0.53.0        ← 구버전 (0.x)
@opentelemetry/sdk-trace-node: 1.30.1  ← 신버전 (1.x)
@opentelemetry/resources: 1.30.1       ← 신버전 (1.x)
@opentelemetry/semantic-conventions: 1.39.0
```

**빌드가 성공하는 이유:**
- `tsconfig.json`의 `"skipLibCheck": true` 설정
- 이 옵션은 node_modules의 타입 체크를 건너뜀

---

## 🛠️ 해결 방법

### 방법 1: 에디터 캐시 클리어 (추천 - 가장 빠름)

#### VS Code
```bash
# 1. VS Code 명령 팔레트 열기 (Ctrl+Shift+P / Cmd+Shift+P)
# 2. "TypeScript: Restart TS Server" 실행

# 또는 터미널에서
rm -rf .vscode/
rm -f tsconfig.tsbuildinfo
rm -f dist/tsconfig.tsbuildinfo
```

#### WebStorm / IntelliJ IDEA
```
File > Invalidate Caches > Invalidate and Restart
```

---

### 방법 2: TypeScript 빌드 캐시 삭제

```bash
# TypeScript 빌드 캐시 삭제
rm -f tsconfig.tsbuildinfo
rm -f dist/tsconfig.tsbuildinfo

# node_modules 타입 캐시 삭제
find node_modules -name "*.tsbuildinfo" -delete

# 에디터 재시작
```

---

### 방법 3: node_modules 재설치 (더 깔끔한 방법)

```bash
# node_modules 완전 삭제
rm -rf node_modules

# 패키지 재설치
pnpm install

# 에디터 재시작
```

---

### 방법 4: OpenTelemetry 패키지 버전 통일 (근본적 해결)

**현재 상태:**
```json
{
  "@opentelemetry/sdk-node": "^0.53.0",        // 0.x
  "@opentelemetry/sdk-trace-node": "^1.26.0",  // 1.x
  "@opentelemetry/resources": "^1.26.0"        // 1.x
}
```

**옵션 A: 모두 1.x로 업그레이드 (추천)**
```bash
# package.json 수정
pnpm add @opentelemetry/sdk-node@latest

# 재설치
pnpm install
```

**옵션 B: 모두 0.53.x로 다운그레이드**
```bash
# package.json에서 버전 수정 후
pnpm install
```

---

## 📝 현재 프로젝트 상태

### ✅ 정상 작동하는 항목
1. **빌드**: `pnpm build` - 성공 ✅
2. **런타임**: 모든 서비스 정상 실행 ✅
3. **TracingModule**: 초기화 성공 ✅
4. **Jaeger 연결**: 정상 작동 ✅

### ⚠️ 에디터에만 영향
- TypeScript 에러 표시 (빨간 줄)
- 실제 코드 실행에는 영향 없음
- `skipLibCheck: true` 덕분에 빌드 성공

---

## 🎯 권장 조치

### 개발 중 (지금)
```bash
# 에디터 캐시만 클리어 (30초 소요)
# VS Code: Ctrl+Shift+P > "TypeScript: Restart TS Server"
# WebStorm: File > Invalidate Caches > Restart
```

### 시간 여유 있을 때
```bash
# node_modules 재설치 (2분 소요)
rm -rf node_modules
pnpm install
```

### 완벽하게 해결하려면
```bash
# OpenTelemetry 패키지 버전 통일
# package.json 수정 후
pnpm install
pnpm build
```

---

## 🔍 다른 잠재적 에러 체크

### 전체 프로젝트 타입 체크
```bash
# 실제 TypeScript 에러 확인
npx tsc --noEmit

# 결과: 에러 없음 ✅
```

### 빌드 테스트
```bash
# 전체 빌드
pnpm build

# 결과: webpack compiled successfully ✅
```

### 외부 패키지 import 사용처
```
총 7개 파일에서 @opentelemetry 또는 opossum import 사용
- libs/common/src/tracing/tracing.service.ts (6개 import)
- apps/api-gateway/src/common/circuit-breaker.service.ts (1개 import)

모두 정상 작동 ✅
```

---

## ⚙️ tsconfig.json 설정 확인

### 현재 설정
```json
{
  "compilerOptions": {
    "strict": true,
    "exactOptionalPropertyTypes": true,  // ← 매우 엄격
    "skipLibCheck": true,                // ← node_modules 타입 체크 스킵
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

### 설정 설명
- **`skipLibCheck: true`**: node_modules의 타입 에러를 무시 (빌드 성공 이유)
- **`exactOptionalPropertyTypes: true`**: 매우 엄격한 옵셔널 속성 체크
  - OpenTelemetry 타입 충돌의 주요 원인
  - 하지만 skipLibCheck 덕분에 빌드는 성공

---

## 🚨 에러가 계속되는 경우

### 1. 에디터 설정 확인

**VS Code (`settings.json`):**
```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### 2. 프로젝트 TypeScript 버전 확인
```bash
pnpm list typescript

# 결과: typescript@5.7.2 ✅
```

### 3. 에디터가 올바른 tsconfig 사용하는지 확인

**VS Code:**
- 하단 상태바에서 "TypeScript 5.7.2" 확인
- 클릭하여 "Use Workspace Version" 선택

---

## 📊 요약

| 항목 | 상태 | 조치 |
|------|------|------|
| **BreakerStats 타입 에러** | ✅ 해결됨 | export 추가 완료 |
| **OpenTelemetry import 에러** | ⚠️ 에디터 문제 | 캐시 클리어 권장 |
| **빌드** | ✅ 정상 | webpack compiled successfully |
| **런타임** | ✅ 정상 | 모든 서비스 작동 |
| **타입 체크** | ✅ 통과 | `npx tsc --noEmit` 에러 없음 |

---

## ✅ 결론

**현재 상황:**
- ✅ 실제 코드: 완벽히 정상 작동
- ⚠️ 에디터 표시: 타입 에러 표시 (무시 가능)

**권장 조치:**
1. 에디터 재시작 또는 TypeScript 서버 재시작
2. 계속 표시되면 node_modules 재설치
3. 완벽히 해결하려면 OpenTelemetry 패키지 버전 통일

**중요:**
- 에디터 에러는 개발 경험에만 영향
- 실제 빌드, 실행, 배포에는 영향 없음
- `skipLibCheck: true` 설정으로 보호됨

---

**작성일**: 2026-01-27
**작성자**: Claude (Sonnet 4.5)
