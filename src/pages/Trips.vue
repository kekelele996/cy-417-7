<template>
  <main class="page">
    <h1>我的旅行</h1>
    <div class="toolbar">
      <el-button type="primary" @click="showCreateDialog = true">新建旅行</el-button>
      <el-select v-model="tripStore.statusFilter" style="width: 160px">
        <el-option label="全部状态" value="all" />
        <el-option v-for="item in TRIP_STATUS_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <EmptyState v-if="!tripStore.filteredTrips.length" title="还没有旅行计划" :description="messages.emptyTrips" />
    <section class="grid">
      <TripCard v-for="trip in tripStore.filteredTrips" :key="trip.id" :trip="trip" @open="open" @remove="tripStore.removeTrip" />
    </section>

    <el-dialog v-model="showCreateDialog" title="新建旅行" width="560px" destroy-on-close>
      <el-form :model="createForm" label-width="90px">
        <el-form-item label="旅行名称">
          <el-input v-model="createForm.title" placeholder="给这次旅行起个名字" />
        </el-form-item>
        <el-form-item label="目的地">
          <el-input v-model="createForm.destination" placeholder="如：杭州、东京、巴黎" />
        </el-form-item>
        <el-form-item label="封面图">
          <el-button link type="primary" @click="showCoverPicker = true">选择封面图</el-button>
          <span class="muted" style="margin-left: 12px;">不选则随机使用默认图库</span>
        </el-form-item>
        <el-form-item v-if="createForm.cover_image" label="预览">
          <div class="cover-preview"><img :src="createForm.cover_image" /></div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="submitCreate">创建并进入</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showCoverPicker" title="选择封面图" width="600px" destroy-on-close top="6vh">
      <CoverImagePicker
        v-model="createForm.cover_image"
        :destination="createForm.destination"
        @confirm="showCoverPicker = false"
        @cancel="showCoverPicker = false"
      />
    </el-dialog>
  </main>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import TripCard from '../components/common/TripCard.vue';
import EmptyState from '../components/common/EmptyState.vue';
import CoverImagePicker from '../components/common/CoverImagePicker.vue';
import { useTripStore } from '../stores/tripStore';
import { TRIP_STATUS_OPTIONS } from '../constants/trip';
import { messages } from '../constants/messages';
const router = useRouter();
const tripStore = useTripStore();
const showCreateDialog = ref(false);
const showCoverPicker = ref(false);
const createForm = reactive({ title: '杭州周末慢旅行', destination: '杭州', cover_image: '' });
function submitCreate() {
  const id = tripStore.createTrip(createForm.title, createForm.destination, createForm.cover_image);
  showCreateDialog.value = false;
  createForm.title = '杭州周末慢旅行';
  createForm.destination = '杭州';
  createForm.cover_image = '';
  router.push('/trip/' + id);
}
function open(id: string) { router.push('/trip/' + id); }
</script>
<style scoped>
.cover-preview { width: 220px; aspect-ratio: 16 / 9; border-radius: 6px; overflow: hidden; border: 1px solid #dbe7cf; }
.cover-preview img { width: 100%; height: 100%; object-fit: cover; }
</style>

