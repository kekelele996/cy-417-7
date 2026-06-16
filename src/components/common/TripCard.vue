<template>
  <article class="trip-card">
    <div class="cover">
      <img :src="coverUrl" :alt="trip.title" />
      <el-tag class="status-tag" size="small">{{ tripStatusText[trip.status] }}</el-tag>
    </div>
    <div class="content">
      <strong class="title">{{ trip.title }}</strong>
      <p class="muted meta">{{ trip.destination }} · {{ formatDate(trip.start_date) }} - {{ formatDate(trip.end_date) }}</p>
      <p class="info">预算 {{ formatCurrency(trip.budget, trip.currency) }} · 同行 {{ trip.members.join('、') }}</p>
    </div>
    <div class="toolbar">
      <el-button type="primary" @click="$emit('open', trip.id)">进入详情</el-button>
      <el-button @click="$emit('remove', trip.id)">删除</el-button>
    </div>
  </article>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import type { Trip } from '../../models/trip';
import { formatCurrency, formatDate, getTripCover, tripStatusText } from '../../utils/formatters';
const props = defineProps<{ trip: Trip }>();
defineEmits<{ open: [id: string]; remove: [id: string] }>();
const coverUrl = computed(() => getTripCover(props.trip));
</script>
<style scoped>
.trip-card { background: #fff; border: 1px solid #dbe7cf; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; }
.trip-card .cover { position: relative; width: 100%; aspect-ratio: 16 / 9; background: #eef3ea; overflow: hidden; }
.trip-card .cover img { width: 100%; height: 100%; object-fit: cover; }
.trip-card .status-tag { position: absolute; top: 10px; right: 10px; }
.trip-card .content { padding: 16px 18px 8px; }
.trip-card .title { display: block; font-size: 16px; margin-bottom: 4px; }
.trip-card .meta { margin: 4px 0 6px; font-size: 13px; }
.trip-card .info { margin: 0; color: #3a4a43; font-size: 13px; }
.trip-card .toolbar { padding: 8px 18px 18px; display: flex; gap: 10px; justify-content: flex-end; }
</style>

