import joblib
import numpy as np
print("Testing Python...")

try:
    model_data = joblib.load('models/diabetes_model.joblib')
    print("✅ Model loaded successfully!")
    
    # Test prediction
    test_data = [1, 85, 66, 29, 0, 26.6, 0.351, 31]
    input_array = np.array([test_data])
    input_scaled = model_data['scaler'].transform(input_array)
    prediction = model_data['model'].predict(input_scaled)[0]
    
    print(f"✅ Test prediction: {prediction}")
    
except Exception as e:
    print(f"❌ Error: {e}")