type GLM6BMessage = { role: 'user' | 'assistant', content: string }
type GLM6BRequestInterface = { messages: GLM6BMessage[], user_id: string }

type GLM130BMessage = { role: 'user' | 'assistant', content: string }
type GLM130BRequestInterface = { messages: GLM130BMessage[], user_id: string }


type GLMCharacterMeta = {
  user_info: string
  bot_info: string
  bot_name: string
  user_name?: string
}

type GLMMessage = {
  content: string, role: 'user' | 'assistant' | 'system'
}