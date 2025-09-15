from module.search import Search
from module.prompt import Prompt
from module.client import OllamaClient

class ReportService:
    def __init__(self, db_url):
        self.searcher = Search(db_url)
        self.ollama = OllamaClient()

    def analizar(self, json_data, tipo):
        contexto = self.searcher.search(str(json_data))
        prompt = Prompt.build(json_data, contexto, tipo)
        return self.ollama.run(prompt)
