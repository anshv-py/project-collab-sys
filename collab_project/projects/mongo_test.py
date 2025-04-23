from pymongo import MongoClient
from django.http import HttpResponse

try:
    # Replace with your actual connection URI
    client = MongoClient("mongodb+srv://anshvahini16:Curet24.Nelll@agility-user-base.d7iwuyn.mongodb.net/")
    db = client['project_db']
    print("Connected to MongoDB successfully!")

    # Check if the connection is working by querying a collection
    users_collection = db['authentication']
    print("Collections:", db.list_collection_names())  # Lists all collections

    user_document = {
        "username": "testuser",
        "password": "hashed_password_here",  # Use actual hashed password here
        "role": "student",  # or 'faculty'
        "domain": ["AI", "Blockchain"]
    }
    result = users_collection.insert_one(user_document)
    if result.inserted_id:
        print(f"User inserted successfully with ID: {result.inserted_id}")
    else:
        print("Failed to insert user.")

except Exception as e:
    print(f"Failed to connect to MongoDB: {e}")
