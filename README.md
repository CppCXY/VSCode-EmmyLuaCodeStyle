# EmmyLuaCodeStyle

[中文版](./README_CN.md)

EmmyLuaCodeStyle is a C++ based Lua code formatting plugin that supports Lua 5.1, 5.2, 5.3, 5.4, and LuaJIT. It provides the following features:

## Features

- Lua code reformatting, range formatting, and type formatting
- Lua code style check
- Lua word spell check
- Lua name style check
- Support for Unicode characters
- Very fast and low memory usage
- Support for Windows-x64/Linux-x64/macOSx-x64/macOSx-arm64

## How to Use

### Configuration

EmmyLuaCodeStyle supports project configuration through the `.editorconfig` file. The `.editorconfig` file must be in the project root directory. If you want different directories under the same project to use different configurations, you can add `.editorconfig` files to different directories. Or if you want different files in the current directory to use different configurations, you can configure different files according to the way supported by editorconfig. For configuration documents, please refer to https://github.com/CppCXY/EmmyLuaCodeStyle.

### Create a Template Configuration

To create a template configuration, first create an `.editorconfig` file and then enter `Ctrl + shift + p` to open the command window and enter `insert luaCodeStyle template`.

## Support

If you have any questions, you can go to the issue of the repository to discuss, and the developer will usually answer within half a day.

## Road Map

- Support plugin [0%]

## Other Platforms

- There is a plugin called `Intellij-EmmyLuaCodeStyle` available for IntelliJ platform.
- The formatting/code diagnosis algorithm of this plugin has been integrated into `sumneko_lua`.
- To use this plugin on the Neovim platform, you can use sumneko_lua. The formatting and code diagnosis algorithm of this plugin has been integrated into sumneko_lua.