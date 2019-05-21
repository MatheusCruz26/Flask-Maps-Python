from flask import Flask, jsonify, request, render_template, Blueprint
import requests

routes_url = "https://maps.googleapis.com/maps/api/directions/json"
key = "AIzaSyDJreVAZQXjFm9ODSZ6WW-obNS4keQ0RZs"

maps_app = Blueprint('maps_app', __name__, template_folder='templates')


@maps_app.route("/api",methods=['POST'])
def api():
    
    status = {}
    dados = {}
    json = request.get_json()

    if(json == None):
        status = {"status":"Erro Request", "retorno":""}
        return jsonify(status),404

    destino = str(json["latitude_destino"])+","+str(json["longitude_destino"])
    origem = str(json["latitude_origem"])+","+str(json["longitude_origem"])
    directions = {"origin":origem, "destination":destino,"key":key}

    search_req = requests.get(routes_url, params=directions)
    search_json = search_req.json()

    if(search_json["status"] != "OK"):
        status = {"status":"Erro", "retorno":""}
        return jsonify(status),404
    else:
        dados = {"origin":origem, "destination":destino}
        addDados = requests.post("http://127.0.0.1:5000/addCache",json=dados)
        if(addDados.status_code == 200):
            status = {"status":"Sucesso", "retorno":search_json}
        else:
            status = {"status":"Erro", "retorno":""}
            return jsonify(status),404

    return jsonify(status)
