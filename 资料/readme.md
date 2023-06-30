# 资料

## @fingerprintjs/fingerprintjs(详细的资料在代码库中)

1. architecture(计算机硬件指令集架构区别，位于硬件层)
   x86/x86-64 是一种计算机架构，它的浮点指令在没有 NaN 参数但产生 NaN 输出时，输出的 NaN 具有符号位设置。这与大多数其他架构不同。这种特性可以通过两个无穷大相减来区分 x86/x86-64 和其他架构，因为根据 IEEE 754 标准，两个无穷大相减必须产生 NaN。更多信息：https://en.wikipedia.org/wiki/X86_instruction_listings、https://www.intel.com/content/dam/develop/external/us/en/documents/floating-point-reference-sheet-v2-13.pdf、https://codebrowser.bddppq.com/pytorch/pytorch/third_party/XNNPACK/src/init.c.html#79

2. audio(未压缩声音的浮点值数组的和，取决于硬件和操作系统)

3. canvas(硬件层、操作系统层、应用层、浏览器层；画一个图像的像素点位置不同。Web 浏览器、操作系统、显卡和其他因素而异)
4. colorDepth(硬件级别的，但是也受浏览器影响)
   window.screen.colorDepth 返回屏幕的颜色深度。颜色深度是指每个像素可以显示的不同颜色数。例如，如果颜色深度为 8 位，则每个像素可以显示 256 种不同的颜色。如果用户代理不知道颜色深度或出于隐私考虑不想返回它，则应返回 24。已知一些不符合规范的实现会返回 32 而不是 24。更多信息：https://drafts.csswg.org/cssom-view/#the-screen-interface
5. colorGamut(硬件级别)
   CSS 媒体功能用于根据用户代理和输出设备支持的大致色域范围应用 CSS 样式，一共三个值，简单来讲就是代表颜色多少个
6. contrast(用户级别)
   CSS 媒体功能用于检测用户是否请求以较低或较高的对比度呈现 Web 内容，色彩对比度，安卓下谷歌不支持
7. cookiesEnabled(用户级别的)
   cookie 能否访问，浏览器开启隐私模式,或者单独设置浏览器的 cookie 选项的设置，就不能访问操作 cookie 了
8. cpuClass(硬件层的)
   navigator.cpuClass 返回一个标识当前操作系统的字符串，例如`WindowsCE x.y`,`Intel Mac OS X`,但是已经被弃用了
9. deviceMemory(需要时 Https 中可用，硬件层)
   设备内存容量，但是为了减少指纹，返回的是不精确的数字。更多信息：https://developer.mozilla.org/en-US/docs/Web/API/Navigator/deviceMemory
10. domBlockers(用户级别)
    暂时未知
11. fontPreferences(用户级别)
    浏览器缩放级别指的是在网页浏览器中调整网页内容显示大小的设置。当你调整浏览器缩放级别时，网页上的文字、图像和其他元素会相应地放大或缩小，以适应你的屏幕大小或视力需求。

    通常情况下，浏览器缩放级别以百分比表示，例如 100%表示正常大小，200%表示放大到原始大小的两倍，50%表示缩小到原始大小的一半，依此类推。

    调整浏览器缩放级别可以帮助你更好地阅读网页内容，尤其是当网页上的文字太小或太大，或者当你需要在较小的屏幕上浏览网页时。不同的浏览器可能具有不同的缩放功能和快捷键设置，但一般可以在浏览器菜单或设置中找到相关选项。

12. fonts(用户级别的，因为，用户可以增加字体，甚至别的网站或者 app 就可以增加字体)
    检测有多少中字体
13. forcedColors(用户级别)
    forced-colors（强制颜色）是一种 Web 技术，旨在改善可访问性，使视力受损或色盲的用户能够更好地浏览网页内容。它是 W3C Web Accessibility Initiative（WAI）的一部分，并在 CSS Color Module Level 5 中定义。
    forced-colors 允许网页开发者通过应用一组强制的颜色样式规则来覆盖用户设备的默认颜色设置。这些规则可以强制更高的对比度、更鲜明的颜色或其他可访问性相关的调整，以确保页面内容在不同的视觉环境中更易于阅读和理解。

    对于 macOS 操作系统：
    点击左上角的苹果图标，然后选择“系统偏好设置”（System Preferences）。
    点击“显示器”（Displays）选项。
    在顶部的选项卡中，选择“辅助功能”（Accessibility）。
    在左侧导航栏中，选择“显示”（Display）。
    在右侧的“显示选项”（Display Options）中，选择“强制颜色”（Force Colours）。

14. hardwareConcurrency(硬件层)
    可用于运行在用户的计算机上的线程的逻辑处理器的数量。
    现代计算机的 CPU 中有多个物理处理器内核（通常是两个或四个内核），但每个物理内核通常还可以使用高级调度技术一次运行多个线程。例如，一个四核 CPU 可以提供八个 逻辑处理器核心。逻辑处理器内核的数量可用于衡量无需上下文切换即可有效同时运行的线程数量。
15. hdr(硬件层)
    表示用户代理和输出设备支持的最大亮度、颜色深度和对比度的组合。
16. indexedDB(浏览器级别)
    是否具备 indexedDB 功能
17. inverted-colors(用户级别)
    CSS 媒体功能用于测试用户代理或底层操作系统是否已反转所有颜色

    对于 macOS 操作系统：
    点击左上角的苹果图标，然后选择“系统偏好设置”（System Preferences）。
    点击“显示器”（Displays）选项。
    在顶部的选项卡中，选择“辅助功能”（Accessibility）。
    在左侧导航栏中，选择“显示”（Display）。
    在右侧的“显示选项”（Display Options）中，选择“反色”（Invert）。

18. languages(用户级别)
    浏览器的语言
19. localStorage(用户级别)
    隐私设置可以更改

20. math(操作系统级别)
    math 类现在公开了多个数学函数的高精度版本。如果这些是特定于操作系统的，则它们可能是可指纹识别的。
21. monochrome(浏览器级别)
    CSS 媒体功能可用于测试输出设备的单色帧缓冲区 ​​ 中每个像素的位数。"Monochrome"一词是用来描述一种特定类型的浏览器，而不是指 Chrome 浏览器的某个特定设置或外观选项。

22. openDatabase(浏览器级别)
    window.openDatabase 创建一个本地的 SQLite 数据库,indexedDB 是 NoSQL 数据库,两种不同的技术
23. oscpu(硬件级别，已被废弃)
    navigator.oscpu 返回一个字符串，表示正在使用的操作系统及其版本。可以使用 userAgent 代替
24. pdfViewerEnabled(浏览器级别)
    navigator.pdfViewerEnabled 用于指示浏览器是否支持内置的 PDF 查看器
25. platform(硬件层)
    navigator.platform 返回`MacIntel`,`iPad`,`iphone`
26. plugins(用户级别、浏览器级别)
    navigator.plugins
27. reducedMotion(用户级别，浏览器和操作系统都能修改)
    CSS 媒体功能用于检测用户是否已在其设备上启用设置以最小化不必要的动作量。该设置用于向设备上的浏览器传达用户更喜欢移除、减少或替换基于运动的动画的界面。prefers-reduced-motion
28. screenFrame(操作系统,用户级别，通常全屏和非全屏的时候会有差异)
    用户屏幕上可用于显示内容的区域的顶部位置。它考虑了系统任务栏、浏览器工具栏或其他系统级组件的高度，并给出了可用于内容显示的顶部边界位置。

    有时可用的屏幕分辨率会发生一些变化，例如 1900x1440→ 1900x1439.一个可能的原因：macOS Dock 当空间太小时，缩小以容纳更多图标。四舍五入用于减少差异。

29. screenResolution(硬件级别)
    屏幕宽高
30. sessionStorage(浏览器级别)
    sessionStorage 能不能用
31. timezone(操作系统级别，用户级别)
    时区
32. touchSupport(浏览器级别)
    支不支持 tocuh 事件
33. vendor(浏览器级别)
    浏览器的供应商或厂商信息
34. vendorFlavors(浏览器级别)
    检查特定于浏览器（而非特定于引擎）的全局变量，以区分具有相同引擎的浏览器。
35. videoCard(硬件级别)
    显卡驱动程序名称

## 对于设备来讲，稳定性分析

1. 稳定
   - architecture
   - audio
   - colorDepth
   - colorGamut
   - cpuClass
   - deviceMemory
   - hardwareConcurrency
   - hdr
   - math
   - oscpu
   - platform
   - screenResolution
   - videoCard
2. 相对稳定
   - canvas
   - contrast
   - cookiesEnabled
   - forcedColors
   - indexedDB
   - languages
   - localStorage
   - monochrome
   - openDatabase
   - pdfViewerEnabled
   - plugins
   - sessionStorage
   - vendor
   - vendorFlavors
3. 不稳定
   - domBlockers
   - fontPreferences
   - fonts
   - inverted-colors
   - reducedMotion
   - screenFrame
   - timezone

## 相关

1. 计算机系统分层：

   - 应用层：应用程序
   - 操作系统层：操作系统
   - 硬件层：硬件
     - 指令集架构层：x86/x86-64

2. [Web Audio API 如何用于音频指纹识别](https://fingerprint.com/blog/audio-fingerprinting/)
