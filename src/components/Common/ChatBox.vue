<script lang="ts" setup>
import { ref, computed, watch, nextTick } from 'vue'
import type { Ref } from 'vue'
import LLM from '@/services/llm'

const llm = new LLM()

// 显示控制
const chatBoxShow = ref(false)

const onToggleExpand = () => chatBoxShow.value = !chatBoxShow.value

// 对话模块
const lastContent = ref('')
const textarea: Ref<HTMLTextAreaElement | undefined> = ref()
const listBox: Ref<HTMLDivElement | undefined> = ref()

type ChatList = GLMMessage[]

const chatList: Ref<ChatList> = ref([])
const isChating = ref(false)

const onCreateChat = (content: string, role: GLMMessage["role"]) => {
  chatList.value.push({ content, role })
  onScrollToBottom()
}

const onChat = async () => {
  const lastChat = chatList.value.at(-1)
  if (lastChat && !isChating.value) {
    try {
      isChating.value = true
      await llm.onCompletions(chatList.value, (result) => {
        lastContent.value = result
        onScrollToBottom()
      }, done => {
        if (done) {
          isChating.value = false
          onCreateChat(lastContent.value, 'assistant')
          lastContent.value = ''
        }
      })
    } catch (error) {
      isChating.value = false
      alert(error)
      chatList.value.pop()
      console.error(error)
    }
  }
}

const onSend = (e: KeyboardEvent | MouseEvent) => {
  e.preventDefault()
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

const onScrollToBottom = () => {
  nextTick(() => {
    listBox.value!.scrollTop = listBox.value!.scrollHeight
  })
}
</script>

<template>
  <div class=" fixed bottom-20 right-20">
    <div
      class="fab w-12 h-12 rounded-full border-2 font-bold text-2xl flex justify-center items-center cursor-pointer shadow-2xl bg-white"
      v-show="!chatBoxShow" @click="onToggleExpand">AI</div>
    <div class="chat-box bg-white shadow-2xl p-4" v-show="chatBoxShow">
      <div class="chat-list-box w-full border-b-2 overflow-y-scroll" ref="listBox">
        <div class="chat chat-start">
          <div class="chat-bubble chat-bubble-accent">你好啊，有什么需要帮助的么？</div>
        </div>
        <div v-for="(chat, index) of chatList" :key="`chat${index}`" class="chat chat-start"
          :class="chat.role === 'assistant' ? 'chat-start' : 'chat-end'">
          <div class="chat-bubble" :class="chat.role === 'assistant' ? 'chat-bubble-accent' : 'chat-bubble-info'">{{
            chat.content }}</div>
        </div>
        <div v-if="lastContent" class="chat chat-start">
          <div class="chat-bubble chat-bubble-accent">{{ lastContent }}</div>
        </div>
      </div>
      <div class="chat-input-box flex justify-between items-center mt-2">
        <textarea class=" flex-1 h-24 border-none outline-none p-2 shadow-md" :placeholder="isChating ? '请等待 AI 输出完成' : '请描述您的需求（shift+enter=发送）'"
          :disabled="isChating" ref="textarea" @keydown.shift.enter="onSend"></textarea>
        <div class=" flex flex-col">
          <button class="btn btn-sm btn-primary mb-4" @click="onSend">发送</button>
          <button class="btn btn-sm btn-ghost" @click="onToggleExpand">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat {
  margin-bottom: 1rem;
}

.chat-list-box {
  max-height: 24rem;
}

.chat-box {
  width: 34rem;
}
</style>