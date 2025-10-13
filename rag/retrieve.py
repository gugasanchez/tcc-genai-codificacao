import faiss, numpy as np
from sentence_transformers import SentenceTransformer
from pathlib import Path


class Retriever:
    def __init__(self, store_dir="rag/store", model_name="all-MiniLM-L6-v2"):
        self.store = Path(store_dir)
        self.docs = np.load(self.store / "docs.npy", allow_pickle=True)
        self.metas = np.load(self.store / "metas.npy", allow_pickle=True)
        self.index = faiss.read_index(str(self.store / "index.faiss"))
        self.model = SentenceTransformer(model_name)

    def query(self, text: str, k: int = 6):
        q = self.model.encode([text], normalize_embeddings=True)
        D, I = self.index.search(q, k)
        results = []
        for idx in I[0]:
            results.append({"text": self.docs[idx].item(), "meta": self.metas[idx].item()})
        return results


