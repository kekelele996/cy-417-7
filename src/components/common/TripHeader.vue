<template>
  <header class="trip-header">
    <div class="cover-banner">
      <img :src="coverUrl" :alt="trip.title" class="cover-img" />
      <div class="cover-overlay">
        <div class="cover-content">
          <p class="brand">TripWeaver</p>
          <h1>{{ trip.title }}</h1>
          <p class="meta">
            <el-tag size="small" effect="dark">{{ tripStatusText[trip.status] }}</el-tag>
            <span class="destination">{{ trip.destination }}</span>
            <span class="date">{{ trip.start_date }} 至 {{ trip.end_date }}</span>
          </p>
          <p class="sub">预算 {{ formatCurrency(trip.budget, trip.currency) }} · 同行 {{ trip.members.join('、') }}</p>
          <el-button v-if="showEdit" type="primary" plain size="small" @click="$emit('edit-cover')" class="edit-btn">
            <el-icon><Picture /></el-icon>更换封面
          </el-button>
        </div>
      </div>
    </div>
  </header>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { Picture } from '@element-plus/icons-vue';
import type { Trip } from '../../models/trip';
import { formatCurrency, getTripCover, tripStatusText } from '../../utils/formatters';
const props = withDefaults(defineProps<{ trip: Trip; showEdit?: boolean }>(), { showEdit: false });
defineEmits<{ (e: 'edit-cover'): void }>();
const coverUrl = computed(() => getTripCover(props.trip));
</script>
<style scoped>
.trip-header { padding: 0 0 24px; }
.cover-banner { position: relative; width: 100%; aspect-ratio: 21 / 9; border-radius: 12px; overflow: hidden; min-height: 200px; }
.cover-img { width: 100%; height: 100%; object-fit: cover; }
.cover-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.25) 55%, transparent 100%); display: flex; align-items: flex-end; }
.cover-content { color: #fff; padding: 24px 28px; width: 100%; }
.cover-content .brand { margin: 0 0 8px; font-size: 12px; letter-spacing: 2px; opacity: 0.85; text-transform: uppercase; }
.cover-content h1 { margin: 0 0 10px; font-size: clamp(20px, 3vw, 30px); font-weight: 600; text-shadow: 0 2px 8px rgba(0,0,0,0.3); }
.cover-content .meta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin: 0 0 6px; font-size: 14px; }
.cover-content .meta .destination, .cover-content .meta .date { text-shadow: 0 1px 4px rgba(0,0,0,0.3); }
.cover-content .sub { margin: 0 0 12px; font-size: 13px; opacity: 0.92; }
.edit-btn { margin-top: 4px; }
</style>

