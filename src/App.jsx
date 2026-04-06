import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Menu, X, TrendingUp, Sparkles, ExternalLink, Copy, Check, Star, ChevronRight, Home, MessageCircle, Palette, Film, Code, Music, PenTool, ArrowRight } from 'lucide-react'
import { categories, hotSearch } from './data/tools'

function App() {
  const [activeCategory, setActiveCategory] = useState('chat')
  const [searchQuery, setSearchQuery] = useState('')
  const [copied, setCopied] = useState(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const searchRef = useRef(null)

  // 全局搜索（跨所有分类）
  const globalSearchResults = searchQuery.trim()
    ? categories.flatMap(cat =>
        cat.tools
          .filter(tool =>
            tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
          )
          .map(tool => ({ ...tool, category: cat }))
      )
    : []

  // 热门搜索点击
  const handleHotSearch = (item) => {
    setSearchQuery(item)
    setShowSuggestions(false)
  }

  // 点击外部关闭搜索建议
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleCopy = (name, e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(name)
    setCopied(name)
    setTimeout(() => setCopied(null), 1500)
  }

  const currentCategory = categories.find(c => c.id === activeCategory)

  // 搜索高亮关键词
  const HighlightText = ({ text, query }) => {
    if (!query.trim()) return text
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase()
        ? <span key={i} className="bg-primary-500/30 text-primary-300 rounded px-0.5">{part}</span>
        : part
    )
  }

  // 底部导航图标映射
  const bottomNavItems = [
    { id: 'home', icon: Home, label: '首页' },
    { id: 'chat', icon: MessageCircle, label: 'AI聊天' },
    { id: 'image', icon: Palette, label: 'AI绘画' },
    { id: 'video', icon: Film, label: 'AI视频' },
    { id: 'code', icon: Code, label: 'AI编程' },
    { id: 'audio', icon: Music, label: 'AI音频' },
    { id: 'writing', icon: PenTool, label: 'AI写作' },
  ]

  return (
    <div className="min-h-screen relative pb-20 md:pb-0">
      {/* 背景动画 */}
      <div className="bg-animation"></div>

      {/* 顶部导航 */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-2xl">🦞</div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold gradient-text">MiaoAI</h1>
              <p className="text-xs text-gray-400 -mt-0.5">AI工具导航</p>
            </div>
          </div>

          {/* 搜索框 */}
          <div className="flex-1 max-w-xl relative" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索工具名称、描述或标签..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full bg-dark-800/60 border border-dark-600 rounded-full py-2.5 pl-10 pr-10 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setShowSuggestions(false) }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-dark-700 transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-gray-400" />
                </button>
              )}
            </div>

            {/* 搜索建议下拉 */}
            <AnimatePresence>
              {showSuggestions && searchQuery.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute top-full left-0 right-0 mt-2 glass rounded-2xl border border-dark-600 overflow-hidden shadow-2xl z-50"
                >
                  {globalSearchResults.length > 0 ? (
                    <>
                      <div className="px-4 py-2 text-xs text-gray-500 border-b border-dark-700 flex items-center justify-between">
                        <span>找到 {globalSearchResults.length} 个结果</span>
                        <span className="text-primary-400">全站搜索</span>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {globalSearchResults.slice(0, 8).map((tool, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setActiveCategory(tool.category.id)
                              setSearchQuery(tool.name)
                              setShowSuggestions(false)
                            }}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-dark-800/80 transition-colors text-left border-b border-dark-700/50 last:border-0"
                          >
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${tool.category.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                              {tool.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-white truncate">
                                <HighlightText text={tool.name} query={searchQuery} />
                              </div>
                              <div className="text-xs text-gray-500 truncate flex items-center gap-1">
                                <span className="text-xs">{tool.category.icon}</span>
                                <span>{tool.category.name}</span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="px-4 py-8 text-center text-gray-400 text-sm">
                      <div className="text-3xl mb-2">🔍</div>
                      未找到相关工具
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* 未输入时的热门搜索建议 */}
            <AnimatePresence>
              {showSuggestions && !searchQuery.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute top-full left-0 right-0 mt-2 glass rounded-2xl border border-dark-600 overflow-hidden shadow-2xl z-50"
                >
                  <div className="px-4 py-2 text-xs text-gray-500 border-b border-dark-700 flex items-center gap-1.5">
                    <TrendingUp className="w-3 h-3" /> 热门搜索
                  </div>
                  <div className="p-3 flex flex-wrap gap-2">
                    {hotSearch.map((item) => (
                      <button
                        key={item}
                        onClick={() => handleHotSearch(item)}
                        className="px-3 py-1.5 glass rounded-full text-xs text-gray-300 hover:text-white hover:border-primary-500 transition-all"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="hidden md:inline text-xs text-gray-500">发现200+ AI工具</span>
            <a href="https://miaoai.cn" className="hidden md:inline text-sm text-gray-400 hover:text-white transition-colors">关于我们</a>
          </div>
        </div>
      </header>

      <div className="pt-16 flex max-w-7xl mx-auto">

        {/* 左侧分类导航 - 桌面端 */}
        <nav className="w-56 fixed left-0 top-16 bottom-0 overflow-y-auto p-4 hidden md:block">
          <div className="space-y-1.5">
            {categories.map(category => (
              <motion.button
                key={category.id}
                onClick={() => { setActiveCategory(category.id); setSearchQuery('') }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : 'text-gray-400 hover:bg-dark-800 hover:text-white'
                }`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-xl">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
                <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full ${
                  activeCategory === category.id ? 'bg-white/20' : 'bg-dark-700'
                }`}>
                  {category.tools.length}
                </span>
              </motion.button>
            ))}
          </div>
        </nav>

        {/* 右侧内容区 */}
        <main className="flex-1 md:ml-56 p-4 md:p-6 relative z-10">

          {/* 搜索模式下的全站结果 */}
          {searchQuery.trim() && globalSearchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="px-3 py-1.5 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  全站搜索结果
                </div>
                <span className="text-gray-500 text-sm">"{searchQuery}" 找到 {globalSearchResults.length} 个工具</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {globalSearchResults.map((tool, index) => (
                  <motion.div
                    key={`${tool.name}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="tool-card glass rounded-xl p-4 cursor-pointer group"
                    onClick={() => window.open(tool.url, '_blank')}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${tool.category.color} flex items-center justify-center text-white text-xs font-bold`}>
                          {tool.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-sm group-hover:text-primary-400 transition-colors">
                            <HighlightText text={tool.name} query={searchQuery} />
                          </h3>
                          <span className="text-xs text-gray-500">{tool.category.icon} {tool.category.name}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleCopy(tool.name, e)}
                        className="p-1.5 rounded-lg hover:bg-dark-700 transition-colors"
                      >
                        {copied === tool.name ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                      </button>
                    </div>
                    <p className="text-gray-400 text-xs line-clamp-2 mb-2">
                      <HighlightText text={tool.desc} query={searchQuery} />
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {tool.tags.slice(0, 3).map(tag => (
                        <span key={tag} className={`text-xs px-1.5 py-0.5 rounded-full ${
                          tag === '国产' ? 'bg-green-500/20 text-green-400' :
                          tag === '国际' ? 'bg-blue-500/20 text-blue-400' :
                          tag === '免费' ? 'bg-purple-500/20 text-purple-400' :
                          tag === '付费' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-dark-600 text-gray-400'
                        }`}>{tag}</span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 热门搜索 - 非搜索模式显示 */}
          {!searchQuery.trim() && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-primary-400" />
                <span className="text-gray-300 font-medium text-sm">热门搜索</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {hotSearch.map((item, index) => (
                  <motion.button
                    key={item}
                    onClick={() => handleHotSearch(item)}
                    className="px-3 py-1.5 glass rounded-full text-xs text-gray-300 hover:text-white hover:border-primary-500 transition-all flex items-center gap-1.5"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-primary-400 font-medium">{index + 1}</span>
                    <span>{item}</span>
                    <ArrowRight className="w-2.5 h-2.5 text-gray-500" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* 分类标题 */}
          {!searchQuery.trim() && (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5"
            >
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${currentCategory?.color} flex items-center justify-center text-xl shadow-lg`}>
                  {currentCategory?.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{currentCategory?.name}</h2>
                  <p className="text-gray-400 text-xs">
                    共 {currentCategory?.tools?.length} 个工具
                    <span className="ml-2 text-primary-400">
                      {currentCategory?.tools?.filter(t => t.hot).length} 个热门
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* 工具卡片网格 */}
          {!searchQuery.trim() && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <AnimatePresence mode='popLayout'>
                {currentCategory?.tools?.map((tool, index) => (
                  <motion.div
                    key={tool.name}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.04 }}
                    className="tool-card glass rounded-xl p-4 cursor-pointer group relative overflow-hidden"
                    onClick={() => window.open(tool.url, '_blank')}
                  >
                    {/* 分类色条 */}
                    <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${currentCategory?.color}`} />

                    {/* 热门角标 */}
                    {tool.hot && (
                      <div className="absolute top-0 right-0 px-2 py-0.5 text-xs font-medium rounded-bl-lg bg-gradient-to-r from-orange-500 to-red-500 text-white flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" /> 热门
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-2.5 pt-1">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${currentCategory?.color} flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:scale-110 transition-transform`}>
                          {tool.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-sm group-hover:text-primary-300 transition-colors">{tool.name}</h3>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleCopy(tool.name, e)}
                        className="p-1.5 rounded-lg hover:bg-dark-700 transition-colors flex-shrink-0"
                        title="复制名称"
                      >
                        {copied === tool.name ? (
                          <Check className="w-3.5 h-3.5 text-green-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-300" />
                        )}
                      </button>
                    </div>

                    <p className="text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed">{tool.desc}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {tool.tags.map(tag => (
                          <span
                            key={tag}
                            className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                              tag === '国产' ? 'bg-green-500/20 text-green-400' :
                              tag === '国际' ? 'bg-blue-500/20 text-blue-400' :
                              tag === '免费' ? 'bg-purple-500/20 text-purple-400' :
                              tag === '付费' ? 'bg-yellow-500/20 text-yellow-400' :
                              tag === '开源' ? 'bg-cyan-500/20 text-cyan-400' :
                              'bg-dark-600 text-gray-400'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-600 group-hover:text-primary-400 transition-colors flex-shrink-0" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* 无结果提示 */}
          {searchQuery.trim() && globalSearchResults.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-400 mb-2">未找到 "{searchQuery}" 相关工具</p>
              <p className="text-gray-600 text-sm">试试其他关键词</p>
            </motion.div>
          )}

          {/* 分类空状态 */}
          {!searchQuery.trim() && currentCategory?.tools?.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🚧</div>
              <p className="text-gray-400">该分类暂无工具</p>
            </div>
          )}
        </main>
      </div>

      {/* 底部移动端导航 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-dark-600">
        <div className="flex items-center justify-around px-1 py-1">
          {bottomNavItems.map(item => {
            const Icon = item.icon
            const isActive = item.id === 'home' ? activeCategory === 'chat' : activeCategory === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'home') setActiveCategory('chat')
                  else setActiveCategory(item.id)
                  setSearchQuery('')
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all ${
                  isActive ? 'text-primary-400' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'scale-110' : ''} transition-transform`} size={18} />
                <span className="text-xs leading-none">{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* 底部 */}
      <footer className="relative z-10 border-t border-dark-700 mt-8 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🦞</span>
              <span className="gradient-text font-bold">MiaoAI</span>
              <span className="text-gray-600 text-sm">·</span>
              <span className="text-gray-500 text-sm">发现最实用的AI工具</span>
            </div>
            <p className="text-gray-600 text-xs">
              © 2026 MiaoAI.中国 - 让AI触手可及
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
