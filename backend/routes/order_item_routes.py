from flask import Blueprint, request, jsonify
from models import db
from models.order_item_model import OrderItem
from sqlalchemy.exc import IntegrityError

order_items_bp = Blueprint("order_items", __name__)

@order_items_bp.route("/order-items", methods=["POST"])
def create_order_item():
    data = request.get_json(silent=True) or {}

    required = ["order_id", "product_id", "quantity", "price"]
    missing = [k for k in required if k not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    try:
        qty = int(data["quantity"])
        price = float(data["price"])
        data["subtotal"] = round(qty * price, 2)

        item = OrderItem(**data)
        db.session.add(item)
        db.session.commit()
        return jsonify(item.to_dict()), 201

    except (ValueError, TypeError):
        db.session.rollback()
        return jsonify({"error": "Invalid quantity/price"}), 400

    except IntegrityError as e:
        db.session.rollback()
        return jsonify({"error": f"DB error: {str(e.orig)}"}), 400

    except Exception as e:
        db.session.rollback()
        print("CREATE ORDER ITEM ERROR:", repr(e))
        print("PAYLOAD:", data)
        return jsonify({"error": str(e)}), 500


# ✅ DELETE ORDER ITEM
@order_items_bp.route("/order-items/<int:item_id>", methods=["DELETE"])
def delete_order_item(item_id):
    try:
        item = OrderItem.query.get_or_404(item_id)
        db.session.delete(item)
        db.session.commit()
        return jsonify({"message": "Order item deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
