<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import type { Ref } from 'vue'
import { onCompletions } from '@/services/llm'

// 显示控制
const chatBoxShow = ref(false)

const onToggleExpand = () => chatBoxShow.value = !chatBoxShow.value

// 对话模块
const lastContent = ref('')
const textarea: Ref<HTMLTextAreaElement | undefined> = ref()

type Chat = {
  content: string
  role: 'user' | 'assitant'
}
type ChatList = Chat[]

const chatList: Ref<ChatList> = ref([])

const onCreateChat = (content: string, role: 'user' | 'assitant') => {
  chatList.value.push({ content, role })
}

const onChat = () => {
  const lastChat = chatList.value.at(-1)
  if (lastChat) {
    onCompletions(lastChat.content, (result) => {
      lastContent.value = result
    }, done => {
      if (done) {
        onCreateChat(lastContent.value, 'assitant')
        lastContent.value = ''
      }
    })
  }
}

const onSend = () => {
  const content = textarea.value!.value.trim()
  if (content) {
    onCleanTextarea()
    onCreateChat(content, 'user')
    onChat()
  }
}

const onCleanTextarea = () => {
  textarea.value!.value = ''
}
</script>

<template>
  <div class=" fixed bottom-20 right-20">
    <div class="fab w-24 h-24 rounded-full border-2 font-bold text-4xl flex justify-center items-center cursor-pointer shadow-2xl"
      v-show="!chatBoxShow" @click="onToggleExpand">展开</div>
    <div class="chat-box bg-white shadow-2xl p-4" v-show="chatBoxShow">
      <div class="chat-list-box w-full">
        <div class="chat chat-start">
          <div class="chat-bubble chat-bubble-accent">你好啊，有什么需要帮助的么？</div>
        </div>
        <div v-for="(chat, index) of chatList" :key="`chat${index}`" class="chat chat-start"
          :class="chat.role === 'assitant' ? 'chat-start' : 'chat-end'">
          <div class="chat-bubble" :class="chat.role === 'assitant' ? 'chat-bubble-accent' : 'chat-bubble-info'">{{
            chat.content }}</div>
        </div>
        <div v-if="lastContent" class="chat chat-start">
          <div class="chat-bubble chat-bubble-accent">{{ lastContent }}</div>
        </div>
      </div>
      <div class="chat-input-box flex justify-between items-center">
        <textarea class=" flex-1 h-32 border-none outline-none p-2 shadow-md" placeholder="请描述您的需求" ref="textarea" @keyup.shift.enter.prevent="onSend"></textarea>
        <div class=" flex flex-col">
          <button class=" h-12 text-red-400" @click="onSend">发送</button>
          <button class=" h-12 text-grey-400" @click="onToggleExpand">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat {
  margin-bottom: 1rem;
}

.chat-box {
  width: 34rem;
}
</style>