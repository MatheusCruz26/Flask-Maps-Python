from flask import Flask, jsonify, request, render_template, Blueprint
from infra.cache_dao import inserir as inserir_dao, listar as listar_dao
import requests

cache_app = Blueprint('cache_app', __name__, template_folder='templates')

@cache_app.route("/addCache",methods=['POST'])
def add():
    json = request.get_json()
    if(json == None):
        return '', 404
    add = inserir_dao(json)
    if(add != None):
        return '', 200
    else:
        return '', 404

@cache_app.route("/listarCache",methods=['POST'])
def listar():
    return listar_dao()


