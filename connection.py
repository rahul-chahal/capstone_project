import requests
import json

# Replace 'API_URL' with the actual URL of the API endpoint you want to POST to
# api_url = 'http://jsonplaceholder.typicode.com/todos'
api_url= 'http://127.0.0.1:5000/entry'

# Define the data you want to send in JSON format
payload = {
    'vNum': 'BBA96B',
    'vDate':'09-10-2023',
    'vTime': '11:55:55',
    'pNum': 4
}


try:
    # Send a POST request to the API with the JSON payload
    response = requests.post(api_url, json=payload)

    # Check if the request was successful (status code 200)
    if response.status_code == 200:
        # Parse the JSON response, if the API returns JSON data
        data = response.json()
        
        # Now you can work with the response data
        print(data)
    else:
        print(f"Request failed with status code {response.status_code}")
except requests.exceptions.RequestException as e:
    print(f"Request error: {e}")
