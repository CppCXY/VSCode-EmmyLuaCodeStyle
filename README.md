# EmmyLuaCodeStyle

## feature
- [x] support lua5.1，lua5.2，lua5.3，lua5.4，luajit
- [x] lua code format
- [x] lua codestyle check
- [x] support unicode character
- [x] support rangeformatting
- [x] format on paste
- [x] support typeformatting
- [x] format on type lineseperater

## 介绍(Introduce)

CN: 该项目是基于C++的lua代码格式化插件。经过长期实践，发现人们对代码格式化的预期是尽可能少的改变自己代码的基本布局，尽可能的优化符号间不合理的空白，可配置的调整不同语句之间的间距。

基于这样的想法，我设计了lua格式化算法并实现了该插件，该插件同时具备代码格式化和代码风格检测，该插件的[格式化算法/语言服务地址](https://github.com/CppCXY/EmmyLuaCodeStyle)

EN: This project is a C++ based lua code formatting plug-in. After long-term practice, it is found that people's expectation of code formatting is to change the basic layout of their code as little as possible, to optimize the unreasonable blank space between symbols as much as possible, and to adjust the spacing between different statements.

Based on this idea, I designed the lua formatting algorithm and realizes the plug-in, the plug-in support code format and check code style at the same time detection, the plugin [formatting algorithm/language server address](https://github.com/CppCXY/EmmyLuaCodeStyle)

## 特别说明(Special note）

CN: 
1. 范围格式化(rangeformatting)的快捷键是ctrl+k+f，同时支持范围格式化后可以设置editor.formatOnPaste支持粘贴代码格式化。

2. 键入字符格式化(typeformatting)仅支持键入换行符时触发，该特性开启需要设置editor.formatOnType。

EN:
1. The shortcut to rangeform formatting is ctrl-k-f, and after supporting range formatting, you can format the paste code supported by editor.formatOnPaste.

2. Type character formatting only supports triggering when typing line breaks, which require setting editor.formatOnType when turned on.


## 配置(Configure)

###  如何配置(How to configure)

CN: 支持通过.editorconfig文件配置项目，.editorconfig文件必须处于项目根目录，如果希望同一项目下不同目录采用不同的配置，那么不同的目录下可以分别添加.editorconfig文件。

EN: Supports the configuration of projects through the .editorconfig file, the .editorconfig file must be at the root of the project, and if you want different configurations for different directories under the same project, you can add .editorconfig files separately under different directories.

### 创建模板配置(Create a template configuration)

CN: 首先创建.edtorconfig文件然后输入Ctrl + shift + p 打开命令窗口，输入insert luaCodeStyle template

EN: First create a .edtorconfig file and then enter Ctrl + shift + p to open the command window and enter insert luaCodeStyle template
## Road Map

- name style check
- check locale
- English document
- support plugin


## 其他平台(Other Platform)

CN:Jetbrain家的IDE由Intellij-EmmyLua(阿唐)实现，其他编辑器不受直接支持，语言服务可以跑在任何支持语言服务的编辑器中，需要自行尝试。

EN:The ide of the jetbrain family is implemented by Intellij-EmmyLua(tangzx), and other editors are not directly supported. Language server can run in any editor that supports language services, and you need to try it yourself.
