from flask import Blueprint, request, jsonify
from models import db
from models.product_model import Product

product_bp = Blueprint("product", __name__)

# CREATE PRODUCT
@product_bp.route("/products", methods=["POST", "OPTIONS"])
def create_product():
    if request.method == "OPTIONS":
        return "", 204

    data = request.get_json() or {}

    if not data.get("name") or data.get("price") is None:
        return jsonify({"error": "name and price are required"}), 400

    product = Product(
        category_id=data.get("category_id"),
        name=data.get("name"),
        description=data.get("description"),
        price=data.get("price"),
        stock=data.get("stock", 0),
        image_url=data.get("image_url"),
    )

    db.session.add(product)
    db.session.commit()
    return jsonify(product.to_dict()), 201


# GET ALL PRODUCTS
@product_bp.route("/products", methods=["GET", "OPTIONS"])
def get_products():
    if request.method == "OPTIONS":
        return "", 204

    products = Product.query.all()
    return jsonify([p.to_dict() for p in products]), 200


# GET ONE PRODUCT
@product_bp.route("/products/<int:product_id>", methods=["GET", "OPTIONS"])
def get_product(product_id):
    if request.method == "OPTIONS":
        return "", 204

    product = Product.query.get_or_404(product_id)
    return jsonify(product.to_dict()), 200


# UPDATE PRODUCT
@product_bp.route("/products/<int:product_id>", methods=["PUT", "OPTIONS"])
def update_product(product_id):
    if request.method == "OPTIONS":
        return "", 204

    data = request.get_json() or {}
    product = Product.query.get_or_404(product_id)

    for key, value in data.items():
        if hasattr(product, key):
            setattr(product, key, value)

    db.session.commit()
    return jsonify(product.to_dict()), 200


# DELETE PRODUCT
@product_bp.route("/products/<int:product_id>", methods=["DELETE", "OPTIONS"])
def delete_product(product_id):
    if request.method == "OPTIONS":
        return "", 204

    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Product deleted"}), 200
