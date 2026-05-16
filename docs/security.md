# Security & Privacy

AI Hub is designed with a **local-first** philosophy. This means you have full control over your data, but it also means you are responsible for the security of your device and the privacy policies of the AI providers you choose to use.

## 🏠 Local Storage
*   **Your Data Stays With You:** All chat histories, generated images, videos, and audio files are stored locally on your device in the application's data folder.
*   **Device Access:** Currently, AI Hub does not have an internal "App Lock" or password. Since your data is stored locally, anyone with access to your computer and user account can potentially view your history. We recommend using OS-level security (like a login password) to protect your data.

## 🔑 API Key Security
*   **Encryption:** Your API keys are encrypted before being stored in the local database. This prevents them from being read as plain text by other applications or users browsing your files.
*   **Direct Connection:** When you make a request, the app sends your key directly to the AI provider. There is no middleman server intercepting your keys.

## 🌐 Provider Privacy & ZDR
When you use an AI provider (OpenAI, Google, Anthropic, etc.), your prompts are sent to their servers. 
*   **Responsibility:** You are responsible for checking the **Privacy Policy** and **Zero Data Retention (ZDR)** policies of each provider.
*   **Free Tiers:** Be aware that many "Free" tiers (such as the Google AI Studio free tier) may use your data to train their models.
*   **Standard Compliance:** AI Hub follows the OpenAI standard for communication, but the privacy level depends entirely on the provider you have configured.

## 🛡️ Maximum Privacy Options
If you require 100% privacy where no data ever leaves your machine, AI Hub supports:
*   **Ollama & LM Studio:** Run powerful models locally on your own hardware.
*   **Custom Providers:** You can connect to any self-hosted, OpenAI-compatible server.

By using these local providers, your data remains completely offline and private.
