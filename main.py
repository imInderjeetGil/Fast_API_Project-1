from fastapi import FastAPI
from db.session import engine
from models import user,product, cart, order, review
from db.base import Base
from api import product,auth, cart, order, payment, review
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware
import os



Base.metadata.create_all(bind=engine)

ENV = os.getenv("ENV")
print(ENV)
if ENV == "prod":
    app = FastAPI(title="Welcome to TechZone E_Com",docs_url=None, redoc_url=None)
else:
    app = FastAPI(title="Demo of FastAPI Basics")

app.router.redirect_slashes = False
templates = Jinja2Templates(directory="templates")

app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://inderforge.app"],  # ← production domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status":"ok"}

@app.get("/")
def home(request: Request):
    return templates.TemplateResponse(
        "home.html",
        {"request": request}
    )

@app.get("/products-ui")
def products_ui(request: Request):
    return templates.TemplateResponse(
        "products.html",
        {"request": request}
    )
    
@app.get("/product/{product_id}")
def product_detail(product_id: int, request: Request):
    return templates.TemplateResponse(
        "product_detail.html",
        {"request": request, "product_id": product_id}
    )


@app.get("/add-product-ui")
def add_product_ui(request:Request):
    return templates.TemplateResponse(
        "add_products.html",
        {"request": request}
    )    

@app.get("/edit-product-ui")
def edit_product_ui(request: Request):
    return templates.TemplateResponse(
        "edit_product.html",
        {"request": request}
    )

@app.get("/register-ui")
def register_ui(request: Request):
    return templates.TemplateResponse(
        "register_user.html",
        {"request":request}
    )


@app.get("/login-ui")
def login_ui(request: Request):
    return templates.TemplateResponse(
        "login.html",
        {"request": request}
    )

@app.get("/cart-ui")
def cart_ui(request: Request):
    return templates.TemplateResponse(
        "cart.html",
        {"request":request}
    )

@app.get("/orders-ui")
def orders_ui(request: Request):
    return templates.TemplateResponse(
        "orders.html",
        {"request": request}
    )
    
@app.get("/payment-success")
def payment_success(request: Request):
    return templates.TemplateResponse(
        "payment_success.html",
        {"request": request}
    )

app.include_router(product.router)
app.include_router(auth.router)
app.include_router(cart.router)
app.include_router(order.router)
app.include_router(payment.router)
app.include_router(review.router)
