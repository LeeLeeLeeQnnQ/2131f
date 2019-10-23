import axios from '@/libs/api.request'


/*
  获取权限租列表
*/
/*
  no-data
*/
/*
  create_member - list
  edit_Member - list
  permission_list - list
*/
export const getEmployeeGroup = ( data ) => {
  return axios.request({
    url: '/api/EmployeeGroup/index',
    params: data,
    method: 'get'
  })
}



/*
  获取城市列表
*/
/*
  no-data
*/
/*
  
*/
export const getAllCityList = ( data ) => {
  return axios.request({
    url: '/api/City/index',
    params: data,
    method: 'get'
  })
}


/*
  获取城市列表
*/
/*
  no-data
*/
/*
  
*/
export const getBrandList = ( data ) => {
  return axios.request({
    url: '/api/Index/getBrandList',
    params: data,
    method: 'get'
  })
}

/*
  获取城市列表
*/
/*
  no-data
*/
/*
  
*/
export const getCityList = ( data ) => {
  return axios.request({
    url: '/api/Index/getCityList',
    params: data,
    method: 'get'
  })
}




export const deleteAreaItem = ( data ) => {
  return axios.request({
    url: '/api/Area/delete',
    data,
    method: 'post'
  })
}

// addNewCity

/*
  获取权限租列表
*/
/*
  no-data
*/
/*
  
*/
export const addNewCity = ( data ) => {
  return axios.request({
    url: '/api/City/add',
    data,
    method: 'post'
  })
}


// addNewCity

/*
  获取权限租列表
*/
/*
  no-data
*/
/*
  
*/
export const editCity = ( data ) => {
  return axios.request({
    url: '/api/City/edit',
    data,
    method: 'post'
  })
}




/*
  获取城市列表
*/
/*
  no-data
*/
/*
  
*/
export const getAllBrandList = ( data ) => {
  return axios.request({
    url: '/api/Brand/index',
    params: data,
    method: 'get'
  })
}


/*
  获取城市列表
*/
/*
  no-data
*/
/*
  
*/
export const getAllCityQueryList = ( data ) => {
  return axios.request({
    url: '/api/City/getCityList',
    params: data,
    method: 'get'
  })
}
export const getAllBrandQueryList = ( data ) => {
  return axios.request({
    url: '/api/Brand/getBrandList',
    params: data,
    method: 'get'
  })
}


// 获取地区列表
export const getAllAreaList = ( data ) => {
  return axios.request({
    url: '/api/Area/index',
    params: data,
    method: 'get'
  })
}


export const addNewArea = ( data ) => {
  return axios.request({
    url: '/api/Area/add',
    data,
    method: 'post'
  })
}


export const editArea = ( data ) => {
  return axios.request({
    url: '/api/Area/edit',
    data,
    method: 'post'
  })
}

// addNewCity

/*
  获取权限租列表
*/
/*
  no-data
*/
/*
  
*/
export const addNewBrand = ( data ) => {
  return axios.request({
    url: '/api/Brand/add',
    data,
    method: 'post'
  })
}


// addNewCity

/*
  获取权限租列表
*/
/*
  no-data
*/
/*
  
*/
export const editBrand = ( data ) => {
  return axios.request({
    url: '/api/Brand/edit',
    data,
    method: 'post'
  })
}





/*
  增加一个人员
*/
/*
  fullname: (...)
  gender: (...)
  group_id: (...)
  kitchen_id: (...)
  password: "123456"
  password1: (...)
  password2: (...)
  remark: (...)
  textarea: undefined
  username: (...)
*/
/*
  create_member - 增加一个人员
*/
export const addMember = (obj) => {
  const data = obj
  return axios.request({
    url: '/api/Employee/add',
    data,
    method: 'post'
  })
}

/*
  获取权限列表
*/
/*

*/
/*
  create_permisson - 获取权限列表
  edit_permisson - 获取权限列表
*/
export const getEmployeeModules = () => {
  return axios.request({
    url: '/api/EmployeeGroup/getModules',
    method: 'get'
  })
}

// 
/*
  增加权限组
*/
/*
  describe: (...)
  group_name: (...)
  rules: (5) ["800", "801", "802", "803", "804"]
*/
/*
  create_permisson - 增加权限组
*/
export const addEmployeeGroup = (data) => {
  return axios.request({
    url: '/api/EmployeeGroup/add',
    data,
    method: 'post'
  })
}

/*
  获取一条人员详情
*/
/*
  id
*/
/*
  create_permisson - 获取一条人员详情
*/
export const getMemberDetail = (id) => {
  const data = { id: id }
  return axios.request({
    url: '/api/Employee/show',
    data,
    method: 'post'
  })
}

/*
  编辑一个人员
*/
/*
  ID
  fullname: (...)
  gender: (...)
  group_id: (...)
  kitchen_id: (...)
  password: "123456"
  password1: (...)
  password2: (...)
  remark: (...)
  textarea: undefined
  username: (...)
*/
/*
  edit_member - 编辑一个人员
*/
export const editMember = (data) => {
  return axios.request({
    url: '/api/Employee/edit',
    data,
    method: 'post'
  })
}

/*
  获取权限租详情
*/
/*
  ID
*/
/*
  edit_permisson - 获取权限租详情
*/
export const getEmployeeGroupDetail = (id) => {
  const data = { id: id }
  return axios.request({
    url: '/api/EmployeeGroup/show',
    data,
    method: 'post'
  })
}

/*
  编辑权限租
*/
/*
  describe: (...)
  group_name: (...)
  id: 11
  rules: (45) ["800", "801", "
*/
/*
  edit_permisson - 编辑权限租详情
*/
export const editEmployeeGroup = (data) => {
  return axios.request({
    url: '/api/EmployeeGroup/edit',
    data,
    method: 'post'
  })
}

/*
  获取人员列表
*/
/*
  
*/
/*
  member_list - 获取人员列表
*/
export const getMemberList = (data) => {
  return axios.request({
    url: '/api/Employee/index',
    params: data,
    method: 'get'
  })
}



/*
  删除人员
*/
/*
  id
*/
/*
  member_list - 删除人员
*/
export const deleMember = (id) => {
  const data = { id: id }
  return axios.request({
    url: '/api/Employee/delete',
    data,
    method: 'post'
  })
}
/*
  删除权限
*/
/*
  id
*/
/*
  permission_list - 删除权限
*/
export const deleEmployeeGroup = (id) => {
  const data = { id: id }
  return axios.request({
    url: '/api/EmployeeGroup/delete',
    data,
    method: 'post'
  })
}

