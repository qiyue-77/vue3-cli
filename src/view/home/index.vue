<!-- eslint-disable @typescript-eslint/no-empty-function -->
<template>
  <div class="home-title">home--</div>
  <el-button @click="emit">事件总线发送</el-button>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { bus } from '@/utils/mitt';
export default defineComponent({
  setup() {
    const a = ref(0);
    console.log(a);
    const emit = () => {
      bus.$emit('senddata', '132456');
    };
    return {
      emit,
    };
  },
});
</script>

<style lang="less">
.home-title {
  color: blue;
  display: flex;
  box-sizing: border-box;
}
</style>
