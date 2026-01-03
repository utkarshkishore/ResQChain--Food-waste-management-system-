from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from pymongo import MongoClient
from bson import ObjectId
import requests
import snowflake.connector
import json
import io
from PIL import Image
import os
from datetime import datetime # <--- NEW IMPORT FOR TIME

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- CONFIGURATION ---
GEMINI_KEY = "AIzaSyC3a7jsee-wfWn19_v4poO5tmUqlaRAm6Q"
MONGO_URI = "mongodb+srv://utkarshkishore:PKSAUhaO9XBaKMAo@cluster0.lonmfxy.mongodb.net/?appName=Cluster0"
ELEVENLABS_KEY = "sk_43e03a5dc79c5069b9e315345887af1046e100c550e2a8d7"
SNOW_USER = "UTKARSHKISHORE"
SNOW_PASS = "@Helsinki12345"
SNOW_ACC = "invtjyf-aeb83705"

# --- SETUP ---
genai.configure(api_key=GEMINI_KEY)
vision_model = genai.GenerativeModel('gemini-2.5-flash')

try:
    mongo_client = MongoClient(MONGO_URI)
    db = mongo_client["resq_chain_db"]
    donations_col = db["donations"]
    print("✅ MongoDB Connected")
except:
    print("⚠️ MongoDB Failed to Connect")

def ask_snowflake(question):
    try:
        ctx = snowflake.connector.connect(
            user=SNOW_USER, password=SNOW_PASS, account=SNOW_ACC
        )
        cs = ctx.cursor()
        query = f"SELECT SNOWFLAKE.CORTEX.COMPLETE('llama3-70b', '{question}')"
        cs.execute(query)
        result = cs.fetchone()[0]
        return result
    except Exception as e:
        return f"Snowflake Error: {str(e)}"

# --- API ROUTES ---

@app.get("/")
def home():
    return {"status": "ResQ-Chain Backend is Live"}

@app.post("/analyze_donation")
async def analyze_donation(
        file: UploadFile = File(...),
        address: str = Form(...)
):
    try:
        image_bytes = await file.read()
        img = Image.open(io.BytesIO(image_bytes))

        prompt = """
        Analyze this food image. Return a raw JSON object (no markdown) with these fields:
        - item_name (string)
        - freshness_score (0-100 number)
        - expiry_hours (number)
        - safety_warning (string or null)
        - action_recommendation (string): Select exactly one full sentence:
            * "Fruit sellers can sell this at a Premium Price" (if freshness > 85)
            * "Sellers should apply a 25% Discount to sell fast" (if freshness is 70-85)
            * "Sellers should apply a clearance Sale like a discount of 50% " (if freshness is 50-69)
            * "Sellers can donate this to a Food Bank immediately" (if freshness is 30-49)
            * "Compost: Do not sell or donate" (if freshness < 30)
        - reason (string): A short explanation.
        """

        response = vision_model.generate_content([prompt, img])
        json_str = response.text.replace("```json", "").replace("```", "").strip()
        data = json.loads(json_str)

        # --- ADD METADATA ---
        data["address"] = address
        data["timestamp"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S") # Real Time
        data["status"] = "Pending" # Default status

        # Insert into Mongo
        insert_result = donations_col.insert_one(data)
        data["_id"] = str(insert_result.inserted_id)

        return {"status": "success", "data": data}

    except Exception as e:
        print(f"Error: {e}")
        return {"status": "error", "error": str(e)}

@app.get("/all_donations")
def get_all_donations():
    try:
        items = list(donations_col.find().sort("_id", -1))
        for item in items:
            item["_id"] = str(item["_id"])
        return {"status": "success", "data": items}
    except Exception as e:
        return {"status": "error", "error": str(e)}

# --- NEW: UPDATE STATUS INSTEAD OF DELETE ---
class IDRequest(BaseModel):
    id: str

@app.post("/pickup_donation")
def pickup_donation(req: IDRequest):
    try:
        # Update status to 'Picked Up'
        donations_col.update_one(
            {"_id": ObjectId(req.id)},
            {"$set": {"status": "Picked Up"}}
        )
        return {"status": "updated", "id": req.id}
    except Exception as e:
        return {"status": "error", "error": str(e)}

# --- EXTRAS ---
class TextRequest(BaseModel):
    text: str

@app.post("/generate_alert")
def generate_alert(req: TextRequest):
    url = "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM"
    headers = {"xi-api-key": ELEVENLABS_KEY, "Content-Type": "application/json"}
    payload = {"text": req.text, "model_id": "eleven_monolingual_v1"}
    try:
        response = requests.post(url, json=payload, headers=headers)
        with open("alert.mp3", "wb") as f:
            f.write(response.content)
        return {"status": "Audio generated"}
    except Exception as e:
        return {"status": "error", "error": str(e)}

@app.post("/ask_safety")
def ask_safety(req: TextRequest):
    answer = ask_snowflake(req.text)
    return {"answer": answer}