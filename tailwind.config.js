/** assets/tailwind.css 빌드용 설정 (CDN 대체). 클래스를 추가하면 다시 빌드할 것. */
module.exports = {
  content: [
    "./index.html",
    "./trisolaris.html",
    "./walks.html",
    "./syllable.html",
    "./archive.html"
  ],
  theme: { extend: {} },
  plugins: []
};
