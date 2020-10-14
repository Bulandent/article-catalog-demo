本项目是文章页目录插件的静态 `HTML` 体验版本，直接把仓库克隆到本地，打开 `index.html` 即可体验目录插件效果。

当然也可以在线上体验：[线上体验目录插件](https://bubuzou.com/2020/09/21/vue-operate/)

可以去看下这个插件是如何实现的：[详细设计一个文章页目录插件](https://juejin.im/post/6883292908649185288/)

# 文章页目录插件

`article-catalog` 是一个文章页目录插件，根据文章内容中的 `H2` 和 `H3` 标签生成一级和二级子目录，暂时不支持第三级目录。

## 使用前提

使用这个插件的前提是，满足以下这种格式的 `HTML` 才可以使用：

``` html
<h2 id="7种组件通信方式随你选">
    <a href="" class="headerlink" title="7种组件通信方式随你选"></a>
    7种组件通信方式随你选
</h2>
<!-- 这里是部分文章内容 -->
<h3 id="props-on-emit">
    <a href="" class="headerlink" title="props/@on+$emit"></a>
    props/@on+$emit
</h3>
<!-- 这里是部分文章内容 -->
<h3 id="$attrs和$listeners">
    <a href="" class="headerlink" title="$attrs和$listeners"></a>
    $attrs和$listeners
</h3>
<!-- 这里是部分文章内容 -->
```

## 使用方式

在页面中引入 `articleCatalog.js`，然后调用：

``` js
articleCatalog({
    lineHeight: 28,           // 每个菜单的行高是 28
    moreHeight: 10,           // 菜单左侧的线比菜单多出的高度
    surplusHeight: 180,       // 除了菜单高度+留白高度
    delay: 200,               // 防抖的延迟时间
    duration: 200,            // 滚动的动画持续时间
    toTopDistance: 80,        // 距离视口顶部多少高度之内时候触发高亮
    selector: '.headerlink',  // 文章内容中标题标签的 selector
})
```

注意传入参数也是瞎传的，需要配合该插件的样式，否则容易程问题。比如明明页面中子目录的真实行高是 `28px`，你却传入 `lineHeight: 24`，那肯定是不行的。
