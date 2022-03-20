## 限制异步请求并发个数  

在一次某大厂第四轮技术面中，有下面一段对话  
Q: &emsp; 浏览器最多发送多少条请求？  
A: &emsp; Chrome下同域名下最多同时发送6条请求，想要优化页面加载速度，可以使用多域名方式，突破这个问题。  
Q: &emsp; 既然这样，那你实现一下限制异步请求并发数，给你十分钟。  
A: &emsp; emmm，好，我试试。

当时状态贼差，大脑一片空白，写了请求队列之后，不知道怎么写了，只能老老实实的说“十分钟大概写不出来”，然后，就没有然后了，o(╥﹏╥)o

---
#### 实现代码  
代码逻辑思路，通过Promise和async构建一个延迟执行的方法，等待前面正在执行的异步方法完成后，再执行后面的方法。

```
class RequestLimit {
  constructor(limit){
    // 控制并发数；
    this.limit = Number(limit) || 6;
    // 任务阻塞队列；
    this.blockQueue = [];
    // 当前执行任务计数器；
    this.currentReqNumber = 0;
  }
  
  async request(req){
    if(!req){
      throw new Error('大哥？啥也不传几个意思啊？给个可执行函数呗')
    }
    if(Object.prototype.toString.call(req) !== '[object Function]'){
      throw new Error('大哥，给传个可执行函数呀');
    }
    if(this.currentReqNumber >= this.limit){
      // 阻塞队列增加一个 Pending 状态的 Promise
      await new Promise(resolve=>this.blockQueue.push(resolve));
    }
    return this._handlerReq(req);
  }
  // 任务执行函数
  async _handlerReq(req){
    // 当前执行中的任务计数器+1
    this.currentReqNumber++;
    try {
      // 等待任务执行；
      return await req();
    }catch(err){
      // 如果有异常，则返回异常信息；
      return Promise.reject(err);
    } finally{
      // 执行完毕之后，将计数器-1；
      this.currentReqNumber--;
      // 查看任务队列中是否有等待的任务；
      if(this.blockQueue.length){
        // 将队列中的第一个任务由pending状态改为fulfilled；
        let resolve = this.blockQueue.shift();
        resolve();
      }
    }
  }
}
```
#### 测试代码  
设置一个限制并发2条的requestLimit，异步方法中延迟1s打印时间和索引
```
const requestLimit = new RequestLimit(2);
for(let i = 0; i < 10; i++){
    requestLimit.request(()=>{
        return new Promise((resolve)=>{
            setTimeout(function(){
                console.log(new Date().toLocaleString(), i);
                resolve();
            }, 1000);
        })
    })
}

```
#### 测试结果  
可以看到代码执行结果，每两条打印的时间是一样的。
```
10/29/2020, 10:49:46 PM 0
10/29/2020, 10:49:46 PM 1
10/29/2020, 10:49:47 PM 2
10/29/2020, 10:49:47 PM 3
10/29/2020, 10:49:48 PM 4
10/29/2020, 10:49:48 PM 5
10/29/2020, 10:49:49 PM 6
10/29/2020, 10:49:49 PM 7
10/29/2020, 10:49:50 PM 8
10/29/2020, 10:49:50 PM 9
```

---

GitHub上有专门的库
1. https://github.com/sindresorhus/p-limit
2. https://github.com/theKashey/plimited