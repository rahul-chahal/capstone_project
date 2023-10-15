import cv2
import numpy as np
import Main2
import time
import datetime

# Load YOLO model
config_path = 'yolov3.cfg'
weights_path = 'yolov3.weights'
classes_path = 'yolov3.txt'

net = cv2.dnn.readNet(weights_path, config_path)

def get_output_layers(net):
    layer_names = net.getLayerNames()
    try:
        output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers()]
    except:
        output_layers = [layer_names[i[0] - 1] for i in net.getUnconnectedOutLayers()]
    return output_layers

def draw_prediction(img, class_id, confidence, x, y, x_plus_w, y_plus_h):
    label = str(classes[class_id])
    color = COLORS[class_id]
    cv2.rectangle(img, (x, y), (x_plus_w, y_plus_h), color, 2)
    cv2.putText(img, label, (x - 10, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)

# Read class names
classes = None
with open(classes_path, 'r') as f:
    classes = [line.strip() for line in f.readlines()]

# Initialize random colors
COLORS = np.random.uniform(0, 255, size=(len(classes), 3))

# Define a video capture object
vid = cv2.VideoCapture(0)

while True:
    # Capture the video frame
    ret, frame = vid.read()
    human_count = 0

    # Perform object detection
    blob = cv2.dnn.blobFromImage(frame, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
    net.setInput(blob)
    outs = net.forward(get_output_layers(net))

    # Initialize lists for detection results
    class_ids = []
    confidences = []
    boxes = []

    conf_threshold = 0.5
    nms_threshold = 0.4

    # Process YOLO output
    for out in outs:
        for detection in out:
            scores = detection[5:]
            class_id = np.argmax(scores)
            confidence = scores[class_id]
            if confidence > conf_threshold:
                center_x = int(detection[0] * frame.shape[1])
                center_y = int(detection[1] * frame.shape[0])
                w = int(detection[2] * frame.shape[1])
                h = int(detection[3] * frame.shape[0])
                x = center_x - w // 2
                y = center_y - h // 2
                class_ids.append(class_id)
                confidences.append(float(confidence))
                boxes.append([x, y, w, h])
                

    # Apply non-maximum suppression
    indices = cv2.dnn.NMSBoxes(boxes, confidences, conf_threshold, nms_threshold)

    # Draw bounding boxes and labels
    for i in indices:
        box = boxes[i]
        # print(f"{class_ids[i]}")
        x, y, w, h = box
        if class_ids[i] == 0:
            human_count += 1
            draw_prediction(frame, class_ids[i], confidences[i], round(x), round(y), round(x + w), round(y + h))

    cv2.putText(frame, f"Human count: {human_count}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
    
    # # Display the resulting frame
    cv2.imshow('Real-time Object Detection', frame)

    # Display the count of detected humans on the frame
    cv2.putText(frame, f'Human Count: {human_count}', (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

    # Check if the 'q' key is pressed to quit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
# Release video capture resources and close OpenCV windows
print(f"Number of humans detected: {human_count}")
current_datetime = datetime.datetime.now()
human_count=3
if human_count>=3:
# i am taking pause of 5 seconds to detect no plate from same camera
    time.sleep(5)
    plate=Main2.main()
    print(plate)
    print(current_datetime)

vid.release()
cv2.destroyAllWindows()