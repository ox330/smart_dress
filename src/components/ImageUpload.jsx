import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // 获取可用的分类
    axios.get('http://localhost:5000/get_categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('获取分类失败:', error);
      });
  }, []);

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedCategory) {
      alert('请选择文件和分类');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('category', selectedCategory);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('上传成功！');
      setSelectedFile(null);
      setSelectedCategory('');
    } catch (error) {
      console.error('上传失败:', error);
      alert('上传失败，请重试');
    }
  };

  return (
    <div className="upload-container">
      <h2>上传图片</h2>
      <div>
        <input
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={handleFileSelect}
        />
      </div>
      <div>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">选择分类</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleUpload}>上传</button>
    </div>
  );
};

export default ImageUpload; 