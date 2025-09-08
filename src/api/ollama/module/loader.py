#import PyPDF2
import psycopg2
import subprocess
import json

class Loader:
    def __init__(self, db_url, embed_model="llama3-embed"):
        self.conn = psycopg2.connect(db_url)
        self.cur = self.conn.cursor()
        self.embed_model = embed_model

        self.cur.execute("""
        CREATE TABLE IF NOT EXISTS docs (
            id SERIAL PRIMARY KEY,
            content TEXT,
            embedding VECTOR(4096) -- depende del modelo de embeddings
        );
        """)
        self.conn.commit()

    def _get_embedding(self, text):
        result = subprocess.run(
            ["ollama", "run", self.embed_model],
            input=text.encode("utf-8"),
            capture_output=True
        )
        return json.loads(result.stdout.decode("utf-8"))["embedding"]

    def load_pdf(self, filepath):
        text = ""
        with open(filepath, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                text += page.extract_text() or ""

        embedding = self._get_embedding(text)
        self.cur.execute(
            "INSERT INTO docs (content, embedding) VALUES (%s, %s)",
            (text, embedding)
        )
        self.conn.commit()

    def close(self):
        self.cur.close()
        self.conn.close()
