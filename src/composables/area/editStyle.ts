import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import lc from '@/libs/lc';
import type AV from 'leancloud-storage'
import { doCompletions } from '@/utils/llm'
import { text2Voice } from '@/utils/fileHandler'

export function useEditStyle(form: Ref<AreaForm>) {
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

  async function getChatStyle() {
    const cs = await lc.read('ChatStyle', q => {
      q.ascending('sort')
    })
    chatStylesQueriable.value = cs
  }
  getChatStyle()

  async function onGenerateStyleIntroduce(chatStyle: ChatStyle, index: number) {
    // console.log(chatStyle)
    styleVisible.value = true
    if (areaIntroduceQueriable.value && areaIntroduceQueriable.value.get('chatStyle').id === chatStyle.objectId) return
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
      onUpdateStyleIntroduce()
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
      ElMessage.success('更新完成')
    }

  }

  function onUpdateStyleIntroduce() {
    // console.log('onUpdateStyleIntroduce')
    // console.log(areaIntroduceQueriable.value)
    currentStyleIntroduce.value = ''
    const content = `${propmtObject.value.previousPrompt}${form.value.introduce}${propmtObject.value.tailPrompt}`
    doCompletions(content, result => {
      currentStyleIntroduce.value = result
    }, (result) => {
      console.log(result)
      ElMessage.info('完成输出')
    })
  }

  async function onGenerateVoice() {
    // console.log('onGenerateVoice')
    ElMessageBox.confirm('生成语音会覆盖原有语音, 是否继续?', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        const loading = ElLoading.service({ text: '生成语音中...', fullscreen: true })
        areaIntroduceQueriable.value!.set('voice', '')
        const ret = await text2Voice(currentStyleIntroduce.value, currentChatStyle.value.voiceType)
        console.log(ret.url)
        areaIntroduceQueriable.value!.set('voice', ret.url)
        await areaIntroduceQueriable.value!.save()
        loading.close()
        ElMessage.success('生成语音完成')
      })
  }

  return {
    chatStyles,
    styleVisible,
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