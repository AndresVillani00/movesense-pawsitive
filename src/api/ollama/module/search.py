import psycopg2
import subprocess
import json

class Search:
    def __init__(self, db_url, embed_model="llama3-embed"):
        self.conn = psycopg2.connect(db_url)
        self.cur = self.conn.cursor()
        self.embed_model = embed_model

    def _get_embedding(self, text):
        result = subprocess.run(
            ["ollama", "run", self.embed_model],
            input=text.encode("utf-8"),
            capture_output=True
        )
        return json.loads(result.stdout.decode("utf-8"))["embedding"]

    def search(self, query, k=3):
        query_vec = self._get_embedding(query)
        self.cur.execute("""
            SELECT content
            FROM docs
            ORDER BY embedding <-> %s
            LIMIT %s;
        """, (query_vec, k))
        return [row[0] for row in self.cur.fetchall()]

    def close(self):
        self.cur.close()
        self.conn.close()
