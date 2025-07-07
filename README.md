# Capstone Project :
Made under Summer Analytics'25 of CAC of IIT Guwahati

# 🚗 Real-Time Dynamic Parking Pricing System

A real-time pricing simulation for 14 parking lots using timestamped vehicle and traffic data. This system calculates dynamic parking prices using two pricing models—baseline linear and demand-based—executed via real-time logic built on top of Pathway, Pandas, and Bokeh in Google Colab.

---

## 🛠 Tech Stack

| Component           | Technology Used                    |
|---------------------|------------------------------------|
| Programming         | Python (NumPy, Pandas)             |
| Real-Time Processing| [Pathway](https://pathway.com)     |
| Visualization       | Bokeh, Panel                       |
| Environment         | Google Colab                       |
| Data Format         | CSV-based stream simulation        |
| Version Control     | Git & GitHub                       |

---

## ⚙️ Dataset Overview

Each record represents the state of a parking lot at a certain timestamp, including:
- Lot capacity and current occupancy
- Type of vehicle entering
- Traffic conditions nearby
- Queue length
- Special day indicator
- Date and time of update

---

## 📊 Architecture Flow 

### 🔁 General Processing Pipeline

- **Step 1**: Load dataset containing 18,000+ rows.
- **Step 2**: Clean dataset:
  - Remove rows where `Occupancy > Capacity`.
  - Create a new column `color` for Bokeh visualization based on `IsSpecialDay`.
- **Step 3**: Split dataset into 14 separate CSV files using `SystemCodeNumber` (each represents a parking lot).
- **Step 4**: For each file (lot):
  - Define a **Pathway schema** to parse data.
  - Parse timestamps using `datetime.strptime`.
  - Simulate streaming by replaying each CSV as a timed data stream to Pathway.

---

## 🧠 Pricing Models

### 🔷 Model 1: Baseline Linear Pricing

> Calculates price based on occupancy trend over time.

**Flow:**
- Apply data cleaning and create `color` column.
- Parse input CSV into Pathway streaming table using schema.
- Parse timestamps and convert to datetime.
- Define a simple linear formula:
- Use `pw.windowby()` + `.reduce()` to apply **tumbling window logic**.
- Ensure **exactly-once semantics** to avoid duplicate pricing.
- Store windowed result as output stream.
- Build a **Bokeh + Panel dashboard**:
- 14 tabs (one for each parking lot)
- Live price vs time plots
- Color-coded by special day


---

### 🔷 Model 2: Demand-Based Pricing

> Incorporates multiple real-world factors into dynamic pricing logic.

**Additional Columns Added:**
- `TrafficLevel`: low, average, high
- `VehicleTypeWeight`: numeric value based on type (e.g., truck > car > bike > cycle)

**Flow:**
- Modify each lot's CSV to include above columns.
- Parse data into Pathway using defined schema.
- Create custom demand function:
- Factors used: `QueueLength`, `TrafficConditionNearby`, `VehicleType`, `IsSpecialDay`
- Normalize raw demand value using min-max scaling
- Calculate price:
- Normalize price into a 0–100 scale for visual interpretation.
- Use `windowby()` with appropriate reduce function.
- Display 14 Bokeh tabs:
- Price vs time
- Special-day highlighting

---

### 🔷 **Contact**
- Arpit Sonar
- Email: arpitsonar12@gmail.com
- IIT BHU


