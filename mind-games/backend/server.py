import json
from fastapi import FastAPI, File, Form, UploadFile, HTTPException, Path
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import traceback
from typing import List
import uuid
from pydantic import BaseModel

DATABASE_FILE = "/Users/muhammedgumus/Desktop/freelance-project/mind-games/mind-games/public/db/database.json"

app = FastAPI()

# CORS middleware
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOADS_DIR = "../public/images/uploads"

if not os.path.exists(UPLOADS_DIR):
    os.makedirs(UPLOADS_DIR)


def is_file_exists(file_path: str) -> bool:
    return os.path.exists(file_path)


@app.post("/products")
async def add_product(
    productName: str = Form(...),
    productDescription: str = Form(...),
    usageInstructions: str = Form(...),
    productImages: List[UploadFile] = File(...)
):
    try:
        image_urls = []
        for image in productImages:
            unique_filename = f"{uuid.uuid4()}_{image.filename}"

            count = 1
            while is_file_exists(os.path.join(UPLOADS_DIR, unique_filename)):
                unique_filename = f"{uuid.uuid4()}_{count}_{image.filename}"
                count += 1

            image_path_mongodb = os.path.join(UPLOADS_DIR, unique_filename)
            with open(image_path_mongodb, "wb") as f:
                f.write(await image.read())
            image_urls.append(image_path_mongodb)

        new_product = {
            "productId": str(uuid.uuid4()),  # Generate a unique productId
            "productName": productName,
            "productImages": image_urls,
            "productDescription": productDescription,
            "usageInstructions": usageInstructions,
        }

        with open(DATABASE_FILE, "r", encoding="utf-8") as db_file:
            data = json.load(db_file)
            data["products"].append(new_product)

        with open(DATABASE_FILE, "w", encoding="utf-8") as db_file:
            json.dump(data, db_file, ensure_ascii=False)

        return JSONResponse(
            content={"success": True, "message": "Product added successfully"},
            status_code=201,
        )

    except Exception as e:
        print("Exception occurred while adding product:")
        print(traceback.format_exc())
        return JSONResponse(
            content={"success": False, "error": str(e)},
            status_code=500,
        )


@app.get("/productsGet", response_model=List[dict])
async def get_products():
    try:
        with open(DATABASE_FILE, "r", encoding="utf-8") as db_file:
            data = json.load(db_file)
            return JSONResponse(
                content={"success": True, "products": data["products"]},
                status_code=200,
            )

    except Exception as e:
        print(str(e))
        return JSONResponse(
            content={"success": False, "error": str(e)},
            status_code=500,
        )


@app.delete("/products/{product_id}")
async def delete_product(product_id: str = Path(..., title="The ID of the product to delete")):
    try:
        with open(DATABASE_FILE, "r", encoding="utf-8") as db_file:
            data = json.load(db_file)
            products = data["products"]
            index = None
            for i, product in enumerate(products):
                if product.get("productId") == product_id:
                    index = i
                    break

            if index is not None:
                del products[index]
                with open(DATABASE_FILE, "w", encoding="utf-8") as db_file:
                    json.dump(data, db_file, ensure_ascii=False)
                return JSONResponse(
                    content={"success": True,
                             "message": "Product deleted successfully"},
                    status_code=200,
                )
            else:
                return JSONResponse(
                    content={"success": False, "error": "Product not found"},
                    status_code=404,
                )

    except Exception as e:
        print(str(e))
        return JSONResponse(
            content={"success": False, "error": str(e)},
            status_code=500,
        )


class ContactForm(BaseModel):
    first_name: str
    last_name: str
    username: str
    email: str
    text: str


@app.post("/contact")
def send_user_email(user_info: dict):
    new_user = {
        "username": user_info.get("username", ""),
        "email": user_info.get("email", ""),
        "text": user_info.get("text", ""),
    }

    try:
        # Save the user info to a file or any other storage mechanism
        return JSONResponse(
            content={"success": True,
                     "message": "User info saved successfully"},
            status_code=201,
        )

    except Exception as e:
        return JSONResponse(
            content={"success": False, "error": str(e)},
            status_code=500,
        )


if __name__ == "__main__":
    import uvicorn
    import asyncio

    loop = asyncio.get_event_loop()
    uvicorn.run("main:app", host="127.0.0.1",
                port=8000, reload=True, loop=loop)
