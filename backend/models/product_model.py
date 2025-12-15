from models import db
from datetime import datetime
from models.category_model import Category  # make sure this import path matches your project

class Product(db.Model):
    __tablename__ = "products"

    product_id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.category_id"), nullable=True)

    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    stock = db.Column(db.Integer, default=0)
    image_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # ✅ Relationship so we can access product.category.name
    category = db.relationship("Category", backref=db.backref("products", lazy=True))

    inventory = db.relationship("Inventory", backref="product", uselist=False)
    order_items = db.relationship("OrderItem", backref="product", lazy=True)

    def to_dict(self):
        return {
            "product_id": self.product_id,
            "category_id": self.category_id,
            "category_name": self.category.name if self.category else None,  # ✅ added
            "name": self.name,
            "description": self.description,
            "price": float(self.price),
            "stock": self.stock,
            "image_url": self.image_url,
            "created_at": self.created_at.isoformat() if self.created_at else None,  # ✅ JSON friendly
        }
