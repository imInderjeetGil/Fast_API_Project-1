from pydantic import BaseModel

class CartItemAdd(BaseModel):
    product_id: int
    quantity: int = 1
    
class CartItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    
    class Config:
        from_attributes = True