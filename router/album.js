// 相册的路由,处理与相册相关的请求
const router = require("express").Router();
const file = require("../model/file.js")

// 处理/album请求,显示当前服务器上的所有相册
router.get("/",function(req,res){
    // 获取服务器上的所有相册(读取uploads下的所有文件夹)
    /* 
        读取文件夹的路径不能以当前文件为标准,得以项目根目录为标准
    */
    file.getContents("./uploads",function(err,files){
        // console.log(files);
        // res.end();
        // 处理数据,根据结果将数据渲染到视图中
        if(err){
            res.render("index",{albums:null});
            return;
        }
        res.render("index",{albums:files});
    });
});

// 处理get方式/album/create请求,跳转到创建文件夹的页面
router.get("/create",function(req,res){
    res.render("create");
});

// 处理post的/album/check请求,检查名称是否存在
// 如果不存在,则创建文件夹
router.post("/check",function(req,res){
    // 获取请求参数
    var dirName = req.body.dirName.trim();
    if(dirName==""){
        res.send({status:"failed",msg:"相册名不能为空"});
        return ;

    }
    // 获取当前服务器上有哪些相册
    file.getContents("./uploads",function(err,files){
        if(err){//获取内容失败
            console.log(err);
            res.send({status:"failed",msg:"服务器出错"});
            return;
        }
        // 获取内容成功
        // 判断files中是否包含dirName
        if(files.includes(dirName)){//包含
            // 说明文件夹名称已经存在
            res.send({status:"failed",msg:"相册名已存在"});
            return;
        }
        // 文件夹不存在,可以创建
        file.create("./uploads/"+dirName,function(err){
            if(err){
                console.log(err);
                res.send({status:"failed",msg:"创建失败"})
                return ;
            }
            res.send({status:"success",msg:"创建成功"});
        })


    });
})

// 处理get的/album/deletealbum/xxx请求
// 删除指定名称的文件夹(xxx)
router.get("/deletealbum/:dirName",function(req,res){
        // 获取请求参数
        var dirName = req.params.dirName.trim();
        if(dirName==""){
            res.send("删除失败");
            // false.render("error");
            return;            
        }

        // 调用删除文件夹的方法
        file.remove("./uploads/"+dirName,function(err){
            if(err){
                console.log(err);
                res.send("<h1>删除失败</h1>");
                return;
            }
            // 删除成功,重定向到首页
            res.redirect("/");
        })
        
        
});

// 暴露路由
module.exports=router;