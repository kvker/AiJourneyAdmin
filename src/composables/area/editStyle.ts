import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type AV from 'leancloud-storage'
import LLM from '@/services/llm'
import { text2Voice } from '@/services/fileHandler'
import { toast, } from '@/services/ui'
import { db } from '@/services/cloud'

const llm = new LLM()

export function useEditStyle(form: Ref<AreaForm>, { uiStatus }: { uiStatus: Ref<UiStatusMap> }) {
  // 聊天风格区域
  const chatStyles = ref<ChatStyle[]>([])
  const styleVisible = ref(false)
  const currentStyleIntroduce = ref('')
  const areaIntroduce = ref<AreaIntroduce>()
  const propmtObject = ref<{ previousPrompt: string, tailPrompt: string }>({ previousPrompt: '', tailPrompt: '' })

  let currentChatStyle: ChatStyle | undefined

  const styleUiStatus = ref({ isUpdating: false, isUsing: false })

  async function getChatStyle() {
    const { data } = await db.collection('JChatStyle').orderBy('sort', 'asc').get()
    chatStyles.value = data
  }
  getChatStyle()

  async function onGenerateStyleIntroduce(chatStyle: ChatStyle, index: number) {
    // console.log(chatStyle)
    console.log('当前景点: ' + form.value.name)
    currentChatStyle = chatStyle
    currentStyleIntroduce.value = ''
    styleVisible.value = true
    const { data } = await db.collection('JAreaIntroduce')
      .where({
        chatStyleId: chatStyles.value[index]._id,
        areaId: form.value._id,
      })
      .limit(1)
      .get()
    if (data && data.length) {
      areaIntroduce.value = data[0]
      currentStyleIntroduce.value = areaIntroduce.value!.introduce
      doUpdatePromptObject()
    } else {
      areaIntroduce.value = {
        chatStyleId: chatStyle._id as string,
        areaId: form.value._id as string,
        introduce: '',
        voice: '',
      }
      doUpdatePromptObject()
    }
  }

  function doUpdatePromptObject() {
    propmtObject.value.previousPrompt = currentChatStyle!.previousPrompt
    propmtObject.value.tailPrompt = currentChatStyle!.tailPrompt
  }

  function onUpdateStyleIntroduce() {
    onShowStyleLoading()
    currentStyleIntroduce.value = ''
    const content = `${propmtObject.value.previousPrompt}${form.value.introduce}${propmtObject.value.tailPrompt}`
    llm.onCompletions(content, result => {
      currentStyleIntroduce.value = result
    }, (result) => {
      console.log(result)
      console.log('完成输出')
      onHideStyleLoading()
    })
  }

  async function onUseStyleIntroduce() {
    console.log('onUseStyleIntroduce')
    if (areaIntroduce.value) {
      styleUiStatus.value.isUsing = true
      areaIntroduce.value.introduce = currentStyleIntroduce.value
      if (areaIntroduce.value._id) {
        const ret = await db.collection('JAreaIntroduce')
          .doc(areaIntroduce.value._id)
          .update({ introduce: currentStyleIntroduce.value })
        console.log('更新成功')
        console.log(ret)
      } else {
        const ret = await db.collection('JAreaIntroduce')
          .add(areaIntroduce.value)
        console.log('新增成功')
        console.log(ret)
      }
      styleUiStatus.value.isUsing = false
    }
  }

  async function onGenerateVoice() {
    // console.log('onGenerateVoice')
    const generate = async () => {
      uiStatus.value.isLoading = true
      areaIntroduce.value!.voice = ''
      try {
        const ret = await text2Voice(currentStyleIntroduce.value, currentChatStyle!.voiceType)
        await onUpdateVoice(ret.url)
      } catch (e) {
        console.error(e)
        alert(e)
      } finally {
        uiStatus.value.isLoading = false
      }
    }
    if (areaIntroduce.value?.voice && confirm('生成语音会覆盖原有语音, 是否继续?')) {
      generate()
    } else {
      generate()
    }
  }

  async function onUpdateVoice(url: string) {
    const { data } = await db.collection('JAreaIntroduce')
      .where({
        chatStyleId: currentChatStyle!._id,
        areaId: form.value._id,
      })
      .limit(1)
      .get()
    areaIntroduce.value = data[0]
    areaIntroduce.value!.voice = url
    await db.collection('JAreaIntroduce').doc(areaIntroduce.value!._id).update({ voice: url })
    toast('生成语音完成')
  }

  function onAbortCompletions() {
    onHideStyleLoading()
    llm.onAbortFetch()
  }

  function onShowStyleLoading() {
    styleUiStatus.value.isUpdating = true
  }

  function onHideStyleLoading() {
    styleUiStatus.value.isUpdating = false
  }

  return {
    chatStyles,
    styleVisible,
    styleUiStatus,
    propmtObject,
    currentStyleIntroduce,
    onGenerateStyleIntroduce,
    onUpdateStyleIntroduce,
    onUseStyleIntroduce,
    onGenerateVoice,
    areaIntroduce,
    onAbortCompletions,
  }
}