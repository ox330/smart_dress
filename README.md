# 智能穿搭助手

## 项目简介

智能穿搭助手是一个基于 Flask 和 React 的应用程序，允许用户上传服装图片并获取搭配建议。用户可以选择服装类别，上传图片，并查看与其他服装的搭配建议。

## 技术栈

- **前端**: React
- **后端**: Flask
- **数据库**: 本地文件系统（用于存储上传的图片）
- **依赖管理**: `requirements.txt` 和 `package.json`

## 功能

- 用户可以上传服装图片。
- 用户可以选择服装类别（如上衣、裤子、鞋子、配饰）。
- 系统会根据上传的图片提供搭配建议。
- 显示已上传的图片和搭配建议的预览。

## 安装与运行

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd <your-project-directory>
```

### 2. 设置 Python 虚拟环境

```bash
# 创建虚拟环境
python -m venv .venv

# 激活虚拟环境
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate
```

### 3. 安装后端依赖

```bash
pip install -r requirements.txt
```

### 4. 启动后端服务器

```bash
python python/test.py
```

### 5. 启动前端开发服务器

在另一个终端窗口中，导航到前端目录并运行：

```bash
# 安装前端依赖
npm install

# 启动前端开发服务器
npm start
```

## 使用说明

1. 打开浏览器并访问 `http://localhost:5000`。
2. 上传服装图片并选择相应的类别。
3. 点击“上传图片”按钮。
4. 查看上传成功的提示和搭配建议。

## 贡献

欢迎任何形式的贡献！请提交问题或拉取请求。

## 许可证

此项目使用 MIT 许可证。有关详细信息，请参阅 [LICENSE](LICENSE) 文件。
