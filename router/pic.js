// 图片相关的路由
const router = require("express").Router();
const file = require("../model/file.js");
const fd = require("formidable")
const sd = require("silly-datetime");

// 处理/pic/show请求,展示某个文件夹的图片
router.get("/show",function(req,res){
    // 获取参数: 被点击的文件夹名称
    var dirName = req.query.dirName;
    file.getContents("./uploads/"+dirName,function(err,pics){
        if(err){
            res.render("show",{imgs:null});
            console.log(err);
            return;
        }
        // 传递的数据: 图片数组,被点击的文件夹名称
        res.render("show",{imgs:pics, dirName:dirName});
    })
    
})

// 处理get/pic/upload请求跳转到上传图片页面
router.get("/upload",function(req,res){
    // 上传页面需要获取所有的相册名称
    // 获取所有的相册名,传递给upload视图渲染
    file.getContents("./uploads",function(err,files){
        if(err){

            console.log(err);
            res.render("upload",{status:1,data:"服务器繁忙,稍后再试"})
            return;
        }

        res.render("upload",{status:0,data:files});
        
    })
    
})

// 处理post/pic/upload请求,上传文件
router.post("/upload",function(req,res){
    // 获取表单对象
    var form = new fd.IncomingForm();
    // 设置上传文件的临时保存路径
    form.uploadDir = "./temp";
    form.parse(req,function(err,fields,files){
        if(err){
            console.log(err);
            res.send("<h1 style='text-align:center;color:red;'>上传失败</h1>");
            return;
        }
        // 获取上传的目标文件夹
        var dirName = fields.dirName;
        // 获取上传的图片对象
        var pic = files.pic;
        var oldPath = pic.path;//旧路径
        var name = pic.name;
        // if(name==""){
        //     res.send("<h1>上传失败</h1>")
        //     return;
        // }
        var arr = name.split(".");
        var ext = "."+ arr[arr.length-1];//后缀名
        // 设置文件的新名称
        var str = new Date().getTime() + ""+ Math.floor(Math.random()*8999+1000);
        var newPath = "./uploads/"+dirName+"/"+str+ext;
        // 调用修改路径的方法
        file.change(oldPath,newPath,function(err){
            if(err){
                console.log(err);
                res.send("<h1>上传失败</h1>")
                return;
            }
        })
        // 上传成功,自动跳转到上传的文件夹页面
        res.redirect("/pic/show?dirName="+dirName);
        
        
    })
    
})

// 删除图片文件
router.post("/deletepic",function(req,res){
    // console.log(req.body.dirName);
    file.remove("./uploads/"+req.body.dirName,function(err){
        if(err){
            console.log(err);
            res.send({status:1,msg:"删除失败"});
            return;
        }
        res.send({status:0,msg:"删除成功"});
    })
})
module.exports = router;