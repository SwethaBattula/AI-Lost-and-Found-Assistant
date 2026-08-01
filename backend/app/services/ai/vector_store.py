import numpy as np
from app.core.logging import logger

_faiss = None
_faiss_failed = False

def get_faiss():
    global _faiss, _faiss_failed
    if _faiss_failed:
        return None
    if _faiss is None:
        try:
            import faiss
            _faiss = faiss
            logger.info("FAISS vector store initialized successfully.")
        except Exception as e:
            logger.warning(f"FAISS module unavailable, falling back to NumPy vector store: {e}")
            _faiss_failed = True
            return None
    return _faiss

class VectorStore:
    def __init__(self, dimension: int = 384):
        self.dimension = dimension
        self.vectors = []
        self.ids = []
        faiss_lib = get_faiss()
        if faiss_lib:
            try:
                self.index = faiss_lib.IndexFlatIP(dimension)
            except Exception as e:
                logger.error(f"Error instantiating FAISS IndexFlatIP: {e}")
                self.index = None
        else:
            self.index = None

    def add_vectors(self, item_ids: list[int], embeddings: list[list[float]]):
        if not item_ids or not embeddings:
            return
        arr = np.array(embeddings, dtype=np.float32)
        # Normalize vectors for Inner Product / Cosine similarity
        norms = np.linalg.norm(arr, axis=1, keepdims=True)
        norms[norms == 0] = 1.0
        normalized_arr = arr / norms

        if self.index is not None:
            try:
                self.index.add(normalized_arr)
            except Exception as e:
                logger.error(f"Failed adding vectors to FAISS index: {e}")
                
        self.vectors.extend(normalized_arr.tolist())
        self.ids.extend(item_ids)

    def search(self, query_embedding: list[float], top_k: int = 5) -> list[tuple[int, float]]:
        if not self.ids:
            return []
            
        q_arr = np.array([query_embedding], dtype=np.float32)
        norm = np.linalg.norm(q_arr)
        if norm > 0:
            q_arr = q_arr / norm

        if self.index is not None and self.index.ntotal > 0:
            try:
                scores, indices = self.index.search(q_arr, min(top_k, self.index.ntotal))
                results = []
                for score, idx in zip(scores[0], indices[0]):
                    if idx >= 0 and idx < len(self.ids):
                        results.append((self.ids[idx], float(score)))
                return results
            except Exception as e:
                logger.error(f"FAISS search failed: {e}")

        # NumPy Cosine Similarity Fallback
        vecs = np.array(self.vectors, dtype=np.float32)
        sims = np.dot(vecs, q_arr.T).flatten()
        top_indices = np.argsort(sims)[::-1][:top_k]
        
        results = []
        for idx in top_indices:
            results.append((self.ids[idx], float(sims[idx])))
        return results
