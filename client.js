/**
 * Test Client for ML Model Deployment API
 * Traditional JavaScript (ES5 style)
 */

var http = require('http');

var API_HOST = '127.0.0.1';
var API_PORT = 3000;

/**
 * Make HTTP request
 */
function makeRequest(options, data, callback) {
    var req = http.request(options, function(res) {
        var body = '';
        
        res.on('data', function(chunk) {
            body += chunk;
        });
        
        res.on('end', function() {
            try {
                var parsed = JSON.parse(body);
                callback(null, parsed, res.statusCode);
            } catch (err) {
                callback(err, null, res.statusCode);
            }
        });
    });
    
    req.on('error', function(err) {
        callback(err, null, null);
    });
    
    if (data) {
        req.write(JSON.stringify(data));
    }
    
    req.end();
}

/**
 * Test 1: Health Check
 */
function testHealthCheck(callback) {
    console.log('\n========================================');
    console.log('Test 1: Health Check');
    console.log('========================================');
    
    var options = {
        hostname: API_HOST,
        port: API_PORT,
        path: '/',
        method: 'GET'
    };
    
    makeRequest(options, null, function(err, data, statusCode) {
        if (err) {
            console.log('ERROR:', err.message);
            callback();
            return;
        }
        
        console.log('Status Code:', statusCode);
        console.log('Response:', JSON.stringify(data, null, 2));
        callback();
    });
}

/**
 * Test 2: List Models
 */
function testListModels(callback) {
    console.log('\n========================================');
    console.log('Test 2: List All Models');
    console.log('========================================');
    
    var options = {
        hostname: API_HOST,
        port: API_PORT,
        path: '/models',
        method: 'GET'
    };
    
    makeRequest(options, null, function(err, data, statusCode) {
        if (err) {
            console.log('ERROR:', err.message);
            callback();
            return;
        }
        
        console.log('Status Code:', statusCode);
        console.log('Response:', JSON.stringify(data, null, 2));
        callback();
    });
}

/**
 * Test 3: Get Specific Model
 */
function testGetModel(callback) {
    console.log('\n========================================');
    console.log('Test 3: Get Model Information');
    console.log('========================================');
    
    var options = {
        hostname: API_HOST,
        port: API_PORT,
        path: '/models/linear',
        method: 'GET'
    };
    
    makeRequest(options, null, function(err, data, statusCode) {
        if (err) {
            console.log('ERROR:', err.message);
            callback();
            return;
        }
        
        console.log('Status Code:', statusCode);
        console.log('Response:', JSON.stringify(data, null, 2));
        callback();
    });
}

/**
 * Test 4: Linear Regression Prediction
 */
function testLinearPrediction(callback) {
    console.log('\n========================================');
    console.log('Test 4: Linear Regression Prediction');
    console.log('========================================');
    
    var options = {
        hostname: API_HOST,
        port: API_PORT,
        path: '/predict/linear',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    var testData = {
        input: 5
    };
    
    console.log('Input:', testData.input);
    
    makeRequest(options, testData, function(err, data, statusCode) {
        if (err) {
            console.log('ERROR:', err.message);
            callback();
            return;
        }
        
        console.log('Status Code:', statusCode);
        console.log('Response:', JSON.stringify(data, null, 2));
        console.log('Expected: 2.5 * 5 + 10 = 22.5');
        callback();
    });
}

/**
 * Test 5: Classification Prediction
 */
function testClassificationPrediction(callback) {
    console.log('\n========================================');
    console.log('Test 5: Classification Prediction');
    console.log('========================================');
    
    var options = {
        hostname: API_HOST,
        port: API_PORT,
        path: '/predict/classifier',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    var testData = {
        input: 0.8
    };
    
    console.log('Input:', testData.input);
    
    makeRequest(options, testData, function(err, data, statusCode) {
        if (err) {
            console.log('ERROR:', err.message);
            callback();
            return;
        }
        
        console.log('Status Code:', statusCode);
        console.log('Response:', JSON.stringify(data, null, 2));
        console.log('Expected: "positive" (input > 0.5)');
        callback();
    });
}

/**
 * Test 6: Batch Prediction
 */
function testBatchPrediction(callback) {
    console.log('\n========================================');
    console.log('Test 6: Batch Prediction');
    console.log('========================================');
    
    var options = {
        hostname: API_HOST,
        port: API_PORT,
        path: '/batch-predict/linear',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    var testData = {
        inputs: [1, 2, 3, 4, 5]
    };
    
    console.log('Inputs:', testData.inputs);
    
    makeRequest(options, testData, function(err, data, statusCode) {
        if (err) {
            console.log('ERROR:', err.message);
            callback();
            return;
        }
        
        console.log('Status Code:', statusCode);
        console.log('Response:', JSON.stringify(data, null, 2));
        callback();
    });
}

/**
 * Test 7: View Predictions History
 */
function testGetPredictions(callback) {
    console.log('\n========================================');
    console.log('Test 7: View Prediction History');
    console.log('========================================');
    
    var options = {
        hostname: API_HOST,
        port: API_PORT,
        path: '/predictions?limit=5',
        method: 'GET'
    };
    
    makeRequest(options, null, function(err, data, statusCode) {
        if (err) {
            console.log('ERROR:', err.message);
            callback();
            return;
        }
        
        console.log('Status Code:', statusCode);
        console.log('Response:', JSON.stringify(data, null, 2));
        callback();
    });
}

/**
 * Test 8: Invalid Model Error
 */
function testInvalidModel(callback) {
    console.log('\n========================================');
    console.log('Test 8: Invalid Model Error Handling');
    console.log('========================================');
    
    var options = {
        hostname: API_HOST,
        port: API_PORT,
        path: '/predict/nonexistent',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    var testData = {
        input: 5
    };
    
    makeRequest(options, testData, function(err, data, statusCode) {
        if (err) {
            console.log('ERROR:', err.message);
            callback();
            return;
        }
        
        console.log('Status Code:', statusCode);
        console.log('Response:', JSON.stringify(data, null, 2));
        console.log('Expected: 404 error');
        callback();
    });
}

/**
 * Test 9: Invalid Input Error
 */
function testInvalidInput(callback) {
    console.log('\n========================================');
    console.log('Test 9: Invalid Input Error Handling');
    console.log('========================================');
    
    var options = {
        hostname: API_HOST,
        port: API_PORT,
        path: '/predict/linear',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    var testData = {
        wrong_field: 'invalid'
    };
    
    makeRequest(options, testData, function(err, data, statusCode) {
        if (err) {
            console.log('ERROR:', err.message);
            callback();
            return;
        }
        
        console.log('Status Code:', statusCode);
        console.log('Response:', JSON.stringify(data, null, 2));
        console.log('Expected: 400 error');
        callback();
    });
}

/**
 * Run all tests sequentially
 */
function runAllTests() {
    console.log('==========================================');
    console.log('ML Model Deployment API - Test Suite');
    console.log('==========================================');
    console.log('Target: http://' + API_HOST + ':' + API_PORT);
    
    testHealthCheck(function() {
        testListModels(function() {
            testGetModel(function() {
                testLinearPrediction(function() {
                    testClassificationPrediction(function() {
                        testBatchPrediction(function() {
                            testGetPredictions(function() {
                                testInvalidModel(function() {
                                    testInvalidInput(function() {
                                        console.log('\n========================================');
                                        console.log('All Tests Completed!');
                                        console.log('========================================\n');
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

// Check if server is running before testing
function checkServer(callback) {
    var options = {
        hostname: API_HOST,
        port: API_PORT,
        path: '/',
        method: 'GET'
    };
    
    var req = http.request(options, function(res) {
        callback(true);
    });
    
    req.on('error', function(err) {
        callback(false);
    });
    
    req.end();
}

// Main execution
checkServer(function(isRunning) {
    if (!isRunning) {
        console.log('\n========================================');
        console.log('ERROR: Server is not running!');
        console.log('========================================');
        console.log('Please start the server first:');
        console.log('  node ml-deployment-api.js');
        console.log('========================================\n');
        process.exit(1);
    } else {
        runAllTests();
    }
});
