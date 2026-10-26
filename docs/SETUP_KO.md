# DentiFront 초기 개발 환경 구성

## 1. 로컬 실행

Node.js 22 및 npm 사용을 전제로 합니다. `nvm` 설치 시 `.nvmrc`가 자동으로 버전을 안내합니다.

```bash
nvm install 22
nvm use
npm ci --legacy-peer-deps
NODE_OPTIONS=--openssl-legacy-provider npm run build
npm run serve
```

> `npm run serve`는 기존 스크립트에서 ESLint `--fix`를 실행하므로 소스가 자동 수정될 수 있습니다. 검사만 할 때는 `npm run lint:check`를 사용하세요.

## 2. 전달된 Git bundle을 원격 저장소로 반영

새 저장소 `codon62/dentiFront`에 아직 커밋이 없는 경우, 함께 제공된 `dentiFront-initial-baseline.bundle`을 사용해 원본 파일 767개와 초기 환경 설정을 **하나의 Git 커밋**으로 올릴 수 있습니다.

```bash
# bundle 파일이 있는 디렉터리에서 실행
git clone ./dentiFront-initial-baseline.bundle dentiFront
cd dentiFront

git remote rename origin imported-bundle
git remote add origin git@github.com:codon62/dentiFront.git

git push -u origin main
git push origin frontend-initial-baseline-20261026
```

HTTPS 인증을 사용한다면 `git remote add origin https://github.com/codon62/dentiFront.git`을 사용하세요.

## 3. GitHub Actions 검증

GitHub Actions의 **Frontend Baseline CI** 워크플로가 `main`에 실행되면 npm 의존성 설치와 Webpack 프로덕션 빌드를 검증합니다. GREEN이 확인되기 전까지 **VERIFIED**로 간주하지 마세요.

## 4. Backend 연동

REST API 설정은 현재 `src/apis/Api.js`에 과거 서비스 URL로 하드코딩되어 있습니다. `denti-i` 백엔드의 Identity / Access 및 Student Management API와 연동하기 전에 계약 비교와 환경 분리가 필요합니다.

## 5. 보안 주의

원본 압축파일에서 Slack Webhook URL 두 개가 발견되어 전달본에서는 제거했습니다. 실제 운영 중인 URL이었다면 Slack에서 회전/폐기하는 것이 바람직합니다. 웹 브라우저 코드나 `VUE_APP_*` 환경변수에 Webhook 비밀값을 넣지 마세요.
