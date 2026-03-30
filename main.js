const { Plugin, Modal, ItemView, WorkspaceLeaf, TFile } = require('obsidian');
const { exec } = require('child_process');

const GEMINI_VIEW_TYPE = "gemini-cli-chat-view";
const HISTORY_FILE_PATH = "Gemini History.md";

class GeminiChatView extends ItemView {
    constructor(leaf) {
        super(leaf);
        this.historyContent = "";
    }

    getViewType() { return GEMINI_VIEW_TYPE; }
    getDisplayText() { return "Gemini CLI Chat"; }
    getIcon() { return "bot"; }

    async onOpen() {
        const container = this.containerEl.children[1];
        container.empty();
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.height = '100%';
        container.style.padding = '10px';

        container.createEl('h3', { text: 'Gemini CLI Chat' });

        // Oblast pro výstup
        this.outputEl = container.createEl('div', { cls: 'gemini-chat-output' });
        this.outputEl.style.flexGrow = '1';
        this.outputEl.style.overflowY = 'auto';
        this.outputEl.style.marginBottom = '10px';
        this.outputEl.style.padding = '10px';
        this.outputEl.style.border = '1px solid var(--background-modifier-border)';
        this.outputEl.style.backgroundColor = 'var(--background-primary)';
        this.outputEl.style.borderRadius = '4px';
        this.outputEl.style.fontSize = '0.9em';
        this.outputEl.style.whiteSpace = 'pre-wrap';
        this.outputEl.textContent = "Připraven ke komunikaci...\n";

        // Vstupní pole
        const inputContainer = container.createEl('div');
        inputContainer.style.display = 'flex';
        inputContainer.style.flexDirection = 'column'; // Tlačítko pod textareou pro lepší místo
        inputContainer.style.gap = '8px';
        inputContainer.style.marginBottom = '25px'; // Bezpečnostní rezerva proti spodní liště Obsidianu

        this.inputEl = inputContainer.createEl('textarea');
        this.inputEl.placeholder = 'Zadej příkaz... (Ctrl+Enter odeslat)';
        this.inputEl.style.width = '100%';
        this.inputEl.style.height = '80px';
        this.inputEl.style.resize = 'vertical'; // Umožnit zvětšení uživatelem
        this.inputEl.style.padding = '8px';
        this.inputEl.style.borderRadius = '4px';
        this.inputEl.style.border = '1px solid var(--background-modifier-border)';

        this.inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                this.handleSend();
            }
        });

        const sendBtn = inputContainer.createEl('button', { text: 'Odeslat dotaz' });
        sendBtn.style.alignSelf = 'flex-end';
        sendBtn.style.padding = '5px 15px';
        sendBtn.addEventListener('click', () => this.handleSend());
    }

    async handleSend() {
        const prompt = this.inputEl.value.trim();
        if (!prompt) return;

        this.inputEl.value = '';
        this.appendMessage('YOU', prompt);
        
        const loadingMsg = this.appendMessage('GEMINI', '⏳ Přemýšlím...');

        const cmd = `gemini "${prompt.replace(/"/g, '\\"')}"`;
        
        exec(cmd, async (error, stdout, stderr) => {
            loadingMsg.remove();
            let response = "";
            if (error) {
                response = `❌ Chyba:\n${error.message}\n${stderr}`;
            } else {
                response = stdout || stderr || '✅ Hotovo.';
            }
            this.appendMessage('GEMINI', response);
            await this.logToHistory(prompt, response);
        });
    }

    appendMessage(sender, text) {
        const msgEl = this.outputEl.createEl('div');
        msgEl.style.marginBottom = '10px';
        msgEl.createEl('strong', { text: `${sender}: ` });
        msgEl.createEl('span', { text: text });
        this.outputEl.scrollTop = this.outputEl.scrollHeight;
        return msgEl;
    }

    async logToHistory(prompt, response) {
        const timestamp = new Date().toLocaleString();
        const logEntry = `\n### [${timestamp}]\n**USER:** ${prompt}\n\n**GEMINI:**\n${response}\n\n---`;
        
        let file = this.app.vault.getAbstractFileByPath(HISTORY_FILE_PATH);
        if (file instanceof TFile) {
            const currentContent = await this.app.vault.read(file);
            await this.app.vault.modify(file, currentContent + logEntry);
        } else {
            await this.app.vault.create(HISTORY_FILE_PATH, `# Gemini CLI Chat History\n${logEntry}`);
        }
    }
}

class GeminiCLIBridge extends Plugin {
    async onload() {
        console.log('Načítám Gemini CLI Bridge v2.0');

        this.registerView(
            GEMINI_VIEW_TYPE,
            (leaf) => new GeminiChatView(leaf)
        );

        this.addRibbonIcon('bot', 'Gemini Chat Panel', () => {
            this.activateView();
        });

        this.addCommand({
            id: 'open-gemini-chat-panel',
            name: 'Open Gemini Chat Panel',
            callback: () => this.activateView(),
        });
    }

    async activateView() {
        let leaf = null;
        const leaves = this.app.workspace.getLeavesOfType(GEMINI_VIEW_TYPE);

        if (leaves.length > 0) {
            leaf = leaves[0];
        } else {
            leaf = this.app.workspace.getRightLeaf(false);
            await leaf.setViewState({
                type: GEMINI_VIEW_TYPE,
                active: true,
            });
        }

        this.app.workspace.revealLeaf(leaf);
    }
}

module.exports = GeminiCLIBridge;
