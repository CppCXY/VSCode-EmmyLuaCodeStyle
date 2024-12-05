# EmmyLuaCodeStyle


EmmyLuaCodeStyle 是一个基于 C++ 的 Lua 代码格式化插件，支持 Lua 5.1、5.2、5.3、5.4 和 LuaJIT。它提供以下功能：

## 功能

- Lua 代码重排、范围格式化和类型格式化
- Lua 代码风格检查
- Lua 单词拼写检查
- Lua 名称风格检查
- 支持 Unicode 字符
- 非常快速且内存使用低
- 支持 Windows-x64/Linux-x64/macOSx-x64/macOSx-arm64

## 如何使用

### 配置

EmmyLuaCodeStyle 支持通过 `.editorconfig` 文件进行项目配置。`.editorconfig` 文件必须位于项目根目录中。如果您希望同一项目下的不同目录使用不同的配置，可以在不同的目录中添加 `.editorconfig` 文件。或者如果您希望当前目录中的不同文件使用不同的配置，可以根据 editorconfig 支持的方式配置不同的文件。有关配置文档，请参阅 https://github.com/CppCXY/EmmyLuaCodeStyle 。

### 创建模板配置

要创建模板配置，请先创建 `.editorconfig` 文件，然后输入 `Ctrl + shift + p` 打开命令窗口，输入 `insert luaCodeStyle template`。

## 支持

如果您有任何问题，可以前往存储库的问题讨论区，开发人员通常会在半天内回答。

## 路线图

- 支持插件 [0%]

## 其他平台

- `Intellij-EmmyLuaCodeStyle` 的插件可用于 IntelliJ 平台。
- 该插件的格式化/代码诊断算法已集成到 `sumneko_lua` 中。
- 要在 Neovim 平台上使用此插件，你可以使用 sumneko_lua。
