from flask import Flask, jsonify, request, render_template
from maps import maps_app
from cache import cache_app
import requests
import sqlite3

app = Flask(__name__)

con = sqlite3.connect('banco_dados')
cur = con.cursor()
criar = input('deseja criar tabela? (s/n)')
if criar == 's':
    cur.execute("create table localidades ( \
        id integer primary key autoincrement,\
        origin varchar(255),\
        destination varchar(255) )")
con.commit()
con.close()


app.register_blueprint(maps_app)
app.register_blueprint(cache_app)

@app.route("/")
def index():
    return render_template('index.html') 

if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)
