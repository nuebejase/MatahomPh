# routes/order_routes.py
from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError

from models import db
from models.order_model import Order
from models.order_item_model import OrderItem

order_bp = Blueprint("order", __name__)

VALID_STATUSES = {"pending", "shipped", "delivered", "cancelled"}


# ✅ CREATE ORDER (optionally accepts items[])
@order_bp.route("/orders", methods=["POST"])
def create_order():
    data = request.get_json(silent=True)

    if not data or not isinstance(data, dict):
        return jsonify({"error": "Invalid or missing JSON body"}), 400

    # prevent client from forcing PK
    data.pop("order_id", None)
    data.pop("id", None)

    # optional items list
    items_data = data.pop("items", None)

    # basic validation
    if "user_id" not in data:
        return jsonify({"error": "Missing 'user_id'"}), 400
    if "total_amount" not in data:
        return jsonify({"error": "Missing 'total_amount'"}), 400
    if "status" in data and data["status"] not in VALID_STATUSES:
        return jsonify({"error": f"Invalid status. Use: {sorted(VALID_STATUSES)}"}), 400

    try:
        order = Order(**data)

        # if items provided, convert dict -> OrderItem
        if items_data:
            if not isinstance(items_data, list):
                return jsonify({"error": "'items' must be a list"}), 400

            for it in items_data:
                if not isinstance(it, dict):
                    return jsonify({"error": "Each item must be an object"}), 400

                # subtotal is NOT NULL in your DB, compute if missing
                qty = int(it.get("quantity", 1))
                price = float(it.get("price", 0))
                if "subtotal" not in it:
                    it["subtotal"] = round(qty * price, 2)

                order.items.append(OrderItem(**it))

        db.session.add(order)
        db.session.commit()
        return jsonify(order.to_dict()), 201

    except TypeError as e:
        db.session.rollback()
        return jsonify({"error": f"Invalid fields: {str(e)}"}), 400

    except IntegrityError as e:
        db.session.rollback()
        return jsonify({"error": f"DB error: {str(e.orig)}"}), 400

    except Exception as e:
        db.session.rollback()
        print("CREATE ORDER ERROR:", repr(e))
        return jsonify({"error": str(e)}), 500


# ✅ GET ALL ORDERS
@order_bp.route("/orders", methods=["GET"])
def get_orders():
    orders = Order.query.all()
    return jsonify([o.to_dict() for o in orders]), 200


# ✅ GET ONE ORDER
@order_bp.route("/orders/<int:order_id>", methods=["GET"])
def get_order(order_id):
    order = Order.query.get_or_404(order_id)
    return jsonify(order.to_dict()), 200


# ✅ UPDATE ORDER (status)
@order_bp.route("/orders/<int:order_id>", methods=["PUT", "PATCH"])
def update_order(order_id):
    data = request.get_json(silent=True) or {}

    status = data.get("status")
    if not status:
        return jsonify({"error": "Missing 'status' field"}), 400
    if status not in VALID_STATUSES:
        return jsonify({"error": f"Invalid status. Use: {sorted(VALID_STATUSES)}"}), 400

    order = Order.query.get_or_404(order_id)

    try:
        order.status = status
        db.session.commit()
        return jsonify(order.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
