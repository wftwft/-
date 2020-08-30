// pages/details/details.js
const DB = wx.cloud.database().collection("text")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"",
    classroom:"",
    teacher:"",
    weekNum:"",
    indexKey:"",
    weekDay:"",
    dayIndex:"",
    weekArr:[]
  },
  delcourse(){
    let that = this;
    wx.cloud.callFunction({
      name: "getOpenid",
      success(res) {
        console.log(res)
        openid = res.result.openid
        console.log(openid)
        wx.cloud.database().collection("text")
          .where({
            "_openid": openid
          }).orderBy("pubtime", 'desc').limit(1)
          .get({
            success: (res) => {
              console.log(res)
              week = res.data[0].week;
              console.log(that.data.weekDay, that.data.dayIndex)
              week[that.data.weekDay-1][that.data.dayIndex] = {
              }
              let db = wx.cloud.database()
              const _ = db.command
              console.log(week)
              DB.add({
                // data 传入需要局部更新的数据
                data: {
                  // 表示将 done 字段置为 true
                  week: week,
                  pubtime: new Date().getTime()
                },

                success: function (res) {
                  console.log(res)
                  wx.showToast({
                    title: '删除成功',
                  })
                  wx.switchTab({
                    url: '../timetable/timetable',
                  })
                  wx.showToast({
                    title: '删除成功',
                  })
                },
                fail: function (err) {
                  console.log(err)
                }
              })
            }
            
          });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let obj = JSON.parse(options.obj) 
    let arr = obj.value.course;
    console.log(arr)
    let result = arr.reduce((prev,item,i)=>{
      console.log(prev.preNum,item)
      if(prev.start==0){
        prev.start = item;
        prev.str = item + "-" + item
        prev.preNum = item
      }else if(prev.preNum==(item-1)){
        prev.preNum = item
        
        prev.str = prev.str.replace("-" + (item - 1), "-" +item)
      }else{
        prev.start = item;
        prev.preNum = item
        prev.str = prev.str + "," + item + "-" + item
      }
      return prev
    },{start:0,end:1,preNum:0,str:"1-"})
    console.log(result)
    this.setData({
      title:obj.value.title,
      teacher:obj.value.teacher,
      classroom:obj.value.classroom,
      weekNum:obj.weekNum,
      indexKey:obj.indexKey,
      weekDay: (parseInt(obj.indexKey / 10)),
      dayIndex: parseInt(obj.indexKey) % 10,
      weekArr:result.str,
    })
  },
  toRenew(){
    let data = this.data;
    let params = JSON.stringify(data)
    wx.navigateTo({
      url: '/pages/renew/renew?params='+params,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})