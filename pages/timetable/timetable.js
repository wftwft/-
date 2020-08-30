// pages/timetable/timetable.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

    parseInt:parseInt,
    courseObj:{},
    week: [{}, {}, {}, {}, {}, {}, {}],
    openid:null,

    // 下拉菜单数据
    menuArray: ['第一周', '第二周', '第三周', '第四周', '第五周', '第六周', '第七周', '第八周', '第九周', '第十周', '第十一周', '第十二周', '第十三周', '第十四周', '第十五周', '第十六周', '第十七周', '第十八周', '第十九周', '第二十周', '第二十一周', '第二十二周', '第二十三周', '第二十四周', '第二十五周'],
    objectMenuArray: [{
        id: 1,
        name: '第一周'
      },
      {
        id: 2,
        name: '第二周'
      },
      {
        id: 3,
        name: '第三周'
      },
      {
        id: 4,
        name: '第四周'
      },
      {
        id: 5,
        name: '第五周'
      },
      {
        id: 6,
        name: '第六周'
      },
      {
        id: 7,
        name: '第七周'
      },
      {
        id: 8,
        name: '第八周'
      },
      {
        id: 9,
        name: '第九周'
      },
      {
        id: 10,
        name: '第十周'
      },
      {
        id: 11,
        name: '第十一周'
      },
      {
        id: 12,
        name: '第十二周'
      },
      {
        id: 13,
        name: '第十三周'
      },
      {
        id: 14,
        name: '第十四周'
      },
      {
        id: 15,
        name: '第十五周'
      },
      {
        id: 16,
        name: '第十六周'
      },
      {
        id: 17,
        name: '第十七周'
      },
      {
        id: 18,
        name: '第十八周'
      },
      {
        id: 19,
        name: '第十九周'
      },
      {
        id: 20,
        name: '第二十周'
      },
      {
        id: 21,
        name: '第二十一周'
      },
      {
        id: 22,
        name: '第二十二周'
      },
      {
        id: 23,
        name: '第二十三周'
      },
      {
        id: 24,
        name: '第二十四周'
      },
      {
        id: 25,
        name: '第二十五周'
      },
    ],
    index: 0,
    weekNum:1,
  },
  // 下拉菜单
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      weekNum: parseInt(e.detail.value) +1
    })

    this.updateTable()
  },
  showCardView: function(e) {
    wx.navigateTo({
      url: '../setSubject/setsetSubject?id=' + e.currentTarget.id
    });
  },
  updateTable(){
    let weekNum = this.data.weekNum;
    let courseObj = this.data.courseObj;
    for (let i = 1; i < 8; i++) {
      //console.log(i)
      for (let j = 1; j < 6; j++) {
        //console.log(j)
        courseObj["" + i + j].show = courseObj["" + i + j].course && (courseObj["" + i + j].course.indexOf(weekNum) != -1) ? true : false;
      }
    }
    console.log(courseObj)
    this.setData({ courseObj });
    this.setTime()
  },

//  表头时间
  setTime(){
    let weekNum = this.data.weekNum;
    let time = new Date();
    time.setMonth(2);
    time.setDate(2);
    time.setHours(0);
    console.log(weekNum)
    console.log((weekNum - 1) * 7 * 24 * 60 * 60 * 1000)
  
    time.setTime(time.getTime()+ (weekNum-1)*7*24*60*60*1000)
    console.log(time)
    let arr = [];
    this.setData({month:time.getMonth()+1})
    for(let i=0;i<7;i++){
      
    let mouth = (time.getMonth() + 1) >= 10 ? (time.getMonth() + 1) : "0" + (time.getMonth() + 1);
      let day = time.getDate() >= 10 ? time.getDate() : "0" + time.getDate();
      time.setTime(time.getTime() + 24 * 60 * 60 * 1000)
      arr.push(mouth+ '/'+ day)
    }
    console.log(arr)
    this.setData({dayArr:arr})
  },
  //当前日期所在的周数传给多列选择器
  onLoad:function(){
    this.setData({
      weekNum:this.getWeekNum()
    })
  },
  //课程列表渲染
  onShow: function () {
    this.setTime()
    //循环生成1个对象
    let courseObj = {};
    for (let i = 1; i < 8; i++) {
      for (let j = 1; j < 6; j++) {
        courseObj["" + i + j] = {};
      }
    }
    console.log(courseObj)
    this.setData({
      courseObj
    })
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      time: time
    });

    //请求云端数据库，将课程渲染到课程表内
    let that = this

   
    wx.cloud.callFunction({
      name:"getOpenid",
      success(res){
        console.log(res)
        openid = res.result.openid
        console.log(openid)
        that.openid = openid;
        wx.cloud.database().collection("text")
          .where({
            "_openid": openid
          }).orderBy("pubtime", 'desc').limit(1)
          .get({
            success: (res) => {
              console.log(res)
              week = res.data[0].week;
              //this.setData(week)
              console.log(week)
              let courseObj = {};
              console.log(courseObj)
              for (let i = 1; i < 8; i++) {
                //console.log(i)
                for (let j = 1; j < 6; j++) {
                  //console.log(j)
                  courseObj["" + i + j] = week[i - 1][j];
                }
              }
              console.log(courseObj)
              that.setData({ courseObj: courseObj })
              that.updateTable()
            }
          });
      }
    })
    

  },
  toDetail: function (e) {
    let that = this;
    var viewid = e.currentTarget.dataset.id;
    var indexKey = e.currentTarget.dataset.index;
    console.log(indexKey)
    var value = this.data.courseObj[indexKey]
    console.log(value)
    var weekNum = this.data.weekNum;
    let obj = { value, weekNum,indexKey}
    if (value.title!=null){
      wx.redirectTo({
        url: '../details/details?obj='+JSON.stringify(obj),
      })
      console.log(value.title)
    }
      else{

      let db =  wx.cloud.database()
      db.collection('course_account').where({
        '_openid': that.openid
      }).orderBy("pubtime", 'desc').limit(1).get({
        success: function(res){
          console.log(res)
         let account = res.data[0]
          if (account.job == 'student') {
            wx.navigateTo({
              url: '../add/add?obj=' + JSON.stringify(obj),
            })
            console.log(value.title, obj)
          }
          else {
            wx.navigateTo({
              url: '../teacherAdd/add?obj=' + JSON.stringify(obj),
            })
            console.log(value.title, obj)
          }
        }
      })
      
    
    }
  },
  getWeekNum(){
    currentTime = new Date()
    startTime = new Date();
    startTime.setFullYear(2020,2,2);
    weekNum = (currentTime.getTime() - startTime.getTime())/(7*24*60*60*1000)
    weekNum = parseInt(weekNum) + 1
    console.log(weekNum)
    return weekNum ;
  }
})