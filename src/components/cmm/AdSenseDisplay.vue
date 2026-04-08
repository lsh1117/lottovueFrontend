<template>
	<div v-if="adSlot" class="adsense-display" :class="wrapperClass">
		<ins
			class="adsbygoogle"
			style="display: block"
			:data-ad-client="adClient"
			:data-ad-slot="adSlot"
			data-ad-format="auto"
			data-full-width-responsive="true"
		/>
	</div>
</template>

<script setup>
import { nextTick, onMounted } from 'vue'
import { ensureAdSenseScript } from '@/utils/adsenseScript'

const props = defineProps({
	adClient: {
		type: String,
		default: 'ca-pub-7539747702104892',
	},
	adSlot: {
		type: String,
		default: '',
	},
	wrapperClass: {
		type: String,
		default: '',
	},
})

onMounted(async () => {
	if (!props.adSlot) return
	try {
		await ensureAdSenseScript(props.adClient)
		await nextTick()
		;(window.adsbygoogle = window.adsbygoogle || []).push({})
	} catch (e) {
		console.warn('[AdSense]', e)
	}
})
</script>

<style scoped>
.adsense-display {
	display: flex;
	justify-content: center;
	width: 100%;
	min-height: 90px;
	margin-bottom: 0.75rem;
}
</style>
