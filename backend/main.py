from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import database as db
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., min_length=3, max_length=150)

class GoalRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    target_amount: float = Field(...,gt=0)

class ContributionRequest(BaseModel):
    user_id: int
    goal_id: int
    amount: float = Field(...,gt=0)

@app.get("/users")
def list_users():
    return db.get_users()

@app.post("/users", status_code=201)
def create_user(user: UserRequest):
    try:
        new_id = db.create_user(user.name, user.email)
        return {
            "message": f"{user.name} added to the team!",
            "user": {"id": new_id, "name": user.name, "email": user.email},
        }
    except Exception:
        raise HTTPException(status_code=409, detail="Email already exists.")

@app.delete("/users/{user_id}")
def remove_user(user_id: int):
    db.delete_user(user_id)
    return {"message": "User deleted"}
    
@app.get("/goals")
def list_goals():
    return db.get_all_goals()

@app.post("/goals", status_code=201)
def create_goal(goal: GoalRequest):
    try:
        new_id = db.create_goal(goal.title, goal.target_amount)
        return {"id": new_id, "title": goal.title, "target_amount": goal.target_amount}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@app.get("/goals/{goal_id}/summary")
def goal_summary(goal_id: int):
   
    summary = db.get_goal_summary(goal_id)
 
    if not summary:
        
        raise HTTPException(status_code=404, detail="Goal not found.")
 
    return summary

@app.delete("/goals/{goal_id}")
def remove_goal(goal_id: int):
    db.delete_goal(goal_id)
    return {"message": "Goal deleted"}

@app.post("/contributions", status_code=201)
def add_contribution(contribution: ContributionRequest):
    try:
        db.add_contribution(contribution.user_id, contribution.goal_id, contribution.amount)
        summary = db.get_goal_summary(contribution.goal_id)
        return {
            "message": f"${contribution.amount:,.2f} contribution recorded!",
            "summary": summary,
        }
    except Exception as e:
        # 400 = "Bad Request"
        raise HTTPException(status_code=400, detail=str(e))


 
 
 






