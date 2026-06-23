<template>
  <div class="ai-chat">
    <!-- 浮动按钮 -->
    <button class="chat-toggle" :class="{ active: visible }" @click="visible = !visible">
      <svg v-if="!visible" width="22" height="22" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>

    <!-- 聊天弹窗 -->
    <transition name="chat-slide">
      <div v-if="visible" class="chat-panel">
        <div class="chat-header">
          <span class="chat-header-icon">墨</span>
          <span class="chat-header-title">AI 文化助手</span>
        </div>

        <div class="chat-body" ref="bodyRef">
          <div v-if="!messages.length" class="chat-welcome">
            <div class="welcome-icon">问</div>
            <p class="welcome-text">您好！我是传统文化 AI 助手。<br/>您可以问我关于古籍、文物、书画、历史等方面的问题。</p>
            <div class="suggestions">
              <button v-for="q in suggestions" :key="q" class="suggestion-btn"
                      @click="send(q)" :disabled="sending">
                {{ q }}
              </button>
            </div>
          </div>
          <div v-for="(msg, i) in messages" :key="i"
               class="msg" :class="msg.role">
            <div class="msg-avatar">{{ msg.role === 'user' ? '我' : '墨' }}</div>
            <div class="msg-content">
              <span v-if="msg.role === 'assistant' && msg.streaming" class="streaming-text">{{ msg.content }}<span class="cursor-blink">|</span></span>
              <template v-else>{{ msg.content }}</template>
            </div>
          </div>
          <div v-if="sending && !streamingMsg" class="msg assistant">
            <div class="msg-avatar">墨</div>
            <div class="msg-content typing">
              <span class="dot" /><span class="dot" /><span class="dot" />
            </div>
          </div>
        </div>

        <div class="chat-footer">
          <input
            v-model="inputText"
            class="chat-input"
            placeholder="输入你的问题..."
            @keydown.enter="send(inputText)"
            :disabled="sending"
          />
          <button class="send-btn" @click="send(inputText)" :disabled="!inputText.trim() || sending">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { ElMessage } from 'element-plus'

const visible = ref(false)
const inputText = ref('')
const sending = ref(false)
const streamingMsg = ref(false)
const bodyRef = ref<HTMLDivElement>()
const messages = ref<{ role: string; content: string; streaming?: boolean }[]>([])

const suggestions = [
  '青花瓷有什么特点？',
  '请介绍一下王羲之',
  '敦煌石窟的历史',
  '宋词和唐诗的区别',
]

const scrollToBottom = async () => {
  await nextTick()
  if (bodyRef.value) {
    bodyRef.value.scrollTop = bodyRef.value.scrollHeight
  }
}

const send = async (text: string) => {
  const msg = text.trim()
  if (!msg || sending.value) return
  inputText.value = ''

  messages.value.push({ role: 'user', content: msg })
  sending.value = true
  streamingMsg.value = false
  await scrollToBottom()

  try {
    const token = localStorage.getItem('token')
    const resp = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ message: msg }),
    })

    if (!resp.ok) {
      const errData = await resp.json().catch(() => null)
      throw new Error(errData?.message || `请求失败 (${resp.status})`)
    }

    // 创建助手消息占位，流式追加内容
    const assistantIdx = messages.value.length
    messages.value.push({ role: 'assistant', content: '', streaming: true })
    streamingMsg.value = true
    await scrollToBottom()

    const reader = resp.body!.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || '' // 保留不完整的行

      for (const line of lines) {
        if (!line.startsWith('data:')) continue
        const dataStr = line.slice(5).trim()
        if (dataStr === '[DONE]') continue

        try {
          const data = JSON.parse(dataStr)
          if (data.error) {
            throw new Error(data.error)
          }
          if (data.content) {
            messages.value[assistantIdx].content += data.content
            await scrollToBottom()
          }
        } catch (e) {
          // 非 JSON 行跳过
        }
      }
    }

    // 流结束，移除 streaming 标记
    messages.value[assistantIdx].streaming = false
    streamingMsg.value = false
  } catch (e: any) {
    // 如果已有流式消息但出错，标记结束
    const lastMsg = messages.value[messages.value.length - 1]
    if (lastMsg && lastMsg.role === 'assistant' && lastMsg.streaming) {
      lastMsg.streaming = false
      if (!lastMsg.content) {
        messages.value.pop()
      }
    }
    streamingMsg.value = false
    ElMessage.error(e.message || '问答服务暂不可用')
  } finally {
    sending.value = false
    await scrollToBottom()
  }
}
</script>

<style scoped lang="scss">
.ai-chat {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.chat-toggle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #c23b22, #8b1a1a);
  color: #f5f0eb;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(194, 59, 34, 0.35);
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(194, 59, 34, 0.45);
  }
  &.active {
    background: #5c3a2e;
  }
}

.chat-panel {
  position: absolute;
  bottom: 56px;
  right: 0;
  width: 360px;
  height: 520px;
  background: #faf6f0;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(194, 59, 34, 0.15);
}

.chat-header {
  background: linear-gradient(135deg, #2c1810, #3d2317);
  color: #f5f0eb;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 1px;

  .chat-header-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: rgba(245, 240, 235, 0.15);
    border-radius: 6px;
    font-size: 13px;
  }
}

.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #c9a96e; border-radius: 2px; }
}

.chat-welcome {
  text-align: center;
  padding: 24px 0;
  .welcome-icon {
    width: 48px;
    height: 48px;
    margin: 0 auto 12px;
    background: linear-gradient(135deg, #c23b22, #8b1a1a);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #f5f0eb;
    font-size: 20px;
  }
  .welcome-text {
    color: #6b5a4e;
    font-size: 13px;
    line-height: 1.6;
    margin-bottom: 16px;
  }
  .suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
  }
  .suggestion-btn {
    padding: 6px 12px;
    border: 1px solid rgba(194, 59, 34, 0.25);
    border-radius: 16px;
    background: rgba(245, 240, 235, 0.8);
    color: #5c3a2e;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
    &:hover { border-color: #c23b22; background: rgba(194, 59, 34, 0.08); }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }
}

.msg {
  display: flex;
  gap: 8px;
  max-width: 85%;
  &.user { align-self: flex-end; flex-direction: row-reverse; }
  &.assistant { align-self: flex-start; }

  .msg-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    flex-shrink: 0;
  }
  &.user .msg-avatar {
    background: #c23b22;
    color: #f5f0eb;
  }
  &.assistant .msg-avatar {
    background: #2c1810;
    color: #f5f0eb;
  }

  .msg-content {
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 13px;
    line-height: 1.6;
    word-break: break-word;
  }
  &.user .msg-content {
    background: rgba(194, 59, 34, 0.1);
    color: #3d2317;
    border-bottom-right-radius: 2px;
  }
  &.assistant .msg-content {
    background: #fff;
    color: #3d2317;
    border: 1px solid rgba(44, 24, 16, 0.08);
    border-bottom-left-radius: 2px;
  }
}

.typing {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 8px 16px !important;
  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #c9a96e;
    animation: bounce 1.4s infinite ease-in-out;
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
}

.cursor-blink {
  animation: blink 0.8s step-end infinite;
  color: #c23b22;
  font-weight: 300;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}

.chat-footer {
  display: flex;
  gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  background: #f5f0eb;
}

.chat-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  background: #fff;
  font-size: 13px;
  color: #3d2317;
  outline: none;
  transition: border-color 0.2s;
  &:focus { border-color: #c23b22; }
  &::placeholder { color: #a09080; }
}

.send-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: #c23b22;
  color: #f5f0eb;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
  &:hover:not(:disabled) { background: #a8321d; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
}

.chat-slide-enter-active,
.chat-slide-leave-active {
  transition: all 0.3s ease;
}
.chat-slide-enter-from,
.chat-slide-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.95);
}
</style>
