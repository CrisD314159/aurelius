from fastapi import APIRouter

user_router = APIRouter(
    prefix="/user"
)


@user_router.post("/register")
def register_user():
    pass
