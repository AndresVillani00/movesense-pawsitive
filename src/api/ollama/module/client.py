import subprocess

class OllamaClient:
    def __init__(self, model="mascota-analyst"):
        self.model = model

    def run(self, prompt):
        result = subprocess.run(
            ["ollama", "run", self.model],
            input=prompt.encode("utf-8"),
            capture_output=True
        )
        return result.stdout.decode("utf-8")
