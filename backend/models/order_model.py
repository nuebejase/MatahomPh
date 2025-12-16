# models/order_model.py
from models import db
from datetime import datetime

class Order(db.Model):
    __tablename__ = "orders"

    order_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)

    total_amount = db.Column(db.Numeric(10, 2), nullable=False, default=0)
    status = db.Column(
        db.Enum("pending", "shipped", "delivered", "cancelled", name="order_status"),
        nullable=False,
        default="pending",
    )
    shipping_address = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    items = db.relationship(
        "OrderItem",
        backref="order",
        lazy=True,
        cascade="all, delete-orphan"
    )
    payment = db.relationship("Payment", backref="order", uselist=False)

    def to_dict(self):
        return {
            "order_id": self.order_id,
            "user_id": self.user_id,
            "total_amount": float(self.total_amount) if self.total_amount is not None else 0.0,
            "status": self.status,
            "shipping_address": self.shipping_address,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "items": [item.to_dict() for item in (self.items or [])],
        }
