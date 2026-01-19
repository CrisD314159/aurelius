# Aurelius

<p align="center">
  <img alt="Aurelius Logo" src="src/assets/images/app_logo.png" width="200">
</p>

Aurelius is a desktop application designed to bring the power of Large Language Models (LLMs) directly to your machine. Built as a portfolio project, it showcases the integration of modern web technologies with powerful local AI execution capabilities.

## Features

- **Local LLM Execution**: Seamlessly integrates with **Ollama** to run any language model locally on your device (Phi, Gemma, , etc), ensuring privacy and offline capability.
- **Interactive Chat Interface**: A clean, modern and minimalist UI written in React.
- **Voice Interaction (On development)**: Built-in voice recording capabilities, allowing for intuitive voice-driven interactions with AI models.
- **Model Management**: Easy-to-use interface for selecting and managing different LLM models available via Ollama.
- **Cross-Platform Desktop App**: Built with Electron to provide a native application experience on macOS and Windows.

## Technical Stack

This project is using the following tech stack:

### Frontend
- **React** with **TypeScript** for a type-safe, component-based UI.
- **Tailwind CSS** & **MUI Joy UI** for modern styling.
- **Framer Motion** for fluid animations and interactive elements.
- **React Query** for efficient server state management.

### Backend & Core
- **Electron**: Wraps the application in a secure desktop environment.
- **Python Backend**: A bundled Python environment handling complex logic using Fastapi. The repo to this project is at [Backend repository](https://github.com/CrisD314159/aurelius-backend) .
- **WebSockets**: Enables real-time communication between the frontend and backend services.
- **AI/ML Libraries**: Includes support via libraries like `librosa` (audio), `nltk` / `spacy` (NLP), and `pytorch` (bundled in backend) for advanced processing capabilities.

## Prerequisites

Before running the application, ensure you have the following installed:

1.  **Ollama**: Aurelius relies on Ollama for model execution.
    - Download and install from [ollama.com](https://ollama.com).
    - Ensure Ollama is running (`ollama serve`).
    - Pull at least one model (e.g., `ollama pull llama3`).

2.  **Node.js**: Required to install dependencies and build the application.

## Installation & Running

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/aurelius.git
    cd aurelius
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Start the Application**
    ```bash
    npm start
    ```

4.  **Build for Production**
    To create a distributable package for your OS:
    ```bash
    npm run make
    ```
4.  **Download the official release**
    If you want to install the application on your machine, go to [Aurelius Website](https://aurelius-app.vercel.app)

## Author

**Cristian David Vargas**
- Website: [Crisdev Website](https://crisdev-pi.vercel.app)

---

*This application is a portfolio project demonstrating capabilities in Electron, React, and Local AI integration.*

