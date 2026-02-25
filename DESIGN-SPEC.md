# Lucid Cyber Task Board - 前端开发规范文档

## 设计理念
浅色赛博朋克风格（类似《镜之边缘》或高科技实验室的白皙质感）。动画不应是喧宾夺主的霓虹闪烁，而应该是**精密仪器般的微小位移、呼吸感和数据流动感**。

---

## 1. 核心设计令牌 (Design Tokens)

### 1.1 色彩系统 (Colors)
采用极简浅色底，配合全息高饱和点缀。

| Token 名称 | CSS 变量名 | HEX 值 / 描述 | 用途说明 |
|-----------|-----------|---------------|----------|
| Base Bg | `--color-bg-base` | `#FAFAFC` | 页面全局背景，极浅的灰白色 |
| Card Bg | `--color-bg-card` | `rgba(255, 255, 255, 0.65)` | 卡片和面板底色，配合毛玻璃效果 |
| Border Soft | `--color-border-soft` | `rgba(0, 0, 0, 0.04)` | 卡片和栏目的极细边框 |
| Text Main | `--color-text-main` | `#111111` | 大标题、卡片主标题 |
| Text Muted | `--color-text-muted` | `#8A8A93` | 日期、次要信息、列名称 |
| Neon Purple | `--color-neon-purple` | `#8A2BE2` | 品牌主色、主按钮渐变起点 |
| Neon Blue | `--color-neon-blue` | `#4169E1` | 品牌辅色、主按钮渐变终点、进度条 |
| Status Critical | `--color-status-crit` | `#FF3366` | 紧急任务发光点阵 |
| Status Done | `--color-status-done` | `#00E676` | 完成状态发光点阵 |

### 1.2 排版系统 (Typography)
强调对比度，通过极大的字号和特殊的等宽字体构建"赛博"感。

| 层级 | 字体栈 (Font Family) | 字号 (Size) | 字重 (Weight) | 用途 |
|-----|---------------------|-------------|---------------|------|
| Display | `'Clash Display', sans-serif` | 48px | 600 (Semibold) | 列顶部的统计数字 (镂空描边效果) |
| Heading 1 | `'Clash Display', sans-serif` | 28px | 500 (Medium) | 列名称 (如 Backlog) |
| Heading 2 | `'Space Grotesk', sans-serif` | 20px | 600 (Semibold) | 任务卡片主标题 |
| Mono Data | `'Space Mono', monospace` | 13px | 400 (Regular) | 进度百分比、日期、状态标签 |

### 1.3 阴影与特效 (Effects & Shadows)
摒弃传统大阴影，改用毛玻璃和微光。

- **Glassmorphism (毛玻璃):**
  - CSS: `backdrop-filter: blur(16px) saturate(180%);`
  - 背景: `background: var(--color-bg-card);`

- **Hover Glow (悬浮微光):**
  - CSS: `box-shadow: 0 8px 32px rgba(138, 43, 226, 0.08);` (紫蓝色微光)

- **Text Stroke (数字镂空描边):**
  - CSS: `-webkit-text-stroke: 1px var(--color-text-muted); color: transparent;`

---

## 2. 独立组件规范 (Component Specifications)

### 2.1 顶级容器与布局 (`<BoardLayout />`)
- **结构:** 横向 Flexbox，允许超出屏幕横向滚动，隐藏滚动条。
- **间距:** 列与列之间的 `gap` 设定为 `32px` (`gap-8`)。内边距 `padding: 40px`。
- **背景:** 使用 CSS 绘制一层极淡的 3% 透明度的点阵网格（Dot Grid）作为底层背景。

### 2.2 看板列 (`<BoardColumn />`)
- **头部 (Header):** 采用相对定位 (`position: relative`)。
  - 大数字统计放在标题背后，绝对定位 (`position: absolute; right: 0; top: -10px; z-index: -1`)，使用 Text Stroke 效果。
- **任务容器:** 垂直 Flexbox，`gap: 16px`。
  - 作为拖拽的 `Dropzone`，在 `isDraggingOver` 状态下，不显示虚线框，而是通过改变列的背景色为 `rgba(0,0,0, 0.02)` 并在四周加入极细的内发光。

### 2.3 任务卡片 (`<TaskCard />` - 核心逻辑)
- **形态:** `border-radius: 12px`，但右上角可以使用 CSS `clip-path: polygon(...)` 切掉一个 `8px` 的直角缺口，增加锐利感。
- **内边距:** `padding: 24px`，确保大字号有足够的呼吸空间。
- **顶部信息 (Meta):**
  - 左侧状态：一个 `6px` 的圆形指示灯（如霓虹红），加上大写的等宽字体 `CRITICAL`。
  - 右侧日期：等宽字体，颜色为 Text Muted。
- **标题 (Title):** 设置 `line-clamp: 2` 防止过长破坏布局。行高设为 `1.4`。
- **底部进度 (Progress):**
  - 进度条轨道：高度仅 `2px`，背景为 `Border Soft`。
  - 进度填充：高度 `2px`，使用 Neon Purple 到 Neon Blue 的线性渐变。
  - 百分比数字：右对齐，置于进度条上方，等宽字体，跟随渐变色（可使用 `background-clip: text`）。

---

## 3. 交互与动效规范 (Interaction & Motion)

建议使用 **Framer Motion** 处理复杂的物理弹簧动效。

### 3.1 物理弹簧过渡 (Spring Physics)
全局抛弃线性的 `ease-in-out`，所有状态切换统一使用弹簧曲线：

```js
transition={{ type: "spring", stiffness: 300, damping: 20 }}
```

### 3.2 动态全息边框 (Holographic Hover)
卡片在鼠标悬浮时，实现高光"跟随"鼠标照亮卡片边缘的效果。

**实现逻辑:**
1. 监听卡片的 `onMouseMove` 事件，获取鼠标相对于卡片的 `X` 和 `Y` 坐标。
2. 将坐标传递给 CSS 变量 `--mouse-x` 和 `--mouse-y`。
3. 使用伪元素 (`::before`) 创建一个比卡片大 `2px` 的底层，背景使用基于鼠标坐标的 `radial-gradient`。

### 3.3 拖拽体验 (Drag & Drop)
- **Drag Start:** 卡片被抓起时，立即放大 (`scale: 1.02`)，并产生 `3deg` 到 `5deg` 的 3D 倾斜。阴影加深并带上主色调的模糊光晕。
- **Drop (释放):** 回归原位时使用强弹簧动效（降低 damping），让卡片有"吧嗒"落地的清脆感。

---

## 4. 性能守护准则 (Performance Guardrails)

**必须遵守：**
- **禁用 `background-position` 动画：** 极其消耗 CPU。背景流动需通过对一个超大伪元素执行 `transform: translate3d()` 来实现。
- **禁用高频 `box-shadow` 动画：** 阴影动画会导致严重的性能掉帧。发光呼吸效应用 `opacity` 配合预先渲染好的模糊层来实现。
- **硬件加速开启：** 涉及位移的元素添加 `will-change: transform, opacity;` 或强制开启 3D 加速 `transform: translateZ(0);`。

---

## 5. 动画代码实现

### 5.1 高性能漂移点阵背景 (The Lucid Grid)

```css
/* 容器设置为相对定位，隐藏溢出 */
.board-container {
  position: relative;
  overflow: hidden;
  background-color: #FAFAFC;
  min-height: 100vh;
}

/* 漂移网格伪元素 */
.board-container::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  /* 用径向渐变画微小的全息紫蓝色点阵，透明度极低 (0.04) */
  background-image: radial-gradient(rgba(138, 43, 226, 0.04) 1.5px, transparent 1.5px);
  background-size: 32px 32px;
  /* 开启硬件加速 */
  will-change: transform;
  transform: translateZ(0);
  /* 缓慢平移并无限循环 */
  animation: lucid-drift 60s linear infinite;
  z-index: 0;
  pointer-events: none;
}

@keyframes lucid-drift {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(320px, 320px, 0); }
}
```

### 5.2 赛博风格准星点缀 (CSS Crosshairs)

```css
.cyber-crosshair {
  position: absolute;
  width: 24px;
  height: 24px;
  opacity: 0.3;
}

.cyber-crosshair::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to right, transparent 48%, #4169E1 48%, #4169E1 52%, transparent 52%),
    linear-gradient(to bottom, transparent 48%, #4169E1 48%, #4169E1 52%, transparent 52%);
  animation: pulse-opacity 4s ease-in-out infinite alternate;
}

@keyframes pulse-opacity {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.8; }
}
```

### 5.3 状态标签的"轻微故障"悬浮动效 (Micro-Glitch Hover)

```css
.status-tag {
  position: relative;
  display: inline-block;
  font-family: 'Space Mono', monospace;
  color: #FF3366;
  overflow: hidden;
}

.status-tag:hover::before,
.status-tag:hover::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #FAFAFC;
}

.status-tag:hover::before {
  left: 2px;
  text-shadow: -1px 0 #4169E1;
  clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
  animation: glitch-anim-1 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
}

.status-tag:hover::after {
  left: -2px;
  text-shadow: -1px 0 #FF3366;
  clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
  animation: glitch-anim-2 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite reverse;
}

@keyframes glitch-anim-1 {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 1px); }
  40% { transform: translate(-2px, -1px); }
  60% { transform: translate(2px, 1px); }
  80% { transform: translate(2px, -1px); }
  100% { transform: translate(0); }
}

@keyframes glitch-anim-2 {
  0% { transform: translate(0); }
  20% { transform: translate(2px, -1px); }
  40% { transform: translate(2px, 1px); }
  60% { transform: translate(-2px, -1px); }
  80% { transform: translate(-2px, 1px); }
  100% { transform: translate(0); }
}
```

### 5.4 信号扫描线 (Subtle Scanlines)

```css
.scanline-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
}

.scanline-overlay::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 4px;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(138, 43, 226, 0.03),
    transparent
  );
  animation: scan-move 6s linear infinite;
}

@keyframes scan-move {
  0% { transform: translateY(-100vh); }
  100% { transform: translateY(100vh); }
}
```

### 5.5 动态全息边框组件 (React)

```tsx
'use client';
import { useState, useRef, MouseEvent } from 'react';

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
}

export function HolographicCard({ children, className = '' }: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        '--mouse-x': `${mousePos.x}px`,
        '--mouse-y': `${mousePos.y}px`,
      } as React.CSSProperties}
    >
      {/* 全息光效层 */}
      <div
        className="absolute -inset-[2px] rounded-xl opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(
            300px circle at var(--mouse-x) var(--mouse-y),
            rgba(138, 43, 226, 0.15),
            rgba(65, 105, 225, 0.1),
            transparent 60%
          )`,
        }}
      />
      {/* 卡片内容 */}
      <div className="relative bg-white/65 backdrop-blur-md rounded-xl border border-black/[0.04]">
        {children}
      </div>
    </div>
  );
}
```

---

## 6. 文件结构建议

```
src/
├── components/
│   ├── board/
│   │   ├── BoardLayout.tsx
│   │   ├── BoardColumn.tsx
│   │   └── TaskCard.tsx
│   ├── ui/
│   │   ├── HolographicCard.tsx
│   │   ├── StatusTag.tsx
│   │   ├── ProgressBar.tsx
│   │   └── Crosshair.tsx
│   └── effects/
│       ├── LucidGrid.tsx
│       └── ScanlineOverlay.tsx
├── styles/
│   ├── globals.css
│   ├── design-tokens.css
│   └── animations.css
└── hooks/
    └── useMousePosition.ts
```

---

## 7. 实施优先级

### P0 - 必须实现
- [ ] 设计令牌 CSS 变量
- [ ] 漂移点阵背景 (Lucid Grid)
- [ ] 任务卡片基础样式
- [ ] 全息边框悬浮效果
- [ ] 毛玻璃效果

### P1 - 推荐实现
- [ ] 弹簧物理动效 (Framer Motion)
- [ ] 拖拽体验优化
- [ ] 状态标签 Glitch 效果
- [ ] 准星装饰

### P2 - 可选实现
- [ ] 扫描线效果
- [ ] 卡片右上角缺角
- [ ] 进度条渐变文字

---

## 8. 字体加载

```html
<!-- 在 head 中加载 Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
```

对于 Clash Display，需要从 fontshare.com 下载或使用类似的免费替代。

---

*文档版本: v1.0 | 2026-02-25*
