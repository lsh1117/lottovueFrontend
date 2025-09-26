<template>
	<div>
		<h2>경고</h2>
		<p>{{ message }}</p>
	</div>
</template>

<script setup>
	defineProps({
		message: {
			type: String,
			required: true,
		},
	})

</script>
