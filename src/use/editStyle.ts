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
  const currentStyleDescription = ref('')
  let areaIntroduceQueriable = ref<AV.Queriable>()

  async function getChatStyle() {
    const cs = await lc.read('ChatStyle', q => {
      q.ascending('sort')
    })
    chatStylesQueriable.value = cs
  }
  getChatStyle()

  async function onGenerateStyleDescription(chatStyle: ChatStyle, index: number) {
    // console.log(chatStyle)
    styleVisible.value = true
    if (areaIntroduceQueriable.value && areaIntroduceQueriable.value.get('chatStyle').id === chatStyle.objectId) return
    const lcArea = lc.createObject('Area', form.value.objectId)
    const ret = await lc.one('AreaIntroduce', q => {
      q.equalTo('chatStyle', chatStyle)
      q.equalTo('area', lcArea)
      q.include('chatStyle')
    })
    if (ret) {
      areaIntroduceQueriable.value = ret
      currentStyleDescription.value = areaIntroduceQueriable.value.get('description')
    } else {
      areaIntroduceQueriable.value = new lc.AV.Object('AreaIntroduce')
      areaIntroduceQueriable.value.set('chatStyle', chatStylesQueriable.value[index])
      areaIntroduceQueriable.value.set('area', lcArea)
      areaIntroduceQueriable.value.set('user', lc.currentUser())
      onUpdateStyleDescription()
    }
  }

  async function onUseStyleDescription() {
    console.log('onUseStyleDescription')
    // lc.update()
    if (areaIntroduceQueriable.value) {
      areaIntroduceQueriable.value.set('description', currentStyleDescription.value)
      await areaIntroduceQueriable.value.save()
      ElMessage.success('更新完成')
    }

  }

  function onUpdateStyleDescription() {
    const chatStyle = areaIntroduceQueriable.value!.get('chatStyle').toJSON()
    console.log('onUpdateStyleDescription')
    console.log(areaIntroduceQueriable.value)
    currentStyleDescription.value = ''
    const content = `${chatStyle.previousPrompt}${form.value.description}${chatStyle.tailPrompt}`
    doCompletions(content, result => {
      currentStyleDescription.value = result
    }, (result) => {
      console.log(result)
      ElMessage.info('完成输出')
    })
  }

  async function onGenerateVoice() {
    console.log('onGenerateVoice')
    ElMessageBox.confirm('生成语音会覆盖原有语音, 是否继续?', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        const loading = ElLoading.service({ text: '生成语音中...', fullscreen: true })
        areaIntroduceQueriable.value!.set('voice', '')
        const ret = await text2Voice(currentStyleDescription.value)
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
    currentStyleDescription,
    onGenerateStyleDescription,
    onUpdateStyleDescription,
    onUseStyleDescription,
    onGenerateVoice,
    areaIntroduceQueriable,
  }
}