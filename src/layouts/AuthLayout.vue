<template>
  <q-layout view="hHh lpR fFf">
    <q-header
      class="bg-primary text-white"
      elevated
    >
      <q-toolbar>
        <q-btn  stretch flat class="q-mr-sm">
          MaVoix
        </q-btn>
        <q-separator dark vertical inset v-if="$route.path !== '/'" />
        <q-btn stretch flat label="back" v-if="$route.path !== '/'" @click="$router.push({ name: 'auth' })" />
        <q-space />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
