//----------------------------------------------spoof detection added--------------------------------------------------------
// const video = document.getElementById('video');
// const registerButton = document.getElementById('register');
// const recognizeButton = document.getElementById('recognize');
// const canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');
// const employees = {};
// let faceMatcher;
// let recognitionActive = false;
// let personDetectionModel;
// let spoofModel, maxSpoofPredictions;

// // Access the webcam
// navigator.mediaDevices.getUserMedia({ video: true })
//     .then(stream => {
//         video.srcObject = stream;
//         console.log("Webcam access granted");
//     })
//     .catch(err => {
//         console.error("Error accessing the camera: ", err);
//     });

// // Load models
// async function loadModels() {
//     const MODEL_URL = 'models';
//     console.log("Loading models...");
//     await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
//     await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
//     await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
//     console.log("Face-api.js models loaded");

//     // Load COCO-SSD model
//     personDetectionModel = await cocoSsd.load();
//     console.log("COCO-SSD model loaded");
// }

// // Load spoof detection model
// async function loadSpoofingModel() {
//     const modelURL = './my_model/model.json';
//     const metadataURL = './my_model/metadata.json';
//     spoofModel = await tmImage.load(modelURL, metadataURL);
//     maxSpoofPredictions = spoofModel.getTotalClasses();
//     console.log("Spoof detection model loaded");
// }

// // Register employee
// registerButton.addEventListener('click', async () => {
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//     const imageData = canvas.toDataURL('image/png');
//     const employeeName = prompt("Enter employee name:");

//     if (employeeName) {
//         employees[employeeName] = imageData;
//         displayEmployees();
//         recognizeButton.disabled = false;
//         console.log(`Employee registered: ${employeeName}`);

//         // Update the face matcher with the new employee
//         faceMatcher = await createFaceMatcher();
//         console.log("Registered updated with new employee");
//     }
// });

// // Display captured employee photos
// function displayEmployees() {
//     const employeeDiv = document.getElementById('employees');
//     employeeDiv.innerHTML = '';
//     for (const [name, image] of Object.entries(employees)) {
//         const img = document.createElement('img');
//         img.src = image;
//         img.width = 100;
//         img.alt = name;
//         employeeDiv.appendChild(img);
//         employeeDiv.appendChild(document.createTextNode(name));
//         employeeDiv.appendChild(document.createElement('br'));
//     }
// }

// // Create labeled descriptors
// async function createLabeledDescriptors() {
//     const descriptors = [];
//     for (const [name, imageData] of Object.entries(employees)) {
//         const img = await faceapi.fetchImage(imageData);
//         const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
//         if (detections) {
//             descriptors.push(new faceapi.LabeledFaceDescriptors(name, [detections.descriptor]));
//         } else {
//             console.warn(`No face detected for ${name}`);
//         }
//     }
//     return descriptors;
// }

// // Create face matcher
// async function createFaceMatcher() {
//     const labeledDescriptors = await createLabeledDescriptors();
//     return new faceapi.FaceMatcher(labeledDescriptors);
// }

// // Start recognition process
// recognizeButton.addEventListener('click', async () => {
//     if (!recognitionActive) {
//         recognitionActive = true;
//         recognizeButton.disabled = true;

//         console.log("Recognition started");
//         if (!faceMatcher) {
//             faceMatcher = await createFaceMatcher();
//             console.log("Face matcher created");
//         }
//         detectPerson();
//     }
// });

// async function detectPerson() {
//     console.log("Person detection started");
//     let lastDetection = false;

//     while (recognitionActive) {
//         const predictions = await personDetectionModel.detect(video);
//         const personDetected = predictions.some(prediction => prediction.class === 'person');

//         if (personDetected) {
//             if (!lastDetection) {
//                 console.log("Person detected! Starting recognition...");
//                 lastDetection = true;
//             }
//             await recognizeFaces();
//         } else {
//             if (lastDetection) {
//                 console.log("No person detected. Stopping recognition...");
//                 lastDetection = false;
//                 document.getElementById('recognized-employee').innerHTML = '';
//             }
//         }
//         await new Promise(requestAnimationFrame);
//     }
// }

// async function recognizeFaces() {
//     const detections = await faceapi.detectAllFaces(video)
//         .withFaceLandmarks()
//         .withFaceDescriptors();

//     console.log("Detections:", detections);
//     const recognizedList = document.getElementById('recognized-employee');
//     recognizedList.innerHTML = '';

//     if (detections.length > 0) {
//         const resizedDetections = faceapi.resizeResults(detections, { width: video.width, height: video.height });
//         const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));

//         console.log("Recognition results:", results);

//         // Check for spoofing using webcam image
//         const prediction = await spoofModel.predict(video);
//         const spoofDetected = prediction.some(pred => pred.className === 'spoof' && pred.probability > 0.5); // Adjust threshold as necessary

//         if (spoofDetected) {
//             const li = document.createElement('li');
//             li.textContent = 'Spoof detected!......';
//             recognizedList.appendChild(li);
//             console.log("Spoof detected! Stopping recognition...");
//             return; 
//         }

//         // Continue with recognition if no spoof detected
//         results.forEach(result => {
//             const [label, distance] = result.toString().split(' ');
//             console.log(`Detected: ${label}, Distance: ${parseFloat(distance.replace("(", "").replace(")", ""))}`);
//             const name = parseFloat(distance.replace("(", "").replace(")", "")) < 0.4 ? label : 'unknown';
//             const li = document.createElement('li');
//             li.textContent = name;
//             recognizedList.appendChild(li);
//         });
//     } else {
//         const li = document.createElement('li');
//         li.textContent = 'No face detected';
//         recognizedList.appendChild(li);
//     }
// }

// // Initial model loading
// loadModels();
// loadSpoofingModel();

//-------------------------------------------------------------main code-----------------------------------

// const video = document.getElementById('video');
// let employees = {};
// let isRecognizing = false;
// let recognitionInterval;

// async function loadModels() {
//     await Promise.all([
//         faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
//         faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
//         faceapi.nets.faceRecognitionNet.loadFromUri('/models')
//     ]);
//     console.log("Models loaded successfully.");
// }

// async function setupCamera() {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//     video.srcObject = stream;
//     return new Promise((resolve) => {
//         video.onloadedmetadata = () => resolve(video);
//     });
// }

// async function capturePhoto() {
//     const canvas = document.createElement('canvas');
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//     return faceapi.detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
//         .withFaceLandmarks()
//         .withFaceDescriptors();
// }

// async function registerEmployee() {
//     await setupCamera();
//     const detections = await capturePhoto();

//     if (detections.length > 0) {
//         const name = prompt("Enter employee name:");
//         if (name && !employees[name]) {
//             employees[name] = detections[0].descriptor; 
//             document.getElementById('message').innerText = `Employee ${name} registered.`;
//         } else if (employees[name]) {
//             document.getElementById('message').innerText = "Employee already registered.";
//         }
//     } else {
//         document.getElementById('message').innerText = "No face detected. Please try again.";
//     }
// }

// async function recognizeEmployee() {
//     await setupCamera();
//     isRecognizing = true;
      
//     const labeledDescriptors = Object.keys(employees).map(name => new faceapi.LabeledFaceDescriptors(name, [employees[name]]));
//     const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.4);

//     recognitionInterval = setInterval(async () => {
//         const detections = await capturePhoto();

//         if (detections.length > 0) {
//             detections.forEach(d => {
//                 const result = faceMatcher.findBestMatch(d.descriptor);
//                 const label = result.toString().split(' ')[0]; 
//                 document.getElementById('message').innerText = `Recognized: ${label}`;
//             });
//         }
//     }, 1000);
// }

// function stopRecognition() {
//     if (isRecognizing) {
//         clearInterval(recognitionInterval); 
//         isRecognizing = false;
//         document.getElementById('message').innerText = "Recognition stopped.";
//     } else {
//         alert("Recognition is not in progress.");
//     }
// }


// document.getElementById('register').addEventListener('click', async () => {
//     if (!isRecognizing) {
//         await loadModels();
//         await registerEmployee();
//     } else {
//         alert("Stop recognition before registering a new employee.");
//     }
// });

// document.getElementById('recognition').addEventListener('click', async () => {
//     if (!isRecognizing) {
//         await loadModels();
//         recognizeEmployee();
//     } else {
//         alert("Recognition is already in progress.");
//     }
// });

// document.getElementById('stopRecognition').addEventListener('click', stopRecognition);




//------------------------------person detection code added-------------------------------
// const video = document.getElementById('video');
// let employees = {};
// let isRecognizing = false;
// let model;

// async function loadModels() {
//     await Promise.all([
//         faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
//         faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
//         faceapi.nets.faceRecognitionNet.loadFromUri('/models')
//     ]);
//     console.log("Face-api.js models loaded.");
// }

// async function loadCocoModel() {
//     model = await cocoSsd.load();
//     console.log("COCO-SSD model loaded.");
// }

// await loadModels();
// await loadCocoModel();

// async function setupCamera() {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//     video.srcObject = stream;
//     return new Promise((resolve) => {
//         video.onloadedmetadata = () => resolve(video);
//     });
// }

// async function detectPerson() {
//     const predictions = await model.detect(video);
//     return predictions;
// }

// async function capturePhoto() {
//     const canvas = document.createElement('canvas');
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//     return faceapi.detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
//         .withFaceLandmarks()
//         .withFaceDescriptors();
// }

// async function registerEmployee() {
//     await setupCamera();
//     const detections = await capturePhoto();

//     if (detections.length > 0) {
//         const name = prompt("Enter employee name:");
//         if (name && !employees[name]) {
//             employees[name] = detections[0].descriptor; 
//             document.getElementById('message').innerText = `Employee ${name} registered.`;
//         } else if (employees[name]) {
//             document.getElementById('message').innerText = "Employee already registered.";
//         }
//     } else {
//         document.getElementById('message').innerText = "No face detected. Please try again.";
//     }
// }

// async function recognizeEmployee() {
//     await setupCamera();
//     isRecognizing = true;

//     const labeledDescriptors = Object.keys(employees).map(name => new faceapi.LabeledFaceDescriptors(name, [employees[name]]));
//     const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.4);

//     const recognitionLoop = async () => {
//         const predictions = await detectPerson();
//         if (predictions.length > 0) {
//             const detections = await capturePhoto();
//             detections.forEach(d => {
//                 const result = faceMatcher.findBestMatch(d.descriptor);
//                 const label = result.toString().split(' ')[0];
//                 document.getElementById('message').innerText = `Recognized: ${label}`;
//             });
//         } else {
//             stopRecognition();
//         }
//         requestAnimationFrame(recognitionLoop);
//     };

//     requestAnimationFrame(recognitionLoop);
// }

// function stopRecognition() {
//     if (isRecognizing) {
//         isRecognizing = false;
//         document.getElementById('message').innerText = "Recognition stopped.";
//     } else {
//         console.log('recogntion stopped')
//     }
// }

// // Event listeners for buttons
// document.getElementById('register').addEventListener('click', async () => {
//     if (!isRecognizing) {
//         await registerEmployee();
//     } else {
//         alert("Stop recognition before registering a new employee.");
//     }
// });

// document.getElementById('recognition').addEventListener('click', async () => {
//     if (!isRecognizing) {
//         recognizeEmployee();
//     } else {
//         console.log('recogntion stopped')
//         //alert("Recognition is already in progress.");
//     }
// });

// document.getElementById('stopRecognition').addEventListener('click', stopRecognition);






//------------------------------------spoof detection code added------------------------------------------------------
// const video = document.getElementById('video');
// let employees = {};
// let isRecognizing = false;
// let model;

// // Load models for face recognition and spoof detection
// async function loadModels() {
//     await Promise.all([
//         faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
//         faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
//         faceapi.nets.faceRecognitionNet.loadFromUri('/models')
//     ]);
//     console.log("Face-api.js models loaded.");
// }

// async function loadCocoModel() {
//     model = await cocoSsd.load();
//     console.log("COCO-SSD model loaded.");
// }

// const URL = "./my_model/";
// let spoofModel, maxPredictions;

// // Load the spoof detection model
// async function loadSpoofModel() {
//     const modelURL = URL + "model.json";
//     const metadataURL = URL + "metadata.json";
//     spoofModel = await tmImage.load(modelURL, metadataURL);
//     maxPredictions = spoofModel.getTotalClasses();
//     console.log("Spoof detection model loaded.");
// }

// await loadModels();
// await loadCocoModel();
// await loadSpoofModel();

// async function setupCamera() {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//     video.srcObject = stream;
//     return new Promise((resolve) => {
//         video.onloadedmetadata = () => resolve(video);
//     });
// }

// async function detectPerson() {
//     const predictions = await model.detect(video);
//     return predictions;
// }

// async function capturePhoto() {
//     const canvas = document.createElement('canvas');
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//     return faceapi.detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
//         .withFaceLandmarks()
//         .withFaceDescriptors();
// }

// async function isSpoofDetected() {
//     const canvas = document.createElement('canvas');
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
//     const prediction = await spoofModel.predict(canvas);
//     console.log(prediction,'prediction spofing')
//     const spoofProbability = prediction[1].probability; 
//     console.log(spoofProbability,'probability')
//     return spoofProbability > 0.5; 
// }

// async function registerEmployee() {
//     await setupCamera();
//     const detections = await capturePhoto();

//     if (detections.length > 0) {
//         const name = prompt("Enter employee name:");
//         if (name && !employees[name]) {
//             employees[name] = detections[0].descriptor; 
//             document.getElementById('message').innerText = `Employee ${name} registered.`;
//         } else if (employees[name]) {
//             document.getElementById('message').innerText = "Employee already registered.";
//         }
//     } else {
//         document.getElementById('message').innerText = "No face detected. Please try again.";
//     }
// }

// async function recognizeEmployee() {
//     await setupCamera();
//     isRecognizing = true;
//     const labeledDescriptors = Object.keys(employees).map(name => new faceapi.LabeledFaceDescriptors(name, [employees[name]]));
//     const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.5);

//     const recognitionLoop = async () => {
//         const predictions = await detectPerson();
//         if (predictions.length > 0) {
//             const detections = await capturePhoto();
//             const spoofDetected = await isSpoofDetected();
//             console.log(spoofDetected,'boolean')
//             if (spoofDetected) {
//                 document.getElementById('message').innerText = "Spoof detected. Recognition halted.";
//                 stopRecognition();
//             } else {
//                 detections.forEach(d => {
//                     const result = faceMatcher.findBestMatch(d.descriptor);
//                     const label = result.toString().split(' ')[0];
//                     document.getElementById('message').innerText = `Recognized: ${label}`;
//                 });
//             }
//         } else {
//             stopRecognition();
//         }
//         requestAnimationFrame(recognitionLoop);
//     };

//     requestAnimationFrame(recognitionLoop);
// }

// function stopRecognition() {
//     if (isRecognizing) {
//         isRecognizing = false;
//         document.getElementById('message').innerText = "Recognition stopped.";
//     } else {
//         console.log('Recognition stopped');
//     }
// }

// // Event listeners for buttons
// document.getElementById('register').addEventListener('click', async () => {
//     if (!isRecognizing) {
//         await registerEmployee();
//     } else {
//         alert("Stop recognition before registering a new employee.");
//     }
// });

// document.getElementById('recognition').addEventListener('click', async () => {
//     if (!isRecognizing) {
//         recognizeEmployee();
//     } else {
//         console.log('Recognition is already in progress.');
//     }
// });

// document.getElementById('stopRecognition').addEventListener('click', stopRecognition);



//---------------------------------------------------------------------------------------------------------------//
// Face Recognition Code
const video = document.getElementById('video');
let employees = {};
let isRecognizing = false;
let model;
let livenessSession;

// Load Face Recognition Models
async function loadModels() {
    await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models')
    ]);
    console.log("Face-api.js models loaded.");
}

// Load COCO Model
async function loadCocoModel() {
    model = await cocoSsd.load();
    console.log("COCO-SSD model loaded.");
}

// Load Liveness Model
async function initLivenessModel() {
    livenessSession = await InferenceSession.create("./my_model/fr_liveness.onnx", { executionProviders: ['wasm'] });
    console.log("Liveness model initialized.");
}

// Setup Camera
async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    return new Promise((resolve) => {
        video.onloadedmetadata = () => resolve(video);
    });
}

// Detect Person
async function detectPerson() {
    const predictions = await model.detect(video);
    return predictions;
}

// Capture Photo
async function capturePhoto() {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return faceapi.detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();
}

// Register Employee
async function registerEmployee() {
    await setupCamera();
    const detections = await capturePhoto();

    if (detections.length > 0) {
        const name = prompt("Enter employee name:");
        if (name && !employees[name]) {
            employees[name] = detections[0].descriptor; 
            document.getElementById('message').innerText = `Employee ${name} registered.`;
        } else if (employees[name]) {
            document.getElementById('message').innerText = "Employee already registered.";
        }
    } else {
        document.getElementById('message').innerText = "No face detected. Please try again.";
    }
}

// Predict Liveness
async function predictLiveness(session, canvas_id, bbox) {
    const img = cv.imread(canvas_id); // Change to actual canvas ID

    const face_size = bbox.shape[0];
    const bbox_size = bbox.shape[1];
    const result = [];

    for (let i = 0; i < face_size; i++) {
        const x1 = parseInt(bbox.data[i * bbox_size]),
              y1 = parseInt(bbox.data[i * bbox_size + 1]),
              x2 = parseInt(bbox.data[i * bbox_size + 2]),
              y2 = parseInt(bbox.data[i * bbox_size + 3]);

        // Align and preprocess the face image (not fully shown for brevity)
        const face_img = alignLivenessImage(img, [x1, y1, x2 - x1, y2 - y1], 2.7);
        const input_image = preprocessLiveness(face_img);
        face_img.delete();

        const input_tensor = new Tensor("float32", new Float32Array(128 * 128 * 3), [1, 3, 128, 128]);
        input_tensor.data.set(input_image.data);
        const feeds = { "input": input_tensor };
        
        const output_tensor = await session.run(feeds);
        const score_arr = softmax(output_tensor['output'].data);
        result.push([x1, y1, x2, y2, score_arr[0]]);
    }
    img.delete();
    return result;
}

// Recognize Employee
async function recognizeEmployee() {
    await setupCamera();
    isRecognizing = true;

    const labeledDescriptors = Object.keys(employees).map(name => new faceapi.LabeledFaceDescriptors(name, [employees[name]]));
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.4);

    const recognitionLoop = async () => {
        const predictions = await detectPerson();
        if (predictions.length > 0) {
            const detections = await capturePhoto();
            const livenessResults = await predictLiveness(livenessSession, 'canvasId', predictions); 

            for (const d of detections) {
                const isAlive = livenessResults.some(result => result[4] > 0.5); 

                if (isAlive) {
                    const result = faceMatcher.findBestMatch(d.descriptor);
                    const label = result.toString().split(' ')[0];
                    document.getElementById('message').innerText = `Recognized: ${label}`;
                } else {
                    document.getElementById('message').innerText = "Liveness check failed.";
                    stopRecognition();
                    return; // Exit the loop if not alive
                }
            }
        } else {
            stopRecognition();
        }
        requestAnimationFrame(recognitionLoop);
    };

    requestAnimationFrame(recognitionLoop);
}

// Stop Recognition
function stopRecognition() {
    if (isRecognizing) {
        isRecognizing = false;
        document.getElementById('message').innerText = "Recognition stopped.";
    } else {
        console.log('Recognition already stopped');
    }
}

// Event Listeners for Buttons
document.getElementById('register').addEventListener('click', async () => {
    if (!isRecognizing) {
        await registerEmployee();
    } else {
        alert("Stop recognition before registering a new employee.");
    }
});

document.getElementById('recognition').addEventListener('click', async () => {
    if (!isRecognizing) {
        recognizeEmployee();
    } else {
        console.log('Recognition already in progress.');
    }
});

document.getElementById('stopRecognition').addEventListener('click', stopRecognition);

// Initialize Everything
(async () => {
    await loadModels();
    await loadCocoModel();
    await initLivenessModel(); // Load liveness model
})();
