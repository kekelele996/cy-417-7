<template>
  <main class="page" v-if="trip">
    <TripHeader :trip="trip" :show-edit="true" @edit-cover="showCoverPicker = true" />
    <div class="toolbar">
      <el-button type="primary" @click="router.push('/spots')">添加景点</el-button>
      <el-button @click="router.push('/planner/' + trip.id + '/1')">编排第 1 天</el-button>
      <el-button @click="router.push('/share')">分享预览</el-button>
      <el-button @click="showEditDialog = true">编辑信息</el-button>
    </div>
    <section class="grid">
      <BudgetChart :spent="stats.value.budget.spent" :remaining="stats.value.budget.remaining" />
      <div class="band"><strong>统计</strong><p>天数 {{ stats.value.days }} · 景点 {{ stats.value.spotCount }}</p><p class="muted">{{ stats.value.budget.warning }}</p></div>
    </section>
    <DayTimeline v-for="day in tripDays" :key="day.id" :day="day" :spots="spotStore.spots" />

    <el-dialog v-model="showCoverPicker" title="更换封面图" width="600px" destroy-on-close top="6vh">
      <CoverImagePicker
        v-model="tempCover"
        :destination="trip.destination"
        @confirm="confirmCover"
        @cancel="showCoverPicker = false"
      />
    </el-dialog>

    <el-dialog v-model="showEditDialog" title="编辑旅行信息" width="480px" destroy-on-close>
      <el-form :model="editForm" label-width="90px">
        <el-form-item label="旅行名称">
          <el-input v-model="editForm.title" />
        </el-form-item>
        <el-form-item label="目的地">
          <el-input v-model="editForm.destination" />
        </el-form-item>
        <el-form-item label="开始日期">
          <el-date-picker v-model="editForm.start_date" type="date" value-format="YYYY-MM-DD" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker v-model="editForm.end_date" type="date" value-format="YYYY-MM-DD" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="预算">
          <el-input-number v-model="editForm.budget" :min="0" :step="100" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="同行人">
          <el-tag
            v-for="(m, i) in editForm.members"
            :key="i"
            closable
            style="margin-right: 6px; margin-bottom: 6px;"
            @close="editForm.members.splice(i, 1)"
          >{{ m }}</el-tag>
          <el-input
            v-if="showMemberInput"
            v-model="newMember"
            size="small"
            style="width: 120px; margin-top: 4px;"
            @keyup.enter="addMember"
            @blur="addMember"
            ref="memberInputRef"
          />
          <el-button v-else link type="primary" size="small" @click="toggleMemberInput">+ 添加</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="submitEdit">保存</el-button>
      </template>
    </el-dialog>
  </main>
  <main v-else class="page"><EmptyState title="旅行不存在" /></main>
</template>
<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTripStore } from '../stores/tripStore';
import { useSpotStore } from '../stores/spotStore';
import { useDayPlanStore } from '../stores/dayPlanStore';
import { useTripStats } from '../hooks/useTripStats';
import TripHeader from '../components/common/TripHeader.vue';
import DayTimeline from '../components/common/DayTimeline.vue';
import BudgetChart from '../components/common/BudgetChart.vue';
import EmptyState from '../components/common/EmptyState.vue';
import CoverImagePicker from '../components/common/CoverImagePicker.vue';
const route = useRoute();
const router = useRouter();
const tripStore = useTripStore();
const spotStore = useSpotStore();
const dayPlanStore = useDayPlanStore();
const trip = computed(() => tripStore.trips.find((item) => item.id === route.params.id));
const tripDays = computed(() => dayPlanStore.dayPlans.filter((day) => day.trip_id === route.params.id));
const stats = computed(() => trip.value ? useTripStats(trip.value, dayPlanStore.dayPlans, spotStore.spots) : { value: { days: 0, spotCount: 0, budget: { spent: 0, remaining: 0, warning: '' } } });

const showCoverPicker = ref(false);
const tempCover = ref('');
watch(showCoverPicker, (val) => { if (val && trip.value) tempCover.value = trip.value.cover_image; });
function confirmCover() {
  if (trip.value) tripStore.updateTripCover(trip.value.id, tempCover.value);
  showCoverPicker.value = false;
}

const showEditDialog = ref(false);
const showMemberInput = ref(false);
const newMember = ref('');
const memberInputRef = ref<any>(null);
const editForm = reactive({
  title: '', destination: '', start_date: '', end_date: '', budget: 0, members: [] as string[],
});
watch(showEditDialog, (val) => {
  if (val && trip.value) {
    editForm.title = trip.value.title;
    editForm.destination = trip.value.destination;
    editForm.start_date = trip.value.start_date;
    editForm.end_date = trip.value.end_date;
    editForm.budget = trip.value.budget;
    editForm.members = [...trip.value.members];
  }
});
async function toggleMemberInput() {
  showMemberInput.value = true;
  await nextTick();
  memberInputRef.value?.focus();
}
function addMember() {
  const val = newMember.value.trim();
  if (val) editForm.members.push(val);
  newMember.value = '';
  showMemberInput.value = false;
}
function submitEdit() {
  if (trip.value) {
    tripStore.updateTrip(trip.value.id, { ...editForm });
  }
  showEditDialog.value = false;
}
</script>

