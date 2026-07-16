# MiaoAI - AI 工具导航平台

精选全球 90+ 优质 AI 工具，涵盖 AI 聊天、绘画、视频、编程、音频、写作。

## 功能特点

- **AI 工具分类** - 6 大类别，快速找到合适工具
- **搜索功能** - 按名称/描述搜索工具
- **深色模式** - 支持明暗主题切换
- **AI 资讯** - 侧边栏展示最新 AI 动态
- **工具提交** - 用户可提交新工具
- **PWA 支持** - 可添加到手机桌面
- **响应式设计** - 适配桌面和移动端

## 技术栈

- **前端**: 纯 HTML + CSS + JavaScript（零框架依赖）
- **统计**: 51.la
- **PWA**: Service Worker + manifest.json
- **SEO**: sitemap.xml, robots.txt, Schema.org 结构化数据

## 本地运行

直接用浏览器打开 `index.html` 即可：

```bash
# 或使用本地服务器
python -m http.server 8000
# 访问 http://localhost:8000
```

## 项目结构

```
miaoai-website/
├── index.html        # 主页
├── about.html        # 关于页
├── news.html         # AI 资讯页
├── submit.html       # 工具提交页
├── style.css         # 样式
├── app.js            # 交互逻辑
├── sw.js             # Service Worker
├── manifest.json     # PWA 配置
├── sitemap.xml       # 站点地图
├── robots.txt        # 爬虫配置
└── data/             # 工具数据
```

## 部署

静态网站，可部署到任何静态托管服务（Vercel、Netlify、GitHub Pages 等）。

## SEO

- 百度站长验证已配置
- Open Graph / Twitter Card 标签
- Schema.org 结构化数据
- sitemap.xml 自动生成

## 许可证

Private - KAKI.llc