# app/admin.py
from flask import Blueprint, jsonify
from sqlalchemy import create_engine, MetaData, Table, select

admin_blueprint = Blueprint('admin', __name__)

# Configuración de la base de datos
engine = create_engine("postgresql://usuario:contraseña@localhost/nombre_bd")
metadata = MetaData()
users = Table("users", metadata, autoload_with=engine)
publications = Table("publications", metadata, autoload_with=engine)
questionnaires = Table("questionnaires", metadata, autoload_with=engine)

@admin_blueprint.route('/profile', methods=['GET'])
def get_admin_profile():
    # Aquí puedes incluir la lógica para obtener el perfil del usuario
    user_id = request.args.get("userID")
    with engine.connect() as conn:
        query = select([users]).where(users.c.id == user_id)
        result = conn.execute(query).fetchone()
        if result:
            user_data = {
                "username": result["username"],
                "email": result["email"],
                "firstname": result["firstname"],
                "lastname": result["lastname"]
            }
            return jsonify(user_data)
        else:
            return jsonify({"error": "User not found"}), 404

@admin_blueprint.route('/publications', methods=['GET'])
def get_publications():
    with engine.connect() as conn:
        result = conn.execute(select([publications]))
        publications_list = [
            {
                "title": row["title"],
                "categoryID": row["categoryID"],
                "authorUserID": row["authorUserID"],
                "created_at": row["created_at"].strftime("%Y-%m-%d"),
                "updated_at": row["updated_at"].strftime("%Y-%m-%d")
            }
            for row in result
        ]
    return jsonify(publications_list)

@admin_blueprint.route('/questionnaires', methods=['GET'])
def get_questionnaires():
    with engine.connect() as conn:
        result = conn.execute(select([questionnaires]))
        questionnaires_list = [
            {
                "title": row["title"],
                "creatorUserID": row["creatorUserID"],
                "created_at": row["created_at"].strftime("%Y-%m-%d"),
                "updated_at": row["updated_at"].strftime("%Y-%m-%d")
            }
            for row in result
        ]
    return jsonify(questionnaires_list)
