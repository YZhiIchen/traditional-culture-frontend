function monitorExistingEventListeners() {
  console.log('🎯 监控已有事件监听器...')

  if (typeof getEventListeners !== 'function') {
    console.error('❌ API getEventListeners 不可用')
    return
  }

  // 监控的目标元素
  const targets = [window, document]

  targets.forEach(target => {
    const listeners = getEventListeners(target)
    const eventTypes = Object.keys(listeners)

    console.log(`📋 ${target === window ? 'window' : 'document'} 事件:`)

    eventTypes.forEach(eventType => {
      const eventListeners = listeners[eventType]

      console.log(`   📍 ${eventType}: ${eventListeners.length} 个监听器`)

      eventListeners.forEach((listenerInfo, index) => {
        // 替换监听器
        const originalListener = listenerInfo.listener

        const wrappedListener = function (...args) {
          console.log(`📢 [${eventType}] 触发`)
          console.log(`       函数: ${listenerInfo.listener.toString()}.`)

          // 执行原始监听器
          return originalListener.apply(this, args)
        }

        // 移除原监听器，添加包装后的监听器
        target.removeEventListener(eventType, originalListener, listenerInfo.useCapture)
        target.addEventListener(eventType, wrappedListener, listenerInfo.useCapture)
      })
    })
  })

  console.log('✅ 已有事件监听器监控已启动')
}

// 立即执行
monitorExistingEventListeners()

