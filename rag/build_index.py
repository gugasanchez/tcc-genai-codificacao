import argparse, os, pathlib, faiss, numpy as np
from sentence_transformers import SentenceTransformer
from pathlib import Path


def iter_text_files(root: Path):
    exts = {".py", ".md", ".txt", ".yaml", ".yml"}
    for p in root.rglob("*"):
        if p.suffix in exts and p.is_file():
            yield p


def main(src_dir=".", out_dir="rag/store", model_name="all-MiniLM-L6-v2"):
    src = Path(src_dir)
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    model = SentenceTransformer(model_name)
    docs, metas = [], []

    for fp in iter_text_files(src):
        text = fp.read_text(encoding="utf-8", errors="ignore")
        chunks = text.split("\n\n")
        for i, ch in enumerate(chunks):
            if ch.strip():
                docs.append(ch.strip())
                metas.append({"file": str(fp), "chunk": i})

    if not docs:
        print("No documents found to index.")
        return

    embs = model.encode(docs, convert_to_numpy=True, normalize_embeddings=True)
    index = faiss.IndexFlatIP(embs.shape[1])
    index.add(embs)

    faiss.write_index(index, str(out / "index.faiss"))
    np.save(out / "docs.npy", np.array(docs, dtype=object))
    np.save(out / "metas.npy", np.array(metas, dtype=object))
    print(f"Indexed {len(docs)} chunks.")


if __name__ == "__main__":
    import typer

    typer.run(main)


