const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware для обработки CORS и JSON
app.use(cors());
app.use(express.json());

// Установка статической папки для изображений
app.use("/images", express.static(path.join(__dirname, "public/images")));

// Загрузка данных из файла JSON
const dataFilePath = path.join(__dirname, "data.json");
let posts = JSON.parse(fs.readFileSync(dataFilePath, "utf-8")).chapters;

// Ручка для получения всех постов
app.get("/blog/post", (req, res) => {
  // Обновляем пути до изображений для каждого поста
  const postsWithRealImagePaths = posts.map((post) => ({
    ...post,
    imageUrl: `${req.protocol}://${req.get("host")}${post.imageUrl}`,
  }));
  res.json(postsWithRealImagePaths);
});

// Ручка для получения конкретного поста по id
app.get("/blog/post/:id", (req, res) => {
  const postId = req.params.id;
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  // Обновляем путь до изображения для конкретного поста
  const postWithRealImagePath = {
    ...post,
    imageUrl: `${req.protocol}://${req.get("host")}${post.imageUrl}`,
  };

  res.json(postWithRealImagePath);
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
