# main.py
from flask import Flask
from app.admin import admin_blueprint
from app.reader import reader_blueprint
from app.writer import writer_blueprint

app = Flask(__name__)

# Registro de las rutas para cada rol
app.register_blueprint(admin_blueprint, url_prefix='/api/admin')
app.register_blueprint(reader_blueprint, url_prefix='/api/reader')
app.register_blueprint(writer_blueprint, url_prefix='/api/writer')

if __name__ == '__main__':
    app.run(port=5000, debug=True)
