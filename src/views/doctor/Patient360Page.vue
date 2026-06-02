<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Patient360View from '@/components/Patient360View.vue'

const route = useRoute()
const patientId = computed(() => {
  const id = route.params.id as string
  return id && id !== 'demo' ? id : 'p-02'
})
</script>

<template>
  <div class="p360-page">
    <Patient360View :patient-id="patientId" mode="doctor" />
  </div>
</template>

<style scoped>
.p360-page { max-width: 900px; }
</style>
