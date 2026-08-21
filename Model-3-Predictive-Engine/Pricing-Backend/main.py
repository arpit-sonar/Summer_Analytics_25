from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd 

app =  FastAPI(title="Dynamic Parking Pricing API")

origins = [
    "https://predictive-pricing-dashboard-chat-app6.vercel.app", 
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    xgb_model = joblib.load('parking_pricing_model.pkl')
    lot_encoder = joblib.load('lot_encoder.pkl')
except Exception as e:
    print(f"Error loading models: {e}")

class ParkingData(BaseModel):
    system_code: str
    capacity: int
    queue_length: int
    is_special_day: int
    traffic_condition: str  
    vehicle_type: str       
    day_of_week: int

def calculate_price(predicted_occupancy, capacity, queue, traffic_val, vehicle_val, is_special):
    base_price = 10
    alpha, beta, gamma, delta, epsilon, lambda_ = 1.5, 0.8, 0.5, 1.5, 1.2, 0.9
    min_demand, max_demand = 0, 10
    
    demand = (
        alpha * (predicted_occupancy / capacity) +
        beta * queue -
        gamma * traffic_val +
        delta * is_special +
        epsilon * vehicle_val
    )
    
    normalized_demand = max(0, min(1, (demand - min_demand) / (max_demand - min_demand)))
    
    temp_price = base_price * (1 + (lambda_ * normalized_demand))
    final_price = max(base_price * 0.5, min(base_price * 2.0, temp_price))
    
    return round(final_price, 2)

@app.post("/api/get-price")
def get_dynamic_price(data: ParkingData):
    try:
        traffic_map = {'low': 3.0, 'average': 6.0, 'high': 9.0}
        vehicle_map = {'cycle': 0.65, 'bike': 0.85, 'car': 1.15, 'truck': 1.35}
        
        traffic_val = traffic_map.get(data.traffic_condition, 6.0)
        vehicle_val = vehicle_map.get(data.vehicle_type, 1.15)
        
        lot_id_encoded = lot_encoder.transform([data.system_code])[0]
        
        features = pd.DataFrame([[
            lot_id_encoded, data.capacity, data.queue_length, data.is_special_day,
            traffic_val, vehicle_val, data.hour, data.day_of_week
        ]], columns=['Lot_ID', 'Capacity', 'QueueLength', 'IsSpecialDay', 'traffic_level', 'vehicle_type_weight', 'Hour', 'DayOfWeek'])
        
        pred_occ = xgb_model.predict(features)[0]
        pred_occ = max(0, min(float(pred_occ), data.capacity)) 
        
        final_price = calculate_price(
            pred_occ, data.capacity, data.queue_length, 
            traffic_val, vehicle_val, data.is_special_day
        )
        
        return {
            "status": "success",
            "data": {
                "system_code": data.system_code,
                "predicted_occupancy_in_30_mins": int(pred_occ),
                "dynamic_price_usd": final_price
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))