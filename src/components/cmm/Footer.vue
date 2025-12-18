<template>
    <footer class="footer-area">
        <div class="footer-content">
            <div class="footer-links">
                <router-link to="/terms?group=TOS" class="footer-link">이용약관</router-link>
                <span class="footer-separator">|</span>
                <router-link to="/privacy-policy" class="footer-link">개인정보처리방침</router-link>
                <span class="footer-separator">|</span>
                <router-link to="/terms?group=PS" class="footer-link">유료서비스 약관</router-link>
                <span class="footer-separator">|</span>
                <router-link to="/terms?group=CP" class="footer-link">크레딧 규칙</router-link>
            </div>
            <div class="copyright-area">
                <p>SAMDORY Inc. All rights reserved.</p>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>