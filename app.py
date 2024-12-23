from flask import Flask, request, send_file, render_template
import requests
from io import BytesIO

app = Flask(__name__)

@app.route('/proxy-image')
def proxy_image():
    image_url = request.args.get('url')
    response = requests.get(image_url)
    return send_file(
        BytesIO(response.content),
        mimetype='image/jpeg'
    )

@app.route('/')
def index():
    return render_template('index.html')
    z

if __name__ == '__main__':
    app.run(debug=True)
