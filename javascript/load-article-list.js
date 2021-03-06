load_list("NULL", "NULL");

function load_list(tags, time) {
    // 载入数据
    var data_article = Bmob.Object.extend("article");

    // 加载表 article 中数据
    var query_article = new Bmob.Query(data_article);

    // 先按 置顶程度 降序排列
    query_article.descending("z-index");
    // 再按 添加时间 降序排列
    query_article.descending("createdAt");

    // 按 tags 筛选
    if (tags != "NULL")
        query_article.equalTo("tags", tags);

    // 按 time 筛选
    if (time != "NULL")
        query_article.equalTo("time", time);

    // 查询所有数据
    var str = "";
    query_article.find({
        success: function(results) {
            // 循环处理查询到的数据
            for (var i = 0; i < results.length; i++) {
                var object = results[i];

                str += "<div class=\"article-list\">" +
                    "<a href=\"?id=" + object.id + "\">" + object.get("title") + "</a>" +
                    "<p>" + object.createdAt.substr(0, 10) + "</p>" +
                    "<p>" + translate(object.get("content")) + "</p>" +
                    "</div>";
            }

            // 加载数据到 文章列表
            $("#article").html(str);
        },
        error: function(error) {
            alert("查询失败: " + error.code + " " + error.message);
        }
    });
}

// markdown 转换为 txt
function translate(str) {
    str = marked(str);
    str = str.replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi,'')
        .replace(/<[^>]+?>/g,'').replace(/\s+/g,' ').replace(/ /g,' ').replace(/>/g,' ');
    if (str.length <= 170)
        return str;
    else
        return str.substr(0, 170) + "...";
}