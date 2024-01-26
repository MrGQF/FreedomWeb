import http from "../utils/http";
let { get, post } = http

// 查询审阅文件
export const apiGetReviewFiles = data => get("/v1/review/getfiles?limit=20")

//  修改文件信息
export const apiUpdateFileInfo = data => post("/v1/file/update", data)

// 查询标签信息
export const apiGetTags = data => get("/v1/tag/getall")

// 更新审核状态
export const apiUpdateReviewFlag = data => post("/v1/review/updateflag", data)

// 删除文件
export const apiDeleteFile = data => post("/v1/file/delete", data)

export default {
    apiGetReviewFiles,
    apiUpdateFileInfo,
    apiGetTags,
    apiUpdateReviewFlag,
    apiDeleteFile
}


