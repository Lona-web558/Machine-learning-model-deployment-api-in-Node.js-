/**
 * Machine Learning Model Deployment API
 * Traditional JavaScript (ES5 style)
 * No arrow functions, no const, only var
 * Using basic Node.js modules only
 */

var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

// Configuration
var PORT = 3000;
var HOST = '127.0.0.1';

// Simple in-memory model storage
var models = {};
var predictions = [];

/**
 * Simple linear regression model for demonstration
 */
function LinearRegressionModel() {
    this.slope = 2.5;
    this.intercept = 10;
    this.name = 'linear_regression';
    this.version = '1.0.0';
}

LinearRegressionModel.prototype.predict = function(input) {
    if (typeof input !== 'number') {
        throw new Error('Input must be a number');
    }
    return this.slope * input + this.intercept;
};

/**
 * Simple classification model for demonstration
 */
function ClassificationModel() {
    this.threshold = 0.5;
    this.name = 'binary_classifier';
    this.version = '1.0.0';
}

ClassificationModel.prototype.predict = function(input) {
    if (typeof input !== 'number') {
        throw new Error('Input must be a number');
    }
    return input > this.threshold ? 'positive' : 'negative';
};

/**
 * Initialize default models
 */
function initializeModels() {
    models.linear = new LinearRegressionModel();
    models.classifier = new ClassificationModel();
    console.log('Models initialized successfully');
}

/**
 * Parse JSON body from request
 */
function parseRequestBody(req, callback) {
    var body = '';
    
    req.on('data', function(chunk) {
        body += chunk.toString();
    });
    
    req.on('end', function() {
        try {
            var parsed = body ? JSON.parse(body) : {};
            callback(null, parsed);
        } catch (err) {
            callback(err, null);
        }
    });
}

/**
 * Send JSON response
 */
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(JSON.stringify(data, null, 2));
}

/**
 * Handle OPTIONS requests for CORS
 */
function handleOptions(req, res) {
    res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
}

/**
 * Route: GET /
 * Health check endpoint
 */
function handleHealthCheck(req, res) {
    var response = {
        status: 'healthy',
        service: 'ML Model Deployment API',
        timestamp: new Date().toISOString(),
        models_loaded: Object.keys(models).length
    };
    sendResponse(res, 200, response);
}

/**
 * Route: GET /models
 * List all available models
 */
function handleListModels(req, res) {
    var modelList = [];
    
    for (var key in models) {
        if (models.hasOwnProperty(key)) {
            modelList.push({
                id: key,
                name: models[key].name,
                version: models[key].version
            });
        }
    }
    
    var response = {
        count: modelList.length,
        models: modelList
    };
    
    sendResponse(res, 200, response);
}

/**
 * Route: GET /models/:id
 * Get specific model information
 */
function handleGetModel(req, res, modelId) {
    if (!models[modelId]) {
        sendResponse(res, 404, {
            error: 'Model not found',
            model_id: modelId
        });
        return;
    }
    
    var model = models[modelId];
    var response = {
        id: modelId,
        name: model.name,
        version: model.version,
        type: model.constructor.name
    };
    
    sendResponse(res, 200, response);
}

/**
 * Route: POST /predict/:modelId
 * Make prediction using specified model
 */
function handlePredict(req, res, modelId) {
    if (!models[modelId]) {
        sendResponse(res, 404, {
            error: 'Model not found',
            model_id: modelId
        });
        return;
    }
    
    parseRequestBody(req, function(err, body) {
        if (err) {
            sendResponse(res, 400, {
                error: 'Invalid JSON in request body',
                details: err.message
            });
            return;
        }
        
        if (!body.hasOwnProperty('input')) {
            sendResponse(res, 400, {
                error: 'Missing "input" field in request body'
            });
            return;
        }
        
        try {
            var model = models[modelId];
            var prediction = model.predict(body.input);
            var predictionId = predictions.length;
            
            var record = {
                id: predictionId,
                model_id: modelId,
                input: body.input,
                output: prediction,
                timestamp: new Date().toISOString()
            };
            
            predictions.push(record);
            
            sendResponse(res, 200, {
                prediction_id: predictionId,
                model_id: modelId,
                input: body.input,
                output: prediction,
                timestamp: record.timestamp
            });
            
        } catch (err) {
            sendResponse(res, 500, {
                error: 'Prediction failed',
                details: err.message
            });
        }
    });
}

/**
 * Route: GET /predictions
 * Get prediction history
 */
function handleGetPredictions(req, res) {
    var parsedUrl = url.parse(req.url, true);
    var query = parsedUrl.query;
    var limit = parseInt(query.limit) || 10;
    
    var recentPredictions = predictions.slice(-limit);
    
    sendResponse(res, 200, {
        count: predictions.length,
        showing: recentPredictions.length,
        predictions: recentPredictions
    });
}

/**
 * Route: POST /batch-predict/:modelId
 * Batch prediction
 */
function handleBatchPredict(req, res, modelId) {
    if (!models[modelId]) {
        sendResponse(res, 404, {
            error: 'Model not found',
            model_id: modelId
        });
        return;
    }
    
    parseRequestBody(req, function(err, body) {
        if (err) {
            sendResponse(res, 400, {
                error: 'Invalid JSON in request body',
                details: err.message
            });
            return;
        }
        
        if (!body.inputs || !Array.isArray(body.inputs)) {
            sendResponse(res, 400, {
                error: 'Missing or invalid "inputs" array in request body'
            });
            return;
        }
        
        try {
            var model = models[modelId];
            var results = [];
            
            for (var i = 0; i < body.inputs.length; i++) {
                var prediction = model.predict(body.inputs[i]);
                results.push({
                    input: body.inputs[i],
                    output: prediction
                });
            }
            
            sendResponse(res, 200, {
                model_id: modelId,
                count: results.length,
                predictions: results,
                timestamp: new Date().toISOString()
            });
            
        } catch (err) {
            sendResponse(res, 500, {
                error: 'Batch prediction failed',
                details: err.message
            });
        }
    });
}

/**
 * Main request router
 */
function handleRequest(req, res) {
    var parsedUrl = url.parse(req.url, true);
    var pathname = parsedUrl.pathname;
    var method = req.method;
    
    console.log(method + ' ' + pathname);
    
    // Handle CORS preflight
    if (method === 'OPTIONS') {
        handleOptions(req, res);
        return;
    }
    
    // Route matching
    if (pathname === '/' && method === 'GET') {
        handleHealthCheck(req, res);
    }
    else if (pathname === '/models' && method === 'GET') {
        handleListModels(req, res);
    }
    else if (pathname === '/predictions' && method === 'GET') {
        handleGetPredictions(req, res);
    }
    else if (pathname.match(/^\/models\/[a-zA-Z0-9_-]+$/) && method === 'GET') {
        var modelId = pathname.split('/')[2];
        handleGetModel(req, res, modelId);
    }
    else if (pathname.match(/^\/predict\/[a-zA-Z0-9_-]+$/) && method === 'POST') {
        var modelId = pathname.split('/')[2];
        handlePredict(req, res, modelId);
    }
    else if (pathname.match(/^\/batch-predict\/[a-zA-Z0-9_-]+$/) && method === 'POST') {
        var modelId = pathname.split('/')[2];
        handleBatchPredict(req, res, modelId);
    }
    else {
        sendResponse(res, 404, {
            error: 'Route not found',
            path: pathname,
            method: method
        });
    }
}

/**
 * Start the server
 */
function startServer() {
    initializeModels();
    
    var server = http.createServer(handleRequest);
    
    server.listen(PORT, HOST, function() {
        console.log('===========================================');
        console.log('ML Model Deployment API Server Started');
        console.log('===========================================');
        console.log('Host: ' + HOST);
        console.log('Port: ' + PORT);
        console.log('URL: http://' + HOST + ':' + PORT);
        console.log('===========================================');
        console.log('');
        console.log('Available Endpoints:');
        console.log('  GET  /                        - Health check');
        console.log('  GET  /models                  - List all models');
        console.log('  GET  /models/:id              - Get model info');
        console.log('  POST /predict/:id             - Make prediction');
        console.log('  POST /batch-predict/:id       - Batch predictions');
        console.log('  GET  /predictions             - View prediction history');
        console.log('===========================================');
    });
    
    server.on('error', function(err) {
        if (err.code === 'EADDRINUSE') {
            console.error('Error: Port ' + PORT + ' is already in use');
            console.error('Please choose a different port or stop the other process');
        } else {
            console.error('Server error:', err);
        }
        process.exit(1);
    });
}

// Start the server
startServer();
