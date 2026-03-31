# Gemini CLI Bridge for Obsidian

This plugin provides a direct bridge between **Obsidian** and the **Gemini CLI** tool. It allows you to interact with Gemini AI models, execute CLI commands, and manage your vault using AI directly from a sidebar chat interface.

Czech version of this guide is available in the plugin's folder as a note.

## ✨ Features

- **Sidebar Chat View:** A persistent sidebar panel for continuous conversation with Gemini CLI.
- **Command Execution:** Run any Gemini CLI command (e.g., "Summarize this folder" or "Create a new note") without leaving Obsidian.
- **Chat History:** Automatically logs all conversations to `Gemini History.md` in your vault root.
- **Cross-Platform Support:** Customizable path to the `gemini` binary, making it compatible with Windows, Linux, and macOS.
- **Ribbon Icon & Command Palette:** Quick access via the robot icon 🤖 or `Ctrl+P`.

## 🚀 Installation

Since this is a specialized local plugin:

1. Copy the plugin folder to your vault's `.obsidian/plugins/` directory.
2. Open Obsidian **Settings** -> **Community plugins**.
3. Click **Reload** to discover the plugin.
4. Toggle **Gemini CLI Bridge** to **ON**.
5. (Optional) Go to the plugin settings to set a custom path to your `gemini` executable if it's not in your system PATH.

## 📖 How to Use

1. Click the **Robot Icon** 🤖 in the left ribbon or use the command palette (`Ctrl+P`) and search for "Open Gemini Chat Panel".
2. The chat panel will open on the right side.
3. Type your prompt and press **Ctrl + Enter** (or click the button) to send.
4. View the AI response directly in the panel.

## 🛠️ Requirements

- **Gemini CLI:** You must have the [Gemini CLI](https://github.com/google/gemini-cli) installed on your system.
- **System PATH:** The `gemini` command should be accessible from your terminal, or you must provide the absolute path in the plugin settings.

---
*Created by Gemini CLI for a smarter Obsidian workflow.*
