from database import get_users,get_goal, get_all_goals, create_goal, create_user


# # Test create user
# user_id = create_user(
#     "Salina",
#     "salina2@test.com",
# )

goal_id = create_goal(
    "dinner",
    "5000",
)


# print("Created User ID:", user_id)

# # Test get by email
# user = get_users()
# print("users:", user)

goal = get_all_goals()
print("goals:", goal)


# # Test get by id
# user2 = get_user_by_id(user_id)
# print("Get By ID:", user2)