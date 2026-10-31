import * as vscode from "vscode";

const DEFAULT_PROMPT =
  "Review this project, explain the architecture, and identify likely risks and next steps.";

const CHAT_COMMAND_CANDIDATES = [
  "workbench.action.chat.open",
  "github.copilot.chat.open",
  "github.copilot.chat.openInNewWindow"
];

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "ghcpdeeplinker.openLocalFolderAndChat",
    async () => {
      const folder = await pickFolder();
      if (!folder) {
        return;
      }

      const prompt = await promptForMessage(DEFAULT_PROMPT);
      const finalPrompt = prompt ?? DEFAULT_PROMPT;

      try {
        await vscode.commands.executeCommand("vscode.openFolder", folder, false);
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to open folder: ${String(error)}`);
        return;
      }

      await delay(1200);

      try {
        await openCopilotChatWithPrompt(finalPrompt);
      } catch (error) {
        vscode.window.showErrorMessage(
          `Could not open Copilot Chat. ${String(error)}`
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

async function pickFolder(): Promise<vscode.Uri | undefined> {
  const result = await vscode.window.showOpenDialog({
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
    openLabel: "Open folder"
  });

  return result?.[0];
}

async function promptForMessage(defaultPrompt: string): Promise<string | undefined> {
  return vscode.window.showInputBox({
    prompt: "Enter the prompt to send to Copilot Chat",
    value: defaultPrompt,
    placeHolder: "Review this project and explain the architecture",
    ignoreFocusOut: true
  });
}

async function openCopilotChatWithPrompt(prompt: string): Promise<void> {
  const commands = await vscode.commands.getCommands(true);

  for (const command of CHAT_COMMAND_CANDIDATES) {
    if (commands.includes(command)) {
      await vscode.commands.executeCommand(command, prompt);
      return;
    }
  }

  throw new Error(
    "No supported Copilot Chat command was found in this VS Code instance. " +
      "Please ensure GitHub Copilot Chat is installed and enabled."
  );
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function deactivate() {}
