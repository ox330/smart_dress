from flask import Flask, request, jsonify, send_from_directory
import os
from werkzeug.utils import secure_filename
from PIL import Image
from flask_cors import CORS

app = Flask(__name__)

# 配置上传文件存储路径
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
CORS(app)  

# 检查文件类型是否合法
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# 图片分类存储的目录
CATEGORIES = {
    'tops': 'tops',
    'bottoms': 'bottoms', 
    'shoes': 'shoes',
    'accessories': 'accessories'
}

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': '服务器运行正常',
        'endpoints': {
            'upload': '/upload',
            'get_outfits': '/get_outfits',
            'get_categories': '/get_categories'
        }
    })

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': '没有文件'}), 400
    
    file = request.files['file']
    category = request.form.get('category', 'uncategorized')
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        
        # 确保分类目录存在
        category_path = os.path.join(app.config['UPLOAD_FOLDER'], CATEGORIES.get(category, 'others'))
        os.makedirs(category_path, exist_ok=True)
        
        # 保存文件
        file_path = os.path.join(category_path, filename)
        file.save(file_path)
        
        # 返回相对路径
        relative_path = os.path.join(CATEGORIES.get(category, 'others'), filename)
        
        return jsonify({
            'message': '上传成功',
            'filename': filename,
            'category': category,
            'image_path': os.path.join(UPLOAD_FOLDER, relative_path)
        })
    
    return jsonify({'error': '不支持的文件类型'}), 400

@app.route('/get_outfits', methods=['POST'])
def get_outfit_suggestions():
    selected_image = request.json.get('selected_image')
    selected_category = request.json.get('category')
    
    # 获取其他分类的图片进行搭配
    outfit_suggestions = []
    for category in CATEGORIES:
        if category != selected_category:
            category_path = os.path.join(app.config['UPLOAD_FOLDER'], CATEGORIES[category])
            if os.path.exists(category_path):
                for img in os.listdir(category_path):
                    if allowed_file(img):
                        # 使用相对路径
                        image_path = os.path.join(CATEGORIES[category], img)
                        outfit_suggestions.append({
                            'category': category,
                            'image_path': image_path
                        })
    
    return jsonify({
        'selected_image': selected_image,
        'suggestions': outfit_suggestions
    })

@app.route('/get_categories', methods=['GET'])
def get_categories():
    return jsonify(list(CATEGORIES.keys()))

@app.route('/uploads/<path:filename>')
def serve_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(debug=True)
