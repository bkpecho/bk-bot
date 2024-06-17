<template>
  <div class="z-10 flex max-w-screen-lg px-3 rounded-b-lg navbar">
    <div class="flex-1">
      <NuxtLink to="/" class="font-mono text-xl text-primary"
        >🍎 bk-bot</NuxtLink
      >
    </div>
    <div class="flex-none gap-2">
      <div>
        <label class="grid cursor-pointer place-items-center">
          <input
            type="checkbox"
            value="synthwave"
            class="col-span-2 col-start-1 row-start-1 toggle theme-controller bg-primary"
          />
          <svg
            class="col-start-1 row-start-1 stroke-base-100 fill-base-100"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <path
              d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
            />
          </svg>
          <svg
            class="col-start-2 row-start-1 stroke-base-100 fill-base-100"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </label>
      </div>
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <NuxtImg
              alt="Bryan King Pecho's Avatar"
              src="https://avatars.githubusercontent.com/u/91954699?v=4"
              width="40"
              height="40"
            />
          </div>
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <NuxtLink
              to="https://github.com/bkpecho/bk-bot"
              target="_blank"
              class="justify-between"
            >
              GitHub
              <span class="badge">New</span>
            </NuxtLink>
          </li>
          <li><a>Settings</a></li>
          <li><a>Logout</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>
