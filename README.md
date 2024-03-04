<div style="display: flex; align-items:center;justify-content:center;"> 
  <img width="442" alt="image" src="https://github.com/suehub/TS-BOOK-LOG/assets/111065848/915474e3-f6ef-4a55-b2b4-acfbd237bef1">
</div>

</br>

## 💁‍♀️ 프로젝트 소개
`BOOKLOG` 는 시간과 장소의 제약 없이 독서를 통한 생각을 자유롭게 공유할 수 있는 웹 기반 독서 감상 커뮤니티입니다.

#### 📅 개발 기간 : `23.10.24 ~ 23.11.05`
#### 배포 주소 : https://sue-book-log.netlify.app/
</br>

## 💻 개발 스택


<img src="https://img.shields.io/badge/visualstudiocode-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white"> <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white"> <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">

<img src="https://img.shields.io/badge/REACT-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"> <img src="https://img.shields.io/badge/firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black">

<br>
<br>

## ✨ 구현 내용
* <b>회원가입</b>
  * 유효성 검사
* <b>로그인</b>
  * 가입된 정보로 로그인
  * Google 소셜 로그인
* <b>도서 검색</b>
  * Naver Search API를 이용해 도서 검색 기능 구현
* <b>감상문 CRUD</b>
* <b>감상문 검색</b>
* <b>댓글 기능</b>
* <b>좋아요 기능</b>
* <b>북마크 기능</b>

<br/>
<br/>

## 🗂 디렉토리 구조
<details>
  <summary>디렉토리</summary>

  ```
📦src
 ┣ 📂assets
 ┃ ┣ 📂fonts
 ┃ ┃ ┣ 📂NotoSansKR
 ┃ ┃ ┃ ┣ 📜NotoSansKR-Bold.ttf
 ┃ ┃ ┃ ┣ 📜NotoSansKR-ExtraBold.ttf
 ┃ ┃ ┃ ┣ 📜NotoSansKR-ExtraLight.ttf
 ┃ ┃ ┃ ┣ 📜NotoSansKR-Light.ttf
 ┃ ┃ ┃ ┣ 📜NotoSansKR-Medium.ttf
 ┃ ┃ ┃ ┣ 📜NotoSansKR-Regular.ttf
 ┃ ┃ ┃ ┣ 📜NotoSansKR-SemiBold.ttf
 ┃ ┃ ┃ ┗ 📜NotoSansKR-Thin.ttf
 ┃ ┃ ┗ 📜font.css
 ┃ ┗ 📂images
 ┃ ┃ ┣ 📜default_image.png
 ┃ ┃ ┣ 📜default_profile.png
 ┃ ┃ ┗ 📜logo.png
 ┣ 📂components
 ┃ ┣ 📂common
 ┃ ┃ ┣ 📜Footer.tsx
 ┃ ┃ ┗ 📜Header.tsx
 ┃ ┣ 📂home
 ┃ ┃ ┣ 📜PostItem.tsx
 ┃ ┃ ┗ 📜PostList.tsx
 ┃ ┗ 📂post
 ┃ ┃ ┣ 📜BookSearchModal.tsx
 ┃ ┃ ┣ 📜Comments.tsx
 ┃ ┃ ┣ 📜PostDetail.tsx
 ┃ ┃ ┣ 📜PostEdit.tsx
 ┃ ┃ ┣ 📜PostWrite.tsx
 ┃ ┃ ┗ 📜SideBar.tsx
 ┣ 📂context
 ┃ ┗ 📜Authcontext.tsx
 ┣ 📂pages
 ┃ ┣ 📜Bookmarks.tsx
 ┃ ┣ 📜Home.tsx
 ┃ ┣ 📜Login.tsx
 ┃ ┣ 📜MyPosts.tsx
 ┃ ┣ 📜NotFound.tsx
 ┃ ┗ 📜Signup.tsx
 ┣ 📂styles
 ┃ ┗ 📜globalStyle.ts
 ┣ 📜App.tsx
 ┣ 📜firebase.ts
 ┗ 📜index.tsx
 ```
 
</details>

<br/> 
<br/>
