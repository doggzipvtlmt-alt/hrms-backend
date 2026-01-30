<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1LnvpQhRauz6CHcFFI7IFWPauGL8SLuDi

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## HRMS Backend (FastAPI)

**Prerequisites:** Python 3.11+

1. Create a virtual environment and install dependencies:
   `python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt`
2. Apply migrations:
   `alembic upgrade head`
3. Run the API:
   `uvicorn app.main:app --reload`

Swagger docs are available at `http://localhost:8000/docs`.
