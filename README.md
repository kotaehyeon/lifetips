# Landing Deployment Setup

이 프로젝트는 `landing/` 폴더를 Netlify에 배포하도록 준비되어 있습니다.

## 현재 설정된 흐름

1. 로컬에서 `landing/`을 수정합니다.
2. GitHub `main` 브랜치로 push 합니다.
3. GitHub Actions가 랜딩 테스트를 실행합니다.
4. `NETLIFY_AUTH_TOKEN`과 `NETLIFY_SITE_ID`가 설정되어 있으면 Netlify에 자동 배포합니다.

`netlify.toml`의 publish 디렉터리는 이미 `landing`으로 맞춰져 있습니다.

## 로컬 실행

```bash
npm run dev:landing
```

브라우저에서 `http://127.0.0.1:3000`으로 확인할 수 있습니다.

## 테스트

```bash
npm run test:landing
```

## GitHub 저장소 연결

아직 이 폴더는 GitHub 원격 저장소가 연결되지 않은 상태일 수 있습니다.

```bash
git init -b main
git add .
git commit -m "Initial landing setup"
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

이미 Git 저장소라면 `git init -b main`은 생략하고 `git remote add origin ...`부터 진행하면 됩니다.

## Netlify 자동 배포 연결

### 방법 1. 현재 구성 그대로 GitHub Actions에서 Netlify로 배포

1. Netlify에서 새 사이트를 하나 생성합니다.
2. Site configuration > General > Site details 에서 `Site ID`를 확인합니다.
3. Netlify User settings > Applications > Personal access tokens 에서 토큰을 생성합니다.
4. GitHub 저장소의 `Settings > Secrets and variables > Actions`에 아래 두 개를 추가합니다.
   - `NETLIFY_AUTH_TOKEN`
   - `NETLIFY_SITE_ID`

이후 `main` 브랜치로 push 하면 자동 배포됩니다.

### 방법 2. Netlify에서 GitHub 저장소를 직접 연결

1. Netlify에서 `Add new project`를 선택합니다.
2. GitHub 저장소를 연결합니다.
3. Publish directory를 `landing`으로 지정합니다.

이 경우에도 현재 `netlify.toml`이 있어서 배포 디렉터리를 쉽게 맞출 수 있습니다.

## 배포 전 꼭 교체할 값

- `landing/index.html`의 `https://example.netlify.app/`
- `landing/index.html`의 `contact@your-domain.com`
- `landing/privacy.html`의 `contact@your-domain.com`

## 선택 사항

Netlify 토큰이 로컬 셸 환경에 잡혀 있으면 아래 명령으로 직접 배포할 수도 있습니다.

```bash
npm run deploy:netlify
```
