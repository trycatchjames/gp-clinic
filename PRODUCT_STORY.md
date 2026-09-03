## Pi: The AI Coding Agent

### What It Does
Pi is a versatile AI coding agent designed to streamline AI model integration, development, and deployment. It acts as a bridge between developers and AI models, enabling seamless interactions for tasks ranging from code generation to complex reasoning.

### Core Features
- **Custom Provider Support**: Integrate models like Llama.cpp, OpenRouter, and others via JSON configurations.
- **Model Management**: Load, unload, and switch between models using commands like `/model` and `/llama`.
- **OpenAI Compatibility**: Use the `openai-completions` API for consistent interactions across providers.
- **Tooling**: Support for Jinja templates, reasoning controls, and custom parameters for fine-tuned outputs.

### How It Works
1. **Setup**: Configure models in `models.json` (e.g., Llama.cpp server URL, API keys, and compatibility flags).
2. **Integration**: Use `/login` to connect to providers or `/llama` to manage local Llama.cpp routers.
3. **Execution**: Select a model with `/model` and start coding, querying, or automating tasks.

### Use Cases
- **Local Development**: Run Llama.cpp in router mode to manage multiple GGUF models locally.
- **API Routing**: Route requests through OpenRouter for scalable, credit-based model access.
- **Tool Calls**: Enable Jinja templates and reasoning controls for structured outputs (e.g., `thinking_budget_tokens`).

### Example Workflow
```bash
# Start Llama.cpp in single-model mode
llama-server -m model.gguf --host 127.0.0.1 --port 8080

# Configure Pi's models.json
{
  "providers": {
    "local-llama": {
      "baseUrl": "http://127.0.0.1:8080/v1",
      "api": "openai-completions",
      "models": [{"id": "model.gguf"}]
    }
  }
}

# Run Pi and select the model
pi --model 'local-llama/model.gguf'
```

### Why Pi?
- **Flexibility**: Supports local and cloud models with unified commands.
- **Speed**: Optimized for development workflows with minimal setup.
- **Extensibility**: Add custom providers, tools, and integrations via JSON and scripts.

> *Note: This story simplifies Pi's capabilities. Refer to the [official documentation](docs/llama-cpp.md) for advanced configurations.*