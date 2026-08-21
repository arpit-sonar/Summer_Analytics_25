# Capstone Project: Predictive Pricing Engine
Made under Summer Analytics 2025 by the Consulting & Analytics Club, IIT Guwahati.

  [🚀 **Live Demo**](https://predictive-pricing-dashboard-git-capstone-project-chat-app6.vercel.app/)

## 🚗 Real-Time Dynamic Parking Pricing System
A comprehensive dynamic parking pricing system that optimizes revenue and manages traffic congestion for 14 parking lots. The project evolved from a real-time data streaming simulation into a full-stack, AI-driven web application. It processes timestamped vehicle data, predicts future demand, and calculates dynamic prices using multiple pricing models.

---

## 🛠 Tech Stack

| Component           | Technology Used                                     |
|---------------------|-----------------------------------------------------|
| **Machine Learning**| Python, XGBoost, Pandas, Scikit-Learn               |
| **Stream Processing**| Pathway, Google Colab                              |
| **Backend API**     | FastAPI, Uvicorn, RESTful Architecture              |
| **Frontend UI**     | React, Vite, Axios, Recharts, Bokeh, Panel          |
| **Version Control** | Git & GitHub                                        |

---

## ⚙️ Dataset & Pipeline Overview

Each record represents the state of a parking lot at a specific timestamp, including lot capacity, current occupancy, vehicle type, traffic conditions, queue length, and special day indicators.

### 🔁 General Processing Pipeline (Pathway & Colab)
- **Step 1:** Load dataset containing 18,000+ rows.
- **Step 2:** Clean dataset: Remove rows where `Occupancy > Capacity` and create a `color` column for visualization based on `IsSpecialDay`.
- **Step 3:** Split dataset into 14 separate CSV files using `SystemCodeNumber` (each representing a parking lot).
- **Step 4:** Define a **Pathway schema** to parse data, use `datetime.strptime` for timestamps, and simulate live streaming by replaying each CSV as a timed data stream.

---

## 🧠 Core Pricing Models & Architecture Flow

The system utilizes a progressive approach, moving from heuristic baselines to predictive machine learning.

### 🔷 Model 1: Baseline Linear Pricing
> Calculates price based on occupancy trends over time using stream processing.
* **Flow:** Parses input CSVs into a Pathway streaming table.
* **Logic:** Applies a simple linear formula using `pw.windowby()` + `.reduce()` for **tumbling window logic**. 
* **Execution:** Ensures **exactly-once semantics** to avoid duplicate pricing. Output streams are visualized via a Bokeh + Panel dashboard featuring 14 tabs with live price vs. time plots.

### 🔷 Model 2: Demand-Based Pricing
> Incorporates multiple real-world factors into dynamic pricing logic.
* **Factors Used:** `QueueLength`, `TrafficConditionNearby`, `VehicleType` (weighted: truck > car > bike > cycle), and `IsSpecialDay`.
* **Flow:** Modifies each lot's stream to include traffic levels and vehicle weights.
* **Logic:** Normalizes raw demand values using min-max scaling and calculates a custom demand function.
* **Execution:** Normalizes the final price onto a 0–100 scale. Uses `windowby()` reductions and displays results with special-day highlighting on the Bokeh dashboard.

### 🔷 Model 3: AI Predictive Pricing Engine (Full-Stack Deployment)
> An advanced, decoupled architecture that predicts demand 30 minutes in advance.
* **Machine Learning:** An XGBoost Regressor (`parking_pricing_model.pkl`) processes temporal features and encoded categorical data (`lot_encoder.pkl`) to forecast future capacity.
* **Backend (FastAPI):** A high-performance Python server (`main.py`) receives live parameter updates, executes the XGBoost model, and serves the dynamically calculated price via a REST API.
* **Frontend (React + Vite):** A responsive, interactive dashboard allows users to simulate traffic spikes and temporal changes, utilizing Axios for API calls and Recharts for a live, rolling-window visualization.

---

## 🚀 How to Run the Full-Stack App Locally

To test the React and FastAPI deployment, you must run both the backend and frontend concurrently in two separate terminal windows.

**Start the Backend (Terminal 1):**
1. Navigate to the backend folder: `cd Pricing-Backend`
2. Install dependencies: `pip install fastapi uvicorn xgboost pandas scikit-learn`
3. Launch the server: `uvicorn main:app --reload`
4. The API will be live at `http://127.0.0.1:8000`

**Start the Frontend (Terminal 2):**
1. Navigate to the frontend folder: `cd Pricing-Frontend`
2. Install dependencies: `npm install`
3. Launch the development server: `npm run dev`
4. Open the provided localhost URL in your browser to view the interactive dashboard.

---

## 🔷 Contact
* **Arpit Sonar**
* **Institution:** IIT (BHU) Varanasi
* **Email:** arpitsonar12@gmail.com
