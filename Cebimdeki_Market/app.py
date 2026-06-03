import json
from flask import Flask, render_template, request

app = Flask(__name__)

# JSON verisini tek bir yerden yükle
def urunleri_yukle():
    with open('urunler.json', 'r', encoding='utf-8') as f:
        return json.load(f)

@app.route('/')
def index():
    query = request.args.get('q', '').lower().strip()
    tum_urunler = urunleri_yukle() # JSON'dan tüm veriyi çek[cite: 7]
    
    if query:
        # Arama terimi varsa filtrele
        urunler = [u for u in tum_urunler if query in u['isim'].lower()]
        # Eşleşme yoksa urunler=[] (boş liste) gider.
        return render_template('index.html', urunler=urunler, query=query)
    else:
        # Arama yoksa her şeyi göster
        return render_template('index.html', urunler=tum_urunler, query="")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)