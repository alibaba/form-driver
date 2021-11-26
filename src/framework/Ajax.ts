import { message } from 'antd';

function generateQueryStr(obj = {}) {
  let str = ''
  const keys = Object.keys(obj)
  if (keys.length > 0) {
    const arr = []
    keys.forEach(k => {
      arr.push(`${k}=${encodeURIComponent(obj[k])}`)
    })
    str = `?${arr.join('&')}`
  }
  return str
}

export const Ajax = {
  req(method:'GET'|'POST'|'PUT', apiPath:string, urlArgs:any, body:any, headers:any, 
    prompt:any = {succ:"提交完成", networkFail:"网络异常", bizFail:"提交失败"}):Promise<any> {
    const args = {
      method: method,
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json', ...headers}
    }
    return new Promise<any>(function(resolve, reject) {
      fetch(`${apiPath}${generateQueryStr(urlArgs)}`, args)
        .then(d => d.json())
        .then(resp => {
          if(resp.errorCode === 0) {
            if(prompt.succ){
              message.success(prompt.succ);
            }
            resolve(resp);
          } else {
            message.error(resp.message ?? prompt.bizFail);
            reject(resp);
          }
        })
        .catch(e=>{
          console.log(e);
          message.error(prompt.networkFail);
          reject();
        })
    });
  },

  post(apiPath:string, data:any, succMsg:string = "提交完成"):Promise<any> {
    const args = {
      method: 'POST',
      body:JSON.stringify(data),
      headers: {'Content-Type': 'application/json'}
    }
    return new Promise<any>(function(resolve, reject){
      fetch(apiPath, args)
        .then(d => d.json())
        .then(resp => {
          if(resp.errorCode === 0) {
            if(succMsg){
              message.success(succMsg);
            }
            resolve(resp);
          } else {
            message.error(resp.message);
            reject(resp);
          }
        })
        .catch(e=>{
          console.log(e);
          message.error("网络异常");
          reject();
        })
    });
  },

  get(apiPath:string,  data?:object):Promise<any> {
    if (data) {
      apiPath = `${apiPath}${generateQueryStr(data)}`
    }
    return new Promise<void>(function(resolve, reject){
      fetch(apiPath)
      .then(res => res.json())
      .then(resp => {
        if(resp.errorCode === 0) {
          resolve(resp);
        } else {
          message.error(resp.message);
          reject();
        }
      })
      .catch(e=>{
        message.error("网络异常");
        reject();
      })
    });
  }
}

