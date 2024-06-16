<script lang="ts" setup>
defineProps({
  imageData: {
    type: Object,
    required: true,
  },
  clearImagePreview: {
    type: Function,
    required: true,
  },
});
</script>

<template>
  <div
    v-if="imageData.url"
    id="toast-notification"
    class="max-w-xs p-4 mx-3 text-base rounded-lg shadow cursor-pointer w-fit bg-base-content text-primary-content"
    role="alert"
  >
    <div class="flex items-center mb-3">
      <span class="text-sm font-semibold text-primary-content"
        >Image Preview</span
      >
      <button
        :onclick="clearImagePreview"
        type="button"
        class="ms-auto btn btn-ghost btn-circle btn-sm hover:text-error"
        data-dismiss-target="#toast-notification"
        aria-label="Close"
      >
        <span class="sr-only">Close</span>
        <svg
          class="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
    <div class="flex items-center">
      <div class="relative inline-block shrink-0">
        <NuxtImg class="h-12" :src="imageData.url" :alt="imageData.name" />
      </div>
      <div class="overflow-hidden text-sm font-normal ms-3">
        <div class="text-sm font-semibold truncate text-primary-content">
          {{ imageData.name && imageData.name }}
        </div>
        <div class="text-sm italic font-normal text-primary-content">
          {{ imageData.type && imageData.type }}
        </div>
        <span class="text-xs font-normal text-error">{{
          imageData.size && imageData.size
        }}</span>
      </div>
    </div>
  </div>
</template>
