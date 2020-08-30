// pages/about/about.js
//获取应用实例
const app = getApp()

Page({
  to_instruction(){
    wx.navigateTo({
      url: '../instruction/instruction',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  add_sno: function(e) {
    wx.navigateTo({
      url: '../bind/bind',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  del_sno(e) {
    let that = this
    wx.cloud.callFunction({
      name: "getOpenid",
      success(res) {
        console.log(res)
        openid = res.result.openid
        console.log(openid)
        wx.cloud.database().collection("course_account")
          .where({
            "_openid": openid
          }).orderBy("pubtime", 'desc').limit(1)
          .get({
            success: (res) => {
              console.log(res)
              let user = res.data[0];
              // console.log(user.password)
              // console.log(that.data.prePassword)

              wx.cloud.database().collection("course_account").add({
                data: {
                  account: undefined,
                  // password: undefined,
                  job: undefined,
                  pubtime: new Date().getTime()
                },
                success(res) {

                  console.log("解除绑定成功！")
                  wx.showToast({
                    title: '解除绑定成功！'
                  })
                  wx.switchTab({
                    url: '../timetable/timetable',
                  })
                  wx.showToast({
                    title: '解除绑定成功！'
                  })
                }
              })


            }
          });
      }
    })
  },
  // getPrePassword(e) {
  //   this.setData({
  //     prePassword: e.detail.value
  //   })
  // },
  // getRePassword(e) {
  //   this.setData({
  //     rePassword: e.detail.value
  //   })
  // },
  // getNewPassword(e) {
  //   this.setData({
  //     newPassword: e.detail.value
  //   })
  // },
  enterChangePassword() {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  cancel: function() {
    this.setData({
      hiddenmodalput: true
    });
  },
  confirm: function(e) {
    // console.log(this.data.rePassword)
    // console.log(this.data.newPassword)
    let that = this;
    // if (this.data.rePassword == this.data.newPassword) {
      console.log(e)
      this.setData({
        hiddenmodalput: true
      })
      wx.cloud.callFunction({
        name: "getOpenid",
        success(res) {
          console.log(res)
          openid = res.result.openid
          console.log(openid)
          wx.cloud.database().collection("course_account")
            .where({
              "_openid": openid
            }).orderBy("pubtime", 'desc').limit(1)
            .get({
              success: (res) => {
                console.log(res)
                let user = res.data[0];
                // console.log(user.password)
                // console.log(that.data.prePassword)
                // if (user.password == that.data.prePassword) {
                  wx.cloud.database().collection("course_account").add({
                    data: {
                      account: user.account,
                      // password: user.password,
                      job: user.job,
                      pubtime: new Date().getTime()
                    },
                    success(res) {

                      console.log("绑定成功！")
                      wx.showToast({
                        title: '密码修改成功！'
                      })
                      wx.switchTab({
                        url: '../timetable/timetable',

                      })
                    }
                  })
                // } else {
                //   wx.showToast({
                //     title: '密码不正确',
                //   })
                // }

              }
            });
        }
      })

    // } else {
    //   wx.showToast({
    //     title: '两次密码不同',
    //     icon: 'none'
    //   })
    // }

  },
  data: {
    hiddenmodalput: true,
    adminPassword: "",
    // prePassword: "",
    // newPassword: "",
    // rePassword: "",
    isBind: false,
    // motto: 'Hello World',
    // userInfo: {},
    // hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  // bindViewTap: function () {
  //   wx.navigateTo({
  //     url: ''
  //   })
  // },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log("OK");
  },
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShow() {
    let that = this;
    wx.cloud.callFunction({
      name: "getOpenid",
      success(res) {
        console.log(res)
        openid = res.result.openid
        console.log(openid)
        wx.cloud.database().collection("course_account")
          .where({
            "_openid": openid
          }).orderBy("pubtime", 'desc').limit(1)
          .get({
            success: (res) => {
              console.log(res)
              let user = res.data[0];
              // console.log(user.password)
              // console.log(that.data.prePassword)
              if (user && user.account) {
              // if (user) {
                that.setData({
                  isBind: true
                })
              } else {
                that.setData({
                  isBind: false
                })
              }

            }
          });
      }
    })
  }
})