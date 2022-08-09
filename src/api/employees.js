import request from "@/utils/request";

/**
 *  获取员工的简单列表
 * **/
export function getEmployeeSimple() {
  return request({
    url: "/sys/user/simple",
  });
}

/**
 * 获取员工的综合列表数据
 * ***/
export function getEmployeeList(params) {
  return request({
    url: "/sys/user",
    params,
  });
}

/**
 * 删除员工接口
 * ****/

export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: "delete",
  });
}

/** **
 *  新增员工的接口
 * **/
export function addEmployee(data) {
  return request({
    method: "post",
    url: "/sys/user",
    data,
  });
}

/** *
 *  封装一个导入员工的接口
 *
 * ***/

 export function importEmployee(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}


/** **
 * 获取用户的岗位信息
 *
 * ****/
 export function getJobDetail(id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}
/**
 * 保存岗位信息
 * ****/
export function updateJob(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}

/** *
 * 给用户分配角色
 * ***/
 export function assignRoles(data) {
  return request({
    url: '/sys/user/assignRoles',
    data,
    method: 'put'
  })
}