// pages/bind/bind.js

Page({
  data: {
    account: '',
    // password: '',
    // password2: '',
    username:'',
  },

  // 获取用户名
  getAccount(event) {
    console.log("用户名", event.detail.value)
    
    this.setData({
      account: event.detail.value
    })
  },

  getUsername(event){
    //console.log("确认密码", event.detail.value)
    this.setData({
      username: event.detail.value
    })
  },
  // 提交到数据库
  regist() {
    console.log("点击注册")
    let account = this.data.account
    if (!(/^\d+$/igs.test(account))) {
      wx.showToast({
        title: '账号为非纯数字',
        icon:'none'
      })
      return;
    }
    // let password = this.data.password
    // let password2 = this.data.password2
    let username = this.data.username
    // 长度为9的是学生的学号
    if (account.length == 9) {
      // 判断密码相等
      // if (password == password2) {
        console.log('tijiao')
        wx.cloud.database().collection("course_account").add({
          data: {
            account: account,
            username:username,
            // password: password,
            job: "student",
            pubtime: new Date().getTime()
          },
          success(res) {
            wx.showToast({
              title: '绑定成功！'
            })
            wx.switchTab({
              url: '../about/about',
            })
            console.log("绑定成功！")
            wx.showToast({
              title: '绑定成功！'
            })
            
          },
          fail(error){
            console.log(error)
          }

        })
      // } else {
      //   wx.showToast({
      //     icon: 'none',
      //     title: '两次输入的密码不一致！'
      //   })
      //   console.log("两次输入的密码不一致！")
      // }
    }
    // 教师的工号长度可能是2,3,4,5
    else if (account.length == 2 || account.length == 3 || account.length == 4 || account.length == 5) {
      // 判断两次输入的密码是否相等
      // if (password == password2) {
        wx.cloud.database().collection("course_account").add({
          data: {
            account: account,
            // password: password,
            job: 'teacher',
            username: username,
            pubtime:new Date().getTime()
          },
          success(res) {
            console.log("绑定成功！")
            wx.switchTab({
              url: '../about/about',
            })
            wx.showToast({
              title: '绑定成功！'
            })
          }
        })
      // } else {
      //   wx.showToast({
      //     icon: 'none',
      //     title: '两次输入的密码不一致！'
      //   })
      //   console.log("两次输入的密码不一致！")
      // }
    } else {
      wx.showToast({
        icon: 'none',
        title: '学号/工号错误！'
      })
      console.log("学号/工号错误！")
    }
  }
})