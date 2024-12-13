import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [outfitSuggestions, setOutfitSuggestions] = useState([]);
  const [message, setMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageName, setImageName] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/get_categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        setMessage('获取分类失败');
        console.error('获取分类失败:', error);
      });
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setImageName(file ? file.name : '');
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedCategory) {
      setMessage('请选择文件和分类');
      return;
    }

    const formData = new FormData();
    const fileExtension = selectedFile.name.split('.').pop();
    const finalFileName = `${imageName}.${fileExtension}`;
    
    const renamedFile = new File([selectedFile], finalFileName, {
      type: selectedFile.type,
    });
    
    formData.append('file', renamedFile);
    formData.append('category', selectedCategory);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setUploadedImages(prev => [...prev, {
        name: finalFileName,
        category: selectedCategory,
        path: `${response.data.image_path}`,
        preview: previewUrl
      }]);

      setSelectedFile(null);
      setPreviewUrl(null);
      setSelectedCategory('');
      setImageName('');
      setMessage('上传成功！');

      setTimeout(() => {
        setMessage('');
      }, 2000);

      getOutfitSuggestions(finalFileName, selectedCategory);
    } catch (error) {
      setMessage('上传失败，请重试');
      console.error('上传失败:', error);
    }
  };

  const getOutfitSuggestions = async (filename, category) => {
    try {
      const response = await axios.post('http://localhost:5000/get_outfits', {
        selected_image: filename,
        category: category
      });
      
      const suggestionsWithPreview = response.data.suggestions.map(suggestion => ({
        ...suggestion,
        previewUrl: `http://localhost:5000/uploads/${suggestion.image_path}`
      }));
      
      setOutfitSuggestions(suggestionsWithPreview);
    } catch (error) {
      setMessage('获取搭配建议失败');
      console.error('获取搭配失败:', error);
    }
  };

  return (
    <div className="App">
      <h1>智能穿搭助手</h1>
      
      <div className="upload-container">
        <h2>上传服装图片</h2>
        
        <div className="upload-section">
          <div className="file-input-container">
            <input
              type="file"
              id="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileSelect}
              className="file-input"
            />
            <label htmlFor="file">
              {selectedFile ? selectedFile.name : '选择图片文件'}
            </label>
            {selectedFile && (
              <div className="filename-input">
                <input
                  type="text"
                  value={imageName}
                  onChange={(e) => setImageName(e.target.value)}
                  placeholder="输入图片名称"
                  className="image-name-input"
                />
              </div>
            )}
            {previewUrl && (
              <div className="image-preview">
                <img src={previewUrl} alt="预览" />
              </div>
            )}
          </div>
          
          <div className="category-select">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">选择分类</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <button onClick={handleUpload} className="upload-button">
            上传图片
          </button>
          
          {message && <p className="message">{message}</p>}
        </div>
      </div>

      {uploadedImages.length > 0 && (
        <div className="uploaded-images-container">
          <h2>已上传图片</h2>
          <div className="uploaded-images-grid">
            {uploadedImages.map((image, index) => (
              <div key={index} className="uploaded-image-item">
                <img src={image.preview} alt={image.name} />
                <div className="image-info">
                  <p className="image-name">{image.name}</p>
                  <p className="image-category">{image.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {outfitSuggestions.length > 0 && (
        <div className="suggestions-section">
          <h2>搭配建议</h2>
          <div className="suggestions-grid">
            {outfitSuggestions.map((suggestion, index) => (
              <div key={index} className="suggestion-item">
                <img
                  src={suggestion.previewUrl}
                  alt={`${suggestion.category} 搭配建议`}
                />
                <div className="suggestion-info">
                  <p className="suggestion-category">{suggestion.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

