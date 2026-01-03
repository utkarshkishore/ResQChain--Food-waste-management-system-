from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from pymongo import MongoClient
from bson import ObjectId
import snowflake.connector
import json
import io
import random
from PIL import Image
from datetime import datetime

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

# --- MOCK DRIVERS (Simulating GPS) ---
MOCK_DRIVERS = [
    {"id": "d1", "name": "John (Volunteer)", "distance": "0.5 miles", "eta": "5 mins"},
    {"id": "d2", "name": "Sarah (Logistics)", "distance": "1.2 miles", "eta": "12 mins"},
    {"id": "d3", "name": "Mike (Food Bank)", "distance": "2.8 miles", "eta": "20 mins"},
]

# --- API ROUTES ---

@app.get("/")
def home():
    return {"status": "ResQ-Chain Backend is Live"}

@app.get("/get_nearby_drivers")
def get_nearby_drivers():
    # In a real app, we would calculate distance here.
    # For hackathon, we shuffle them to make it look dynamic.
    drivers = MOCK_DRIVERS.copy()
    random.shuffle(drivers)
    return {"status": "success", "data": drivers}

@app.post("/analyze_donation")
async def analyze_donation(
        file: UploadFile = File(...),
        address: str = Form(...),
        donor_name: str = Form(...),
        donor_phone: str = Form(...)
):
    try:
        image_bytes = await file.read()
        img = Image.open(io.BytesIO(image_bytes))

        prompt = """
        Analyze this food image. Return a raw JSON object (no markdown) with these fields:
        - item_name (string)
        - freshness_score (0-100 number)
        - expiry_hours (number)
        - action_recommendation (string): Short sentence (Sell/Donate/Compost).
        - reason (string): Short explanation.
        """

        response = vision_model.generate_content([prompt, img])
        json_str = response.text.replace("```json", "").replace("```", "").strip()
        data = json.loads(json_str)

        # --- ADD METADATA ---
        data["donor_name"] = donor_name
        data["donor_phone"] = donor_phone
        data["address"] = address
        data["timestamp"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        data["status"] = "Draft" # Wait for driver selection
        data["assigned_driver"] = None

        # Insert into Mongo
        insert_result = donations_col.insert_one(data)
        data["_id"] = str(insert_result.inserted_id)

        return {"status": "success", "data": data}

    except Exception as e:
        print(f"Error: {e}")
        return {"status": "error", "error": str(e)}

class AssignDriverRequest(BaseModel):
    donation_id: str
    driver_name: str
    driver_eta: str

@app.post("/assign_driver")
def assign_driver(req: AssignDriverRequest):
    donations_col.update_one(
        {"_id": ObjectId(req.donation_id)},
        {"$set": {
            "status": "Requested",
            "assigned_driver": req.driver_name,
            "eta": req.driver_eta
        }}
    )
    return {"status": "assigned"}

@app.get("/driver_requests")
def driver_requests():
    # Only show items where a driver has been requested
    items = list(donations_col.find({"status": "Requested"}).sort("_id", -1))
    for item in items:
        item["_id"] = str(item["_id"])
    return {"status": "success", "data": items}

class DriverResponseRequest(BaseModel):
    donation_id: str
    response: str # "Accepted" or "Declined"

@app.post("/driver_respond")
def driver_respond(req: DriverResponseRequest):
    new_status = "Accepted" if req.response == "accept" else "Declined"

    donations_col.update_one(
        {"_id": ObjectId(req.donation_id)},
        {"$set": {"status": new_status}}
    )
    return {"status": new_status}

# Polling endpoint for Donor to check status
@app.get("/check_status/{donation_id}")
def check_status(donation_id: str):
    item = donations_col.find_one({"_id": ObjectId(donation_id)})
    if item:
        return {"status": item.get("status", "Draft"), "driver": item.get("assigned_driver")}
    return {"status": "not_found"}