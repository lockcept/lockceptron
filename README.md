# lockceptron

## Overview

디스코드 봇입니다. 딱히 컨셉은 없고 [@lockcept](https://github.com/lockcept) 이 필요한 기능만 만들어서 넣었습니다.  
[DOCS](https://www.notion.so/lockceptron-DOCS-acd2449103174c0abd8b0a0083a17d89)

[What's new](https://www.notion.so/lockceptron-What-s-new-10b051197d724702946d1ab353c6d9ce)

## Development

```sh
$ yarn
$ yarn dev
```

## Build

### 방법1. 깃허브 태그

- 태그를 `v*` 형태로 생성시 해당 이름으로 이미지가 자동빌드됨
  ![image](https://user-images.githubusercontent.com/21287813/163698637-d4986a39-9d61-400e-a991-f1ff253123cb.png)
- ex) `v0.0.1` 태그 생성시 actions가 작동되며, 성공하면 `lockcept/lockceptron:v0.0.1` 이미지가 생성됨

### 방법2. 수동빌드

- `Actions` - `Workflows` - `image-build` - `Run workflow` 버튼 클릭
- branch 이름으로 이미지 태그가 생성됨

## Deployment

1. argocd 접속 (https://argocd.193-123-230-88.nip.io/)

2. lockceptron app 클릭

- `Filter` - `Project` 에서 lockceptron 적용시 찾기 쉬움
  ![image](https://user-images.githubusercontent.com/21287813/163699054-eaf69285-87a4-4d05-b131-065a08c202f0.png)

3. 상단의 `APP DETAILS` 버튼 클릭

4. `TARGET REVISION` 필드에서 옵션을 `TAGS` 설정, 원하는 버전 클릭 후 SAVE 버튼 클릭
   ![image](https://user-images.githubusercontent.com/21287813/163699434-944ae285-da76-4e3c-b47d-41106c5af349.png)

5. 상단의 `SYNC` 버튼 클릭 시 배포 완료
   ![image](https://user-images.githubusercontent.com/21287813/163699413-2d5a5e1d-7e51-41bf-975d-b8679b172f29.png)
