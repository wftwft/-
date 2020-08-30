// pages/set/set.js
Page({
  data: {
    user: {
      job: undefined
    },
    hiddenmodalput: true,
    adminPassword: ""
  },
  updateTeacherTable() {
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
              let user = res.data[0]
              let fileID = `cloud://timetable-20bnz.7469-timetable-20bnz-1301571615/teacher_excel/${user.username}(${user.account}).xls`;
              that.AnalyticalTeacher(fileID)
            }
          });
      }
    })
  },
  getAdminPassword(e) {
    this.setData({
      adminPassword: e.detail.value
    })
  },
  enterAdmin() {
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
    if (this.data.adminPassword == "zjadmin") {
      console.log(e)
      this.setData({
        hiddenmodalput: true
      })
      wx.navigateTo({
        url: '../adminset/adminset',
      })
    } else {
      wx.showToast({
        title: '密码错误',
        icon: 'none'
      })
    }

  },
  updateTable() {
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
              let account = res.data[0].account;
              let classNum = account.slice(0, 7)
              console.log(classNum)
              wx.cloud.database().collection("admin_table")
                .where({
                  "classNum": classNum
                }).orderBy("pubtime", 'desc').limit(1)
                .get({
                  success(res) {
                    obj = res.data[0];
                    wx.cloud.database().collection("text").add({
                      data: {
                        pubtime: new Date().getTime(),
                        week: obj.week[0],
                        classNum: obj.classNum,
                        className: obj.className
                      }
                    })
                    wx.showToast({
                      title: '更新课表成功！',
                    })
                    wx.switchTab({
                      url: '../timetable/timetable',
                    })
                    console.log("更新课表成功！")
                    wx.showToast({
                      title: '更新课表成功！'
                    })
                  }
                })
            }
          });
      }
    })
  },
  /**
   * 跳转添加课程页面
   */
  show: function(e) {
    wx.navigateTo({
      url: '../add/add'
    })
  },

  /**
   * 一键导入课表
   */
  // 选择excel表格
  onload() {
    let that = this
    // 获取云端数据
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        console.log("选择excel成功！", res)
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + '.xls', //.fdn云端路径
          filePath: res.tempFiles[0].path, //小程序临时文件路径

          success: res => {
            console.log("上传成功", res.fileID)
            that.Analytical(res.fileID)
          },
          fail: err => {
            console.log("上传失败", err)
            wx.showToast({
              title: '文件格式错误！请上传excel文件！',
              icon: 'none'
            })
          }
        })
      }
    })
  },

  Analytical(fileID) {
    console.log("进入云函数成功"),
      wx.cloud.callFunction({
        name: "excel",
        data: {
          fileID: fileID
        },
        success(res) {
          console.log('excel')
          console.log("解析并上传成功", res)
          wx.showToast({
            title: '导入成功！'
          })
          wx.switchTab({
            url: '../timetable/timetable',
          })
          console.log("导入成功！")
          wx.showToast({
            title: '导入成功！'
          })
        },
        fail(res) {
          console.log("解析失败")
          wx.showToast({
            title: '文件格式错误！请上传excel文件！',
            icon: 'none'
          })
        }
      })
  },
  /**
   * 老师端一键导入课表
   */
  // 选择excel表格
  onloadTeacher() {
    let that = this
    // 获取云端数据
    wx.chooseMessageFile({
      count: 1,
      type: 'all',
      success(res) {
        console.log("老师选择excel成功！", res)
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + '.xls', //.fdn云端路径
          filePath: res.tempFiles[0].path, //小程序临时文件路径

          success: res => {
            console.log("老师上传成功", res.fileID)
            that.AnalyticalTeacher(res.fileID)
          },
          fail: err => {
            console.log("老师上传失败", err)
          }
        })
      }
    })
  },

  AnalyticalTeacher(fileID) {
    console.log("进入云函数成功"),
      wx.cloud.callFunction({
        name: "excel_teacher",
        data: {
          fileID: fileID
        },
        success(res) {
          console.log("解析并上传成功", res)
          wx.showToast({
            title: '导入成功！'
          })
          wx.switchTab({
            url: '../timetable/timetable',
          })
          console.log("导入成功！")
          wx.showToast({
            title: '导入成功！'
          })
        },
        fail(res) {
          console.log("解析失败")
        }
      })
  },


  /**
   * 跳转查看校历页面（目前做的是查看详细内容）
   */
  card: function(e) {
    wx.navigateTo({
      url: '../calendar/calendar',
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
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
              that.setData({
                user: res.data[0]
              })
            }
          });
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  showTeacher() {
    wx.navigateTo({
      url: '/pages/teacherAdd/add',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }

})