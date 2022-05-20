# EmmyLuaCodeStyle

## feature
- [x] support lua5.1，lua5.2，lua5.3，lua5.4，luajit
- [x] lua module auto import and quickly fix
- [x] lua code reformat/range reformat/type format
- [x] lua code style check/lua name style check
- [x] lua identify spell check
- [x] support unicode character
- [x] English document
- [x] fast and low memory 
- [x] support windows/linux/macosx/macosx m1

## 介绍(Introduce)

CN: 

该插件是基于C++的lua代码格式化插件。经过长期实践，发现人们对代码格式化的预期是尽可能少的改变自己代码的基本布局，尽可能的优化符号间不合理的空白，可配置的调整不同语句之间的间距。

基于这样的想法，我设计了lua格式化算法并实现了该插件，该插件同时具备代码格式化和代码风格检测，该插件的[格式化算法/语言服务地址](https://github.com/CppCXY/EmmyLuaCodeStyle)

EN: 

This plugin is a C++ based lua code formatting plug-in. After long-term practice, it is found that people's expectation of code formatting is to change the basic layout of their code as little as possible, to optimize the unreasonable blank space between symbols as much as possible, and to adjust the spacing between different statements.

Based on this idea, I designed the lua formatting algorithm and realizes the plug-in, the plug-in support code format and check code style at the same time detection, the plugin [formatting algorithm/language server address](https://github.com/CppCXY/EmmyLuaCodeStyle)

## 特别说明(Special note）

CN: 

1. 范围格式化(rangeformatting)的快捷键是ctrl+k+f，因为支持范围格式化，所以可以设置editor.formatOnPaste支持粘贴代码格式化。

2. 键入字符格式化(typeformatting)仅支持键入换行符时触发，该特性开启需要设置editor.formatOnType。

3. 命名风格检查默认不开启。

4. 插件性能能够满足单文件10万行内格式化快速响应

5. auto import功能默认开启，配置文档参考https://github.com/CppCXY/EmmyLuaCodeStyle

6. 如果无法启动插件请检查是否有MSVCP140_ATOMIC_WAIT.dll

EN:

1. The shortcut to range formatting is ctrl-k-f, and after supporting range formatting, you can format the paste code supported by editor.formatOnPaste.

2. Type character formatting only supports triggering when typing line breaks, which require setting editor.formatOnType when turned on.

3. Naming style checking is not turned on by default

4. The plug-in performance can meet the rapid response within 100000 lines of a single file

5. The auto import is enabled by default. For the configuration document, please refer to https://github.com/CppCXY/EmmyLuaCodeStyle

6. If you cannot start the plugin, check if there is MSVCP140_ATOMIC_WAIT.dll

## 配置(Configure)

###  如何配置(How to configure)

CN: 

支持通过.editorconfig文件配置项目，.editorconfig文件必须处于项目根目录，如果希望同一项目下不同目录采用不同的配置，那么不同的目录下可以分别添加.editorconfig文件。或者如果希望当前目录下不同文件采用不同配置，可以按editorconfig支持的方式去配置不同文件，配置的文档可以参考 https://github.com/CppCXY/EmmyLuaCodeStyle

EN: 

Supports project configuration through the .editorconfig file. The .editorconfig file must be in the project root directory. If you want different directories under the same project to use different configurations, you can add .editorconfig files to different directories. Or if you want different files in the current directory to use different configurations, you can configure different files according to the way supported by editorconfig. For configuration documents, please refer to https://github.com/CppCXY/EmmyLuaCodeStyle 

### 创建模板配置(Create a template configuration)

CN: 

首先创建.edtorconfig文件然后输入Ctrl + shift + p 打开命令窗口，输入insert luaCodeStyle template

EN: 

First create a .edtorconfig file and then enter Ctrl + shift + p to open the command window and enter insert luaCodeStyle template

## Road Map

- new linter
- support string match
- code quality check
- support plugin


## 其他平台(Other Platform)

CN:

1. Intellij-EmmyLua在master分支中已由我实现，其他编辑器平台如果希望获得支持可以提出相关issue。
2. sumneko_lua 内部已经集成该插件的格式化/代码诊断算法

EN:

1. Intellij-EmmyLua has been implemented by me in the master branch, and other editor platforms can propose related issues if they want support
2. The formatting/code diagnosis algorithm of this plugin has been integrated into sumneko_lua 
