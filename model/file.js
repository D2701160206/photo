// 模型层,数据层,操作文件相关的事情
const fs = require("fs")

/**
 *
 * 读取文件夹的内容
 * @param {string} dirName 被读取的文件夹名称
 */
function getContents(dirName,callback) {
    fs.readdir(dirName,function(err,files){
        // 异步方法返回数据不能使用return
        // return files;
        callback(err,files);
    })
}

/**
 *
 * 根据指定名称创建文件夹
 * @param {string} dirName  创建文件夹的名称
 * @param {function} callback
 */
function create(dirName,callback){
    fs.mkdir(dirName,function(err){
        callback(err)
    })
}


// 暴露
module.exports = {
    getContents:getContents,
    create:create
}