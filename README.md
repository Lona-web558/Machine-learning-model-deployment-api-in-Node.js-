# Machine-learning-model-deployment-api-in-Node.js-
Machine learning model deployment api in Node.js 


# Machine Learning Model Deployment API

A traditional JavaScript (ES5) Node.js API for deploying and serving machine learning models.

## Features

- ✅ Traditional JavaScript (no ES6+ features)
- ✅ Only `var` declarations (no `const` or `let`)
- ✅ No arrow functions
- ✅ Basic Node.js modules only (http, url, fs, path)
- ✅ No Express or external frameworks
- ✅ RESTful API endpoints
- ✅ In-memory model storage
- ✅ Prediction history tracking
- ✅ Batch prediction support
- ✅ CORS enabled

## Requirements

- Node.js (any version with basic modules)

## Installation & Running

1. Save the code as `ml-deployment-api.js`
2. Run the server:

```bash
node ml-deployment-api.js
```

The server will start on `http://127.0.0.1:3000`

## API Endpoints

### 1. Health Check
**GET /**

Check if the API is running.

```bash
curl http://127.0.0.1:3000/
```

Response:
```json
{
  "status": "healthy",
  "service": "ML Model Deployment API",
  "timestamp": "2026-02-10T12:00:00.000Z",
  "models_loaded": 2
}
```

### 2. List All Models
**GET /models**

Get a list of all available models.

```bash
curl http://127.0.0.1:3000/models
```

Response:
```json
{
  "count": 2,
  "models": [
    {
      "id": "linear",
      "name": "linear_regression",
      "version": "1.0.0"
    },
    {
      "id": "classifier",
      "name": "binary_classifier",
      "version": "1.0.0"
    }
  ]
}
```

### 3. Get Model Information
**GET /models/:id**

Get detailed information about a specific model.

```bash
curl http://127.0.0.1:3000/models/linear
```

Response:
```json
{
  "id": "linear",
  "name": "linear_regression",
  "version": "1.0.0",
  "type": "LinearRegressionModel"
}
```

### 4. Make Prediction
**POST /predict/:modelId**

Make a single prediction using a model.

```bash
# Linear regression prediction
curl -X POST http://127.0.0.1:3000/predict/linear \
  -H "Content-Type: application/json" \
  -d '{"input": 5}'
```

Response:
```json
{
  "prediction_id": 0,
  "model_id": "linear",
  "input": 5,
  "output": 22.5,
  "timestamp": "2026-02-10T12:00:00.000Z"
}
```

```bash
# Classification prediction
curl -X POST http://127.0.0.1:3000/predict/classifier \
  -H "Content-Type: application/json" \
  -d '{"input": 0.8}'
```

Response:
```json
{
  "prediction_id": 1,
  "model_id": "classifier",
  "input": 0.8,
  "output": "positive",
  "timestamp": "2026-02-10T12:00:00.000Z"
}
```

### 5. Batch Prediction
**POST /batch-predict/:modelId**

Make multiple predictions at once.

```bash
curl -X POST http://127.0.0.1:3000/batch-predict/linear \
  -H "Content-Type: application/json" \
  -d '{"inputs": [1, 2, 3, 4, 5]}'
```

Response:
```json
{
  "model_id": "linear",
  "count": 5,
  "predictions": [
    {"input": 1, "output": 12.5},
    {"input": 2, "output": 15},
    {"input": 3, "output": 17.5},
    {"input": 4, "output": 20},
    {"input": 5, "output": 22.5}
  ],
  "timestamp": "2026-02-10T12:00:00.000Z"
}
```

### 6. View Prediction History
**GET /predictions**

Get recent prediction history.

```bash
# Get last 10 predictions (default)
curl http://127.0.0.1:3000/predictions

# Get last 20 predictions
curl http://127.0.0.1:3000/predictions?limit=20
```

Response:
```json
{
  "count": 2,
  "showing": 2,
  "predictions": [
    {
      "id": 0,
      "model_id": "linear",
      "input": 5,
      "output": 22.5,
      "timestamp": "2026-02-10T12:00:00.000Z"
    },
    {
      "id": 1,
      "model_id": "classifier",
      "input": 0.8,
      "output": "positive",
      "timestamp": "2026-02-10T12:00:01.000Z"
    }
  ]
}
```

## Pre-loaded Models

### 1. Linear Regression Model (ID: `linear`)
- Performs simple linear regression: `y = 2.5x + 10`
- Input: number
- Output: number

### 2. Binary Classifier Model (ID: `classifier`)
- Classifies inputs as positive or negative based on threshold of 0.5
- Input: number
- Output: "positive" or "negative"

## Testing the API

You can test the API using curl commands or create a simple test script:

```bash
# Test health check
curl http://127.0.0.1:3000/

# Test listing models
curl http://127.0.0.1:3000/models

# Test prediction
curl -X POST http://127.0.0.1:3000/predict/linear \
  -H "Content-Type: application/json" \
  -d '{"input": 10}'

# Test batch prediction
curl -X POST http://127.0.0.1:3000/batch-predict/classifier \
  -H "Content-Type: application/json" \
  -d '{"inputs": [0.1, 0.3, 0.6, 0.9]}'

# View predictions
curl http://127.0.0.1:3000/predictions?limit=5
```

## Configuration

You can modify these variables at the top of the file:

```javascript
var PORT = 3000;        // Server port
var HOST = '127.0.0.1'; // Server host
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `400` - Bad Request (invalid input)
- `404` - Not Found (model or route not found)
- `500` - Internal Server Error (prediction failed)

Example error response:
```json
{
  "error": "Model not found",
  "model_id": "nonexistent"
}
```

## Extending the API

To add your own model:

1. Create a model constructor function:
```javascript
function MyCustomModel() {
    this.name = 'my_model';
    this.version = '1.0.0';
    // Add your model parameters here
}
```

2. Add a predict method:
```javascript
MyCustomModel.prototype.predict = function(input) {
    // Your prediction logic here
    return result;
};
```

3. Initialize it in the `initializeModels()` function:
```javascript
function initializeModels() {
    models.linear = new LinearRegressionModel();
    models.classifier = new ClassificationModel();
    models.custom = new MyCustomModel(); // Add your model
}
```

## Notes

- All data is stored in memory and will be lost when the server restarts
- For production use, consider adding persistent storage
- The API supports CORS for cross-origin requests
- Default limit for prediction history is 10 records

## License

Free to use for any purpose.

