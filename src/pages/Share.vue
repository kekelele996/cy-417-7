<template>
  <main class="share-page">
    <TripHeader v-if="trip" :trip="trip" />
    <div class="content">
      <DayTimeline v-for="day in tripDays" :key="day.id" :day="day" :spots="spotStore.spots" />
      <div class="footer-band">
        <p class="muted">—— 由 TripWeaver 生成 ——</p>
        <el-button type="primary" @click="copyText">复制行程文本</el-button>
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useTripStore } from '../stores/tripStore';
import { useSpotStore } from '../stores/spotStore';
import { useDayPlanStore } from '../stores/dayPlanStore';
import TripHeader from '../components/common/TripHeader.vue';
import DayTimeline from '../components/common/DayTimeline.vue';
const tripStore = useTripStore();
const spotStore = useSpotStore();
const dayPlanStore = useDayPlanStore();
const trip = computed(() => tripStore.trips[0]);
const tripDays = computed(() => trip.value ? dayPlanStore.dayPlans.filter((d) => d.trip_id === trip.value!.id) : []);
function copyText() { navigator.clipboard?.writeText('TripWeaver 行程单：' + (trip.value?.title || '未命名')); }
</script>
<style scoped>
.share-page { background: #f4f7f2; min-height: 100vh; }
.share-page > :deep(.trip-header) { padding: 0; }
.share-page > :deep(.trip-header .cover-banner) { border-radius: 0; }
.content { max-width: 860px; margin: 0 auto; padding: 24px clamp(16px, 4vw, 48px); }
.footer-band { margin-top: 32px; text-align: center; }
.footer-band .muted { margin-bottom: 12px; }
</style>

