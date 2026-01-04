# ResQ-Chain

ResQ-Chain is a food rescue platform that connects donors with surplus food to drivers and food banks. It uses AI to analyze food donations and a blockchain-like ledger to track them.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v20.x or later)
*   [Python](https://www.python.org/) (v3.9 or later)
*   [MongoDB account](https://www.mongodb.com/try)

### Cloning

Clone the repository to your local machine:

```bash
git clone https://github.com/your-username/ResQ-Chain.git
cd ResQ-Chain
```

## Installation

### Frontend

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```

### Backend

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Create and activate a virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```
3.  Install the dependencies:
    ```bash
    pip install -r requirements.txt
    ```
    *(Note: A `requirements.txt` file does not exist. You will need to create one from the imports in `main.py`. The main libraries are `fastapi`, `uvicorn`, `pymongo`, `python-multipart`, `google-generativeai`, `snowflake-connector-python`, and `Pillow`)*

## Configuration

The backend requires API keys and credentials to be set in `backend/main.py`.

**It is strongly recommended to use environment variables for these sensitive values.**

`backend/main.py`:
```python
# --- CONFIGURATION ---
GEMINI_KEY = "your-gemini-api-key"
MONGO_URI = "your-mongodb-uri"
SNOW_USER = "your-snowflake-username"
SNOW_PASS = "your-snowflake-password"
SNOW_ACC = "your-snowflake-account"
```

## Running the Application

### Frontend

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Run the development server:
    ```bash
    npm run dev
    ```
    The application will be available at [http://localhost:3000](http://localhost:3000).

### Backend

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Activate the virtual environment:
    ```bash
    source venv/bin/activate
    ```
3.  Run the FastAPI server:
    ```bash
    uvicorn main:app --reload
    ```
    The API will be available at [http://localhost:8000](http://localhost:8000).
