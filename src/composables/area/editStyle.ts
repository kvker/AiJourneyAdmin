import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import lc from '@/libs/lc';
import type AV from 'leancloud-storage'
import { doCompletions } from '@/services/llm'
import { text2Voice } from '@/services/fileHandler'
import { toast, loading, unloading } from '@/services/ui'

export function useEditStyle(form: Ref<AreaForm>, { uiStatus }: { uiStatus: Ref<UiStatusMap> }) {
  // 聊天风格区域
  const chatStylesQueriable = ref<AV.Queriable[]>([])
  const chatStyles = computed(() => {
    return chatStylesQueriable.value.map(i => i.toJSON() as ChatStyle)
  })
  const styleVisible = ref(false)
  const currentStyleIntroduce = ref('')
  const areaIntroduceQueriable = ref<AV.Queriable>()
  const propmtObject = ref<{ previousPrompt: string, tailPrompt: string }>({ previousPrompt: '', tailPrompt: '' })
  const currentChatStyle = computed(() => {
    const chatStyle = areaIntroduceQueriable.value!.get('chatStyle').toJSON() as ChatStyle
    return chatStyle
  })

  const styleUiStatus = ref({ isUpdating: false })

  async function getChatStyle() {
    const cs = await lc.read('ChatStyle', q => {
      q.ascending('sort')
    })
    chatStylesQueriable.value = cs
  }
  getChatStyle()

  async function onGenerateStyleIntroduce(chatStyle: ChatStyle, index: number) {
    // console.log(chatStyle)
    console.log('当前景点: ' + form.value.name)
    currentStyleIntroduce.value = ''
    styleVisible.value = true
    const areaQueriable = lc.createObject('Area', form.value.objectId)
    const chatStyleQueriable = chatStylesQueriable.value[index]
    const ret = await lc.one('AreaIntroduce', q => {
      q.equalTo('chatStyle', chatStyleQueriable)
      q.equalTo('area', areaQueriable)
      q.include('chatStyle')
    })
    if (ret) {
      areaIntroduceQueriable.value = ret
      currentStyleIntroduce.value = areaIntroduceQueriable.value.get('introduce')
      doUpdatePromptObject()
    } else {
      areaIntroduceQueriable.value = new lc.AV.Object('AreaIntroduce')
      areaIntroduceQueriable.value.set('chatStyle', chatStyleQueriable)
      areaIntroduceQueriable.value.set('area', areaQueriable)
      areaIntroduceQueriable.value.set('user', lc.currentUser())
      doUpdatePromptObject()
    }
  }

  function doUpdatePromptObject() {
    propmtObject.value.previousPrompt = currentChatStyle.value.previousPrompt
    propmtObject.value.tailPrompt = currentChatStyle.value.tailPrompt
  }

  async function onUseStyleIntroduce() {
    console.log('onUseStyleIntroduce')
    // lc.update()
    if (areaIntroduceQueriable.value) {
      areaIntroduceQueriable.value.set('introduce', currentStyleIntroduce.value)
      await areaIntroduceQueriable.value.save()
      alert('更新完成')
    }

  }

  function onUpdateStyleIntroduce() {
    // console.log('onUpdateStyleIntroduce')
    // console.log(areaIntroduceQueriable.value)
    styleUiStatus.value.isUpdating = true
    currentStyleIntroduce.value = ''
    const content = `${propmtObject.value.previousPrompt}${form.value.introduce}${propmtObject.value.tailPrompt}`
    // console.log(content)
    // debugger
    // return
    doCompletions(content, result => {
      currentStyleIntroduce.value = result
    }, (result) => {
      console.log(result)
      toast('完成输出', 'info')
      styleUiStatus.value.isUpdating = false
    })
  }

  async function onGenerateVoice() {
    // console.log('onGenerateVoice')
    if (confirm('生成语音会覆盖原有语音, 是否继续?')) {
      uiStatus.value.isLoading = true
      areaIntroduceQueriable.value!.set('voice', '')
      const ret = await text2Voice(currentStyleIntroduce.value, currentChatStyle.value.voiceType)
      console.log(ret.url)
      areaIntroduceQueriable.value!.set('voice', ret.url)
      await areaIntroduceQueriable.value!.save()
      uiStatus.value.isLoading = false
      toast('生成语音完成')
    }
  }

  return {
    chatStyles,
    styleVisible,
    styleUiStatus,
    propmtObject,
    currentChatStyle,
    currentStyleIntroduce,
    onGenerateStyleIntroduce,
    onUpdateStyleIntroduce,
    onUseStyleIntroduce,
    onGenerateVoice,
    areaIntroduceQueriable,
  }
}