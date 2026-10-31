# GHCP Deeplinker

A minimal VS Code extension that opens a local folder and launches GitHub Copilot Chat with a prompt.

## Features

- Choose a local folder from disk
- Open it in VS Code
- Launch Copilot Chat with a prefilled prompt
- Optional prompt customization before launch

## Usage

1. Install dependencies:
   ```bash
   npm install
   ```

2. Compile:
   ```bash
   npm run compile
   ```

3. Launch the extension in an Extension Development Host.

4. Run the command:
   - `Open Local Folder + Copilot Chat`

## Notes

This is the supported pattern for local-folder workflows in VS Code. There is no reliable public browser deep link that opens a local folder and preloads Copilot Chat with a prompt. This extension uses VS Code's command API to trigger Copilot Chat after the workspace is opened.
