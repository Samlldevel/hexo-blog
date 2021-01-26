---
title: "部署网易云音乐API - Nginx反向代理nodejs"
date: 2021-01-26 23:12:20
desc:
tags:
  - 网易云音乐
  - 反向代理
categories:
  - 部署
---

> 不管是看博客还是写博客，听音乐必然是不可少的一个节奏
> 但是吧，之前的网易云 API 是用的别人的
> 这几天突然就用不了，所以就打算自己部署一个

听首歌测试一下，快过年啦~ 三十的鞭炮太响啦，提前祝朋友们新年快乐~
送上我非常喜欢的两首歌, 两首歌都非常嗨 ❤
{% cplayer %}
[524148679,395602]
{% endcplayer %}

## 开始

#### 准备

首先得有个服务器，然后搭上 `Nginx`，为了方便点，我绑定了域名 [http://cloud-music.pengliang.online/](http://cloud-music.pengliang.online/)

将 `网易云API` 的 node 应用部署在 `Nginx` 中

API : [https://neteasecloudmusicapi.vercel.app/#/](https://neteasecloudmusicapi.vercel.app/#/)
Github : [https://github.com/Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)

---

#### 环境配置

安装依赖及 `pm2`

> 记得在服务器上先安装高版本 `node` 哦

```
npm install
```

```
npm install pm2 -g
```

---

#### 配置反向代理

`网易云 API` 的 nodejs 默认端口是 3000，`app.js` 可见
所以这里转发 `http://127.0.0.1:3000;`

```
server{
    listen 80;
    server_name cloud-music.pengliang.online;
    location / {
        proxy_pass http://127.0.0.1:3000;
    }
}
```

---

#### 启动

使用 `pm2` 启动 nodejs

```
pm2 start
```

这样 `pm2` 就会一直守护你的进程。
更多 pm2 的功能可以前往[pm2 官方](https://pm2.keymetrics.io/docs/usage/quick-start/)

---

#### 完成

这下可以访问了，效果如下。
访问 [http://cloud-music.pengliang.online/](http://cloud-music.pengliang.online/)
![网易云API首页](./cloud-music/网易云API.png)

试试`搜索`
![搜索](./cloud-music/搜索.png)
