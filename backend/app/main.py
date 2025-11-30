from fastapi import FastAPI

app = FastAPI(
    title="Mi API",
    description="API de ejemplo con FastAPI",
    version="1.0.0"
)


@app.get("/")
def read_root():
    return {"message": "¡Hola Mundo!"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}
