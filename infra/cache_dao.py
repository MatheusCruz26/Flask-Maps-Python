import sqlite3
from flask import Flask, jsonify
def listar():
    localidades = []
    con = sqlite3.connect('banco_dados')
    cur = con.cursor()    
    cur.execute("select * from localidades")
    rows = cur.fetchall()
    con.close()
    for row in rows:
        localidades.append(row)
    return jsonify(localidades)


def inserir(dados):
    con = sqlite3.connect('banco_dados')
    cur = con.cursor()    
    cur.execute("insert into localidades (origin, destination)\
        values(:origin, :destination)", dados)
    con.commit()
    con.close()
    if(cur.lastrowid != None):
        return cur.lastrowid
    else:
        return None

