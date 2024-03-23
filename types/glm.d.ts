type GLMCharacterMeta = {
  user_info: string
  bot_info: string
  bot_name: string
  user_name?: string
}

type GlmMessage = {
  content: string
  role: 'user' | 'assistant' | 'system'
}

type GlmTools = {
  type: string
  retrieval: {
    knowledge_id: string
  }
}