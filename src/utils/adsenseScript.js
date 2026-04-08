/**
 * AdSense 스크립트를 한 번만 주입합니다.
 * index.html 전역 로드 대신 콘텐츠가 있는 페이지에서만 로드하면
 * 로그인·회원가입 등 저콘텐츠 화면에 광고 스크립트가 항상 깔리는 것을 피하기 쉽습니다.
 */
let loadPromise = null

export function ensureAdSenseScript(clientId) {
	if (typeof document === 'undefined') {
		return Promise.resolve()
	}

	const marker = 'script[data-lottovue-adsense="1"]'
	const existing = document.querySelector(marker)
	if (existing) {
		if (window.adsbygoogle) {
			return Promise.resolve()
		}
		return new Promise((resolve, reject) => {
			existing.addEventListener('load', () => resolve(), { once: true })
			existing.addEventListener('error', () => reject(new Error('AdSense script error')), { once: true })
		})
	}

	if (loadPromise) {
		return loadPromise
	}

	loadPromise = new Promise((resolve, reject) => {
		const s = document.createElement('script')
		s.async = true
		s.crossOrigin = 'anonymous'
		s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(clientId)}`
		s.setAttribute('data-lottovue-adsense', '1')
		s.onload = () => resolve()
		s.onerror = () => {
			loadPromise = null
			reject(new Error('AdSense script load failed'))
		}
		document.head.appendChild(s)
	})

	return loadPromise
}
