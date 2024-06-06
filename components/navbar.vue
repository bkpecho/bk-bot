<template>
  <div class="z-10 bg-white rounded-b-lg navbar">
    <div class="flex-1">
      <NuxtLink to="/">
        <a class="text-xl btn btn-ghost">🤖 bk_bot</a>
      </NuxtLink>
    </div>
    <div class="flex-none">
      <div>
        <NuxtLink
          to="https://github.com/bkpecho/bk-bot"
          aria-label="Github"
          target="_blank"
        >
          <Icon name="mdi:github" class="btn btn-ghost btn-circle avatar" />
        </NuxtLink>
      </div>
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <img
              alt="Bryan King Pecho's Avatar"
              src="https://avatars.githubusercontent.com/u/91954699?v=4"
            />
          </div>
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <a class="justify-between">
              Profile
              <span class="badge">New</span>
            </a>
          </li>
          <li><a>Settings</a></li>
          <li><a>Logout</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
