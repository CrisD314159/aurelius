from fastapi import APIRouter

user_router = APIRouter(
    prefix="/user"
)


@user_router.post("/register")
def register_user():
    pass


@user_router.get("verify_regitered")
def verify_registered_user():
    pass
