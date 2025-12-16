# models/order_item_model.py
from models import db

class OrderItem(db.Model):
    __tablename__ = "order_items"

    # ✅ matches DB: order_items_id
    order_items_id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    order_id = db.Column(db.Integer, db.ForeignKey("orders.order_id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.product_id"), nullable=False)

    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)

    # ✅ matches DB: subtotal NOT NULL
    subtotal = db.Column(db.Numeric(10, 2), nullable=False)

    # ✅ matches DB: timestamp default current_timestamp()
    created_at = db.Column(
        db.DateTime,
        server_default=db.text("CURRENT_TIMESTAMP"),
        nullable=False
    )

    # ⚠️ IMPORTANT:
    # Do NOT add `product = relationship(...)` here if your Product model already uses backref='product'
    # (that caused your backref conflict before). Rely on existing backref if you already have it.

    def to_dict(self):
        return {
            "order_items_id": self.order_items_id,
            "order_id": self.order_id,
            "product_id": self.product_id,
            "quantity": int(self.quantity),
            "price": float(self.price),
            "subtotal": float(self.subtotal),
            "created_at": self.created_at,
            # ✅ will work if Product.order_items has backref="product"
            "product_name": self.product.name if hasattr(self, "product") and self.product else None,
            "image_url": self.product.image_url if hasattr(self, "product") and self.product else None,
        }
