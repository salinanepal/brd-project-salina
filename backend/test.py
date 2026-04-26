from logic import get_user_by_email, get_user_by_id, create_user

# Test create user
user_id = create_user(
    "Salina",
    "salina@test.com",
    "hashedpassword123"
)

print("Created User ID:", user_id)

# Test get by email
user = get_user_by_email("salina@test.com")
print("Get By Email:", user)

# Test get by id
user2 = get_user_by_id(user_id)
print("Get By ID:", user2)