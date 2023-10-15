import cv2
url = 'http://192.168.1.150:8080'

cap = cv2.VideoCapture(url)

while True:
    ret, frame = cap.read()
    cv2.imshow('Camera Feed', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
