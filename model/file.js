// 模型层,数据层,操作文件相关的事情
const { dir } = require("console");
const fs = require("fs")

/**
 * 读取文件夹的内容
 * @param {String} dirName 被读取的文件夹名称
 */
function getContents(dirName,callback) {
    fs.readdir(dirName,function(err,files){
        // 异步方法返回数据不能使用return
        // return files;
        callback(err,files);
    })
}

/**
 * 根据指定名称创建文件夹
 * @param {String} dirName  创建文件夹的名称
 */
function create(dirName,callback){
    fs.mkdir(dirName,function(err){
        callback(err)
    })
}

/**
 * 删除指定名称的文件或文件夹
 * @param {String} path  被删除的路径
 */
function remove(path,callback){
    fs.stat(path,function(err,stats){
        if(err){
            callback(err);
            return;
        }
        if(stats.isFile()){//文件的删除
            fs.unlink(path,function(err){
                callback(err);
            })
            return;
        }
        // 不是文件,删除文件夹
        fs.rmdir(path,{recursive:true},function(err){
            callback(err);
        })
    })
}

/**
 *
 * 根据指定的路径(重命名)
 * @param {String} oldPath 旧路径
 * @param {String} newPath 新路径
 */
function change(oldPath,newPath,callback){
    fs.rename(oldPath,newPath,function(err){
        callback(err);
    })
}

// 暴露
module.exports = {
    getContents:getContents,
    create:create,
    remove:remove,
    change:change
}