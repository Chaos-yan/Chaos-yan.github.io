# 颜孙恒 | 游戏音乐设计师 · 作品集网站

## 🎮 关于本网站

这是一个为游戏音乐设计师颜孙恒定制的专业作品集网站，具有以下特点：

- **🎨 艺术化设计** — 暗色调游戏美学风格，带噪点纹理和网格图案的沉浸式视觉体验
- **🎧 音频播放器** — 内置可视化音频播放器，支持连续播放和曲目切换
- **🎬 视频展示** — 支持视频作品在线预览
- **🌐 双语切换** — 支持中文/English 一键切换
- **📱 响应式设计** — 适配桌面、平板和手机端
- **✏️ 易于编辑** — 所有文字内容集中在 `data/content.json` 中，即可修改

## 🚀 免费部署指南（GitHub Pages）

### 第一步：创建 GitHub 仓库

1. 注册/登录 [GitHub](https://github.com)
2. 点击右上角 **+** → **New repository**
3. 仓库名填写：`yansunheng.github.io`（将 `yansunheng` 替换为你的 GitHub 用户名）
4. 选择 **Public**（公开）
5. 点击 **Create repository**

### 第二步：上传网站文件

```bash
# 在终端中进入网站目录
cd ~/Desktop/portfolio-site

# 初始化 Git 仓库
git init
git add .
git commit -m "初始化作品集网站"

# 关联你的 GitHub 仓库（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/你的用户名.github.io.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 第三步：启用 GitHub Pages

1. 进入仓库 → **Settings** → **Pages**
2. **Source** 选择 `Deploy from a branch`
3. **Branch** 选择 `main`，文件夹选择 `/ (root)`
4. 点击 **Save**
5. 等待 1-2 分钟，访问 `https://你的用户名.github.io` 即可看到网站

> 💡 **完全免费**：GitHub Pages 提供免费托管，无限流量，无需每月付费维护。

## ✏️ 如何修改内容

### 修改文字内容
编辑 `data/content.json` 文件，所有文字都在这里：
- 每个字段通常有 `xxx`（中文）和 `xxx_en`（英文）两个版本
- 修改后保存，刷新网站即可看到更新

### 替换作品文件
1. 将新的音频/视频文件放入 `assets/audio/` 或 `assets/video/` 目录
2. 在 `data/content.json` 中修改对应的文件名、标题和描述
3. 也可以添加全新的作品条目

### 更换海报图片
- 将新图片放入 `assets/images/` 目录
- 在 `data/content.json` 中修改 `poster` 字段指向新图片

### 修改样式
- 颜色变量在 `css/style.css` 开头的 `:root` 中
- 修改 `--accent-gold` 等变量即可改变主题色

## 📁 文件结构

```
portfolio-site/
├── index.html              # 主页面
├── css/
│   └── style.css           # 样式文件
├── js/
│   └── main.js             # 交互逻辑
├── data/
│   ├── content.json        # 📝 可编辑的文字内容（推荐修改此文件）
│   └── content.js          # 自动生成的 JS 数据文件
├── assets/
│   ├── audio/              # 音频文件 (.mp3)
│   ├── video/              # 视频文件 (.mp4)
│   └── images/             # 图片/海报 (.jpg)
└── README.md               # 本说明文件
```

## 🛠 本地预览

如果有 Python 3：

```bash
cd ~/Desktop/portfolio-site
python3 -m http.server 8000
```

然后打开浏览器访问 `http://localhost:8000`

## 📧 联系方式

- Email: 15706778301@163.com
- 电话: 15706778301
