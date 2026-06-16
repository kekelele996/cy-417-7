<template>
  <div class="cover-picker">
    <div class="preview-wrap">
      <div class="preview">
        <img :src="previewUrl" alt="封面预览" />
      </div>
      <p class="muted preview-hint">当前封面预览</p>
    </div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="本地上传" name="upload">
        <el-upload
          class="uploader"
          :auto-upload="false"
          :show-file-list="false"
          accept="image/*"
          :on-change="handleFileChange"
          drag
        >
          <el-icon class="upload-icon"><UploadFilled /></el-icon>
          <div class="el-upload__text">拖拽图片到此处，或 <em>点击选择</em></div>
          <template #tip>
            <div class="el-upload__tip muted">支持 JPG / PNG / WEBP，建议 16:9 横图</div>
          </template>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="默认图库" name="gallery">
        <div class="gallery">
          <div
            v-for="(url, idx) in gallery"
            :key="idx"
            class="gallery-item"
            :class="{ active: localValue === url }"
            @click="selectGallery(url)"
          >
            <img :src="url" :alt="'图库 ' + (idx + 1)" />
            <div v-if="localValue === url" class="check">
              <el-icon><Check /></el-icon>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="actions">
      <el-button @click="$emit('cancel')">取消</el-button>
      <el-button type="primary" @click="confirm">确认</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { UploadFilled, Check } from '@element-plus/icons-vue';
import { DEFAULT_COVER_GALLERY } from '../../constants/trip';
import { generatePlaceholderCover } from '../../utils/formatters';

const props = defineProps<{
  modelValue: string;
  destination?: string;
}>();
const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

const activeTab = ref<'upload' | 'gallery'>('gallery');
const gallery = DEFAULT_COVER_GALLERY;
const localValue = ref(props.modelValue);

const previewUrl = computed(() => {
  return localValue.value || generatePlaceholderCover(props.destination || '风景');
});

watch(
  () => props.modelValue,
  (val) => { localValue.value = val; }
);

function handleFileChange(file: any) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const result = e.target?.result as string;
    if (result) {
      localValue.value = result;
      emit('update:modelValue', result);
    }
  };
  reader.readAsDataURL(file.raw);
}

function selectGallery(url: string) {
  localValue.value = url;
  emit('update:modelValue', url);
}

function confirm() {
  emit('update:modelValue', localValue.value);
  emit('confirm');
}
</script>
<style scoped>
.cover-picker { display: flex; flex-direction: column; gap: 16px; }
.preview-wrap { text-align: center; }
.preview { width: 100%; aspect-ratio: 16 / 9; border-radius: 8px; overflow: hidden; border: 1px solid #dbe7cf; background: #f4f7f2; }
.preview img { width: 100%; height: 100%; object-fit: cover; }
.preview-hint { margin: 8px 0 0; font-size: 12px; }
.uploader { width: 100%; }
.upload-icon { font-size: 48px; color: #2d7a46; }
.gallery { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; max-height: 340px; overflow-y: auto; padding: 4px; }
.gallery-item { position: relative; aspect-ratio: 16 / 9; border-radius: 6px; overflow: hidden; cursor: pointer; border: 2px solid transparent; transition: all 0.15s; }
.gallery-item:hover { border-color: #8bc59b; transform: scale(1.02); }
.gallery-item.active { border-color: #2d7a46; }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; }
.gallery-item .check { position: absolute; top: 6px; right: 6px; width: 24px; height: 24px; border-radius: 50%; background: #2d7a46; color: #fff; display: flex; align-items: center; justify-content: center; }
.actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 8px; border-top: 1px solid #eee; }
</style>
