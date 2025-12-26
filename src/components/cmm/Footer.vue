<template>
    <footer class="footer-area">
        <div class="footer-content">
            <div class="footer-links">
                <router-link 
                    to="/terms?group=TOS" 
                    :class="['footer-link', 'terms-tos', { active: isActiveGroup('TOS') }]"
                >
                    이용약관
                </router-link>
                <span class="footer-separator">|</span>
                <router-link 
                    to="/privacy-policy" 
                    :class="['footer-link', 'privacy-policy', { active: isActiveRoute('/privacy-policy') }]"
                >
                    개인정보처리방침
                </router-link>
                <!--
                <span class="footer-separator">|</span>
                <router-link 
                    to="/terms?group=PS" 
                    :class="['footer-link', 'terms-ps', { active: isActiveGroup('PS') }]"
                >
                    유료서비스 약관
                </router-link>
                <span class="footer-separator">|</span>
                <router-link 
                    to="/terms?group=CP" 
                    :class="['footer-link', 'terms-cp', { active: isActiveGroup('CP') }]"
                >
                    크레딧 규칙
                </router-link>
                -->
            </div>
            <div class="copyright-area">
                <p>LOTTOVUE Inc. All rights reserved.</p>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 현재 경로가 terms이고 group 쿼리 파라미터가 특정 그룹과 일치하는지 확인
const isActiveGroup = (group) => {
    return route.path === '/terms' && route.query.group === group
}

// 특정 경로가 활성화되어 있는지 확인
const isActiveRoute = (path) => {
    return route.path === path
}
</script>