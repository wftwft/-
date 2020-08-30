// pages/admin/admin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    className:"软件开发1班",
    classNum:"1603103"
  },
  getClassName(e){
    this.setData({
      className:e.detail.value
    })
  },
  getClassNum(e) {
    this.setData({
      classNum: e.detail.value
    })
  },
  uploadTable(){
      let that = this
      // 获取云端数据
      wx.chooseMessageFile({
        count: 1,
        type: 'all',
        async success(res) {
          console.log("选择excel成功！", res)
          var p = Promise.resolve("haha")
          let arrFileId = []
          p = res.tempFiles.reduce(async (prev, item, i) => {
            //console.log(p)
            let resultid = await prev;
            console.log(resultid)

            return new Promise((resolve, reject) => {
              wx.cloud.uploadFile({
                cloudPath: new Date().getTime() + '.xls', //.fdn云端路径
                filePath: res.tempFiles[0].path, //小程序临时文件路径

                success: (res) => {
                  console.log("上传成功", res.fileID)
                  //that.Analytical(res.fileID)
                  arrFileId.push(res.fileID)
                  console.log(resolve)
                  resolve(res.fileID)
                },
                fail: err => {
                  console.log("上传失败", err)
                }
              })

            })

          }, p)
          await p;
          console.log(arrFileId)
          that.Analytical(arrFileId)

        }
      })
    },

    Analytical(arrFileID) {
      let that = this;
      console.log("进入云函数成功"),
        wx.cloud.callFunction({
          name: "excel_admin",
          data: {
            arrFileID: arrFileID,
            className:that.data.className,
            classNum:that.data.classNum
          },
          success(res) {
            console.log("解析并上传成功", res)
            wx.showToast({
              title: '上传成功',
            })
            
          },
          fail(res) {
            console.log("解析失败")
          }
        })
    },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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